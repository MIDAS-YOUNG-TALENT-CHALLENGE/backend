import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { LoginDTO } from './dto/request/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { plainToClass } from '@nestjs/class-transformer';
import { WorkingHourEntity } from './entities/working-hour.entity';
import { UserDto } from 'src/auth/dto/responed/user.dto';
import { UpdateUserDTO } from './dto/request/update-user.dto';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(WorkingHourEntity) private workingHourRepository: Repository<WorkingHourEntity>,
        private readonly teamService: TeamService,
        private readonly authService: AuthService
    ) { }

    private async getLastUserId() {
        const users = await this.userRepository.find({
            order: {
                userId: "DESC"
            }
        })
        return users[0].userId;
    }

    async Register(dto: CreateUserDTO) {
        //TODO::Email Unique
        const { password, role, teamCode, teamName } = dto;
        const hashedPassword = await this.HashPassword(password);
        if (role === UserRole.EMPOLYEE && !teamCode) throw new NotAcceptableException("팀 코드는 필수입니다.");
        if (role === UserRole.SUPERVISOR && (!teamCode || !teamName)) throw new NotAcceptableException("팀 코드와 이름은 필수입니다.");
        await this.SaveUser({
            ...dto,
            password: hashedPassword
        });
        const userId = await this.getLastUserId();
        if (role === UserRole.EMPOLYEE) {
            await this.SetWorkingHour(40);
            return this.teamService.joinTeam(userId, teamCode);

        }
        if (role === UserRole.SUPERVISOR) {
            return this.teamService.CreateTeam(userId, {
                teamName: teamName,
                teamCode: teamCode
            });
        }
    }

    async HashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    private async SaveUser(
        dto: CreateUserDTO
    ) {
        const user = new UserEntity();
        user.nickname = dto.nickname;
        user.role = dto.role;
        user.email = dto.email;
        user.password = dto.password;
        await this.userRepository.save(user);
        return user;
    }

    async login(dto: LoginDTO) {
        const { email, password } = dto;
        const user = await this.userRepository.findOneBy({ email: email });
        if (user === null) throw new NotFoundException("이메일을 찾을 수 없습니다.");
        const hashedPassword = user.password;
        await this.verifyPassword(password, hashedPassword);
        return this.authService.getToken(email, hashedPassword);
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new NotAcceptableException("패스워드가 맞지 않습니다.");
        }
    }

    async SetWorkingHour(workingHour: number) {
        const newWorkingHour: WorkingHourEntity = plainToClass(WorkingHourEntity, {
            workingHour: workingHour
        });
        await this.workingHourRepository.save(newWorkingHour);
    }

    async UpdateWorkingHour(workingHour: number) {
        await this.workingHourRepository.createQueryBuilder()
            .update(WorkingHourEntity)
            .set({ workingHour: workingHour })
            .where("id = :id", { id: 1 })
            .execute();
    }

    async ViewAllUser() {
        const users = await this.userRepository.findBy({ role: UserRole.EMPOLYEE });
        const nowUsers: UserDto[] = users.map(user => plainToClass(UserDto, {
            ...user,
        }, { excludeExtraneousValues: true }));
        return nowUsers;
    }

    async UpdateUser(dto: UpdateUserDTO) {
        const { userId, nickname } = dto;
        await this.userRepository.createQueryBuilder()
            .update(UserEntity)
            .set({ nickname: nickname })
            .where("userId = :userId", { userId: userId })
            .execute();
    }

    

}


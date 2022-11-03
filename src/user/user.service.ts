import { Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { LoginDTO } from './dto/request/login.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private readonly authservice: AuthService
    ) { }

    async Register(dto: CreateUserDTO) {
        const { password } = dto;
        const hashedPassword = await this.HashPassword(password);
        await this.SaveUser({
            ...dto,
            password: hashedPassword
        });
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
    }

    async login(dto: LoginDTO) {
        const { email, password } = dto;
        const user = await this.userRepository.findOneBy({ email: email });
        if (user === null) throw new NotFoundException("이메일을 찾을 수 없습니다.");
        const hashedPassword = user.password;
        await this.verifyPassword(password, hashedPassword);
        return this.authservice.getToken(email, hashedPassword);
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

}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/jwt/jwt.model';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { getWeek } from './util/date.Util';
import { CheckCommuteDTO } from './dto/request/check-commute.dto';
import { CommuteEntity } from './entities/commute.entity';
import { GetAllCommuteDTO } from './dto/request/get-all-commute.dto';

@Injectable()
export class CommuteService {
    constructor(
        @InjectRepository(CommuteEntity) private commuteRepository: Repository<CommuteEntity>,
    ) {}

    // TODO :: attendence 후 leave 유효성 검사
    async CheckCommute(dto: CheckCommuteDTO, user: User): Promise<void> {
        return this.saveCommute(dto, user);
    }

    private async saveCommute(dto: CheckCommuteDTO, user: User) {
        const { state } = dto;
        const { userId } = user;

        const date = new Date();
        // 오늘이 몇주차인지
        const week = getWeek(0);

        const commute = new CommuteEntity();
        commute.userId = userId;
        commute.state = state;
        commute.date = date;
        commute.week = week;
        await this.commuteRepository.save(commute);
    }

    async getCommute(dto: GetAllCommuteDTO) {
        const { userId } = dto;
        const commutes = await this.commuteRepository.find({
            where: {
                userId: userId
            },
            order: {
                date: "ASC"
            }
        });
        if (commutes.length == 0) throw new NotFoundException('출퇴근 정보를 찾을 수 없습니다');
        return commutes;
    }
}


import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/jwt/jwt.model';
import { v4 as getUUID } from 'uuid';
import { Repository } from 'typeorm';
import { CreateTeamDTO } from './dto/request/create-team.dto';
import { MemberEntity } from './entities/member.entity';
import { TeamEntity } from './entities/team.entity';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>,
    ) {}

    async CreateTeam(user: User, dto: CreateTeamDTO) {
        const teamInfo = await this.teamRepository.findOne({
            where: {
                name: dto.teamName
            }
        });
        if (teamInfo) throw new ConflictException('팀이 이미 존재합니다.');
        
        const newTeamId = getUUID();
        const newTeam: TeamEntity = plainToClass(TeamEntity, {
            teamId: newTeamId,
            teamCode: dto.teamCode,
            name: dto.teamName,
            leaderId: user.userId,
        });

        const newLeader: MemberEntity = plainToClass(MemberEntity, {
            team: newTeam,
            userId: user.userId
        });

        await this.teamRepository.save(newTeam);
        await this.memberRepository.save(newLeader);
        return {
            teamId: newTeamId
        }
    }
}

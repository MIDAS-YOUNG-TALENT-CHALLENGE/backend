import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { User } from 'src/auth/jwt/jwt.model';
import { v4 as getUUID } from 'uuid';
import { Repository } from 'typeorm';
import { CreateTeamDTO } from './dto/request/create-team.dto';
import { MemberEntity } from './entities/member.entity';
import { TeamEntity } from './entities/team.entity';
import { TeamUtil } from './team.util';

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>,
        private readonly teamUtil: TeamUtil
    ) {}

    async CreateTeam(userId: number, dto: CreateTeamDTO) {
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
            leaderId: userId,
        });

        const newLeader: MemberEntity = plainToClass(MemberEntity, {
            team: newTeam,
            userId: userId
        });

        await this.teamRepository.save(newTeam);
        await this.memberRepository.save(newLeader);
        return {
            teamCode: dto.teamCode
        }
    }

    async joinTeam(userId: number, teamCode: string) {
        const teamCodeInfo = await this.teamRepository.findOne({
            where: {
                teamCode: teamCode
            }
        });
        if (teamCodeInfo === null) throw new NotFoundException("팀 코드에 맞는 팀을 찾을 수 없습니다.");

        const { team: teamInfo, member: memberInfo } = await this.teamUtil.getTeamAndMember(teamCodeInfo.teamId, userId);
        if (teamInfo === null) throw new NotFoundException('팀을 찾을 수 없습니다.');
        if (memberInfo !== null) throw new ConflictException('이미 들어간 팀입니다.');

        const newMember: MemberEntity = plainToClass(MemberEntity, {
            team: teamInfo,
            userId: userId
        });

        await this.memberRepository.save(newMember);
        return {
            teamId: teamInfo.teamId
        };

    }

    async GetTeamMember(user: User) {
        const teamInfoList: TeamEntity = (await this.memberRepository.findOne({
            relations: {
                team: {
                    members: true
                }
            },
            where: {
                userId: user.userId
            }
        })).team;
        if (!teamInfoList) return [];
        return teamInfoList;
    }

}

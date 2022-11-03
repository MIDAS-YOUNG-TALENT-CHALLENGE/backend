import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Injectable()
export class TeamUtil {
    constructor(
        @InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>,
        @InjectRepository(MemberEntity) private memberRepository: Repository<MemberEntity>
    ) {}

    async getTeam(teamId: string): Promise<TeamEntity> {
        const teamInfo = await this.teamRepository.findOne({
            relations: {
                leader: true,
                members: true
            },
            where: {
                teamId: teamId
            }
        });
        if (!teamInfo) return null;
        return teamInfo;
    }
    
    async getTeamListByUserId(userId: number) : Promise<TeamEntity[]> {
        const teamInfoList: TeamEntity[] = (await this.memberRepository.find({
            relations: {
                user: true,
                team: {
                    leader: true,
                    members: true
                }
            },
            where: {
                userId: userId
            }
        })).map(member => member.team);
        
        if (!teamInfoList) return [];
        return teamInfoList;
    }

    async getTeamIdByUserId(userId: number) {
        const teamInfo = (await this.memberRepository.findOne({
            relations: {
                user: true,
                team: {
                    leader: true,
                    members: true
                }
            },
            where: {
                userId: userId
            }
        }));
        if (!teamInfo) throw new NotFoundException("팀을 찾을 수 없습니다.");
        return teamInfo.teamId;
    }

    async getTeamMemberList(teamId: string) : Promise<MemberEntity[]> {
        const memberInfo = await this.memberRepository.find({
            relations: {
                user: true
            },
            where: {
                teamId
            }
        });
        return memberInfo;
    }

    async getTeamAndMember(
        teamId: string,
        userId: number
    ) : Promise<{
        team: null | TeamEntity,
        member: null | MemberEntity
    }> {
        const team = await this.teamRepository.findOne({
            relations: {
                leader: true
            },
            where: {
                teamId: teamId
            }
        });
        
        if (!team) {
            return {
                team: null,
                member: null
            }
        }

        const member = await this.memberRepository.findOne({
                relations: {
                    user: true
                },
                where: {
                    teamId,
                    userId: userId
                }
        });

        if (!member) {
            return {
                team,
                member: null
            }
        }

        return {
            team,
            member
        }
    }
}

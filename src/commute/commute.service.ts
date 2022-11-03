import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/jwt/jwt.model';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { getWeek } from './util/date.Util';
import { CheckCommuteDTO } from './dto/request/check-commute.dto';
import { CommuteEntity, CommuteState } from './entities/commute.entity';
import { GetAllCommuteDTO } from './dto/request/get-all-commute.dto';
import { WorkingHourEntity } from 'src/user/entities/working-hour.entity';

@Injectable()
export class CommuteService {
    constructor(
        @InjectRepository(CommuteEntity) private commuteRepository: Repository<CommuteEntity>,
        @InjectRepository(WorkingHourEntity) private workingHourRepository: Repository<WorkingHourEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

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

        if (state === CommuteState.LEAVE) await this.UpdateTotalHour(userId);
    }

    async GetAllCommute(dto: GetAllCommuteDTO) {
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

    async GetCommuteState(userId: number) {

        const commutes = await this.commuteRepository.find({
            where: {
                userId: userId
            },
            order: {
                date: "DESC"
            }
        });
        if (commutes.length === 0) throw new NotFoundException('출퇴근 정보를 찾을 수 없습니다.');

        const workingWeeklyHour = await this.workingHourRepository.find({
            order: { id: "DESC" }
        });
        if (workingWeeklyHour.length === 0) throw new NotFoundException('총 근무 시간 정보를 찾을 수 없습니다.');

        const newYearDate = commutes[0].date.getFullYear().toString() + "-01-01";

        // TODO::출퇴근이 다른 일자일 때도 체크
        const workingAttendenceHourSum = await this.commuteRepository.createQueryBuilder()
            .where('week = :week', { week: commutes[0].week })
            .andWhere(':newYearDate <= date AND date <= :todayDate', { newYearDate: newYearDate, todayDate: commutes[0].date })
            .andWhere('state = :state', { state: CommuteState.ATTENDANCE })
            .select("SUM(date)", "sum")
            .getRawOne();

        const workingLeavingHourSum = await this.commuteRepository.createQueryBuilder()
            .where('week = :week', { week: commutes[0].week })
            .andWhere(':newYearDate <= date AND date <= :todayDate', { newYearDate: newYearDate, todayDate: commutes[0].date })
            .andWhere('state = :state', { state: CommuteState.LEAVE })
            .select("SUM(date)", "sum")
            .getRawOne();
        
        const workingWeeklyTotalHour = workingLeavingHourSum.sum ? workingLeavingHourSum.sum - workingAttendenceHourSum.sum : 0;

        if (commutes[0].state === CommuteState.LEAVE) {
            // 퇴근시간 - 출근시간
            const workingHour = commutes[0].date.getTime() - commutes[1].date.getTime();
            const todayState = workingHour / (1000 * 60 * 60) - workingWeeklyHour[0].workingHour / 5;
            const weeklyState = workingWeeklyHour[0].workingHour - workingWeeklyTotalHour / (10000);
            return {
                state: CommuteState.LEAVE,
                message: '일 끝남',
                workingHour: workingWeeklyHour[0].workingHour,
                todayState: todayState.toFixed(1),
                weeklyState: weeklyState.toFixed(1)
            }
        }

        if (commutes[0].state === CommuteState.ATTENDANCE) {
            const now = new Date();
            const timeFromAttendance = now.getTime() - commutes[0].date.getTime();
            const timeFromAttendanceHour = Math.floor(timeFromAttendance / (1000 * 60 * 60));
            const timeFromAttendanceMinute =  Math.floor(timeFromAttendance / (1000 * 60)) - (timeFromAttendanceHour * 60);
            const weeklyState = workingWeeklyHour[0].workingHour - workingWeeklyTotalHour / (10000);
            return {
                state: CommuteState.ATTENDANCE,
                message: '일 중',
                workingHour: workingWeeklyHour[0].workingHour,
                weeklyState: weeklyState,
                timeFromAttendanceHour: timeFromAttendanceHour,
                timeFromAttendanceMinute: timeFromAttendanceMinute
            }
        }
    }

    private async UpdateTotalHour(userId: number) {
        const commutes = await this.commuteRepository.find({
            where: {
                userId: userId
            },
            order: {
                date: "DESC"
            }
        });
        const workingTime = commutes[0].date.getTime() - commutes[1].date.getTime();
        const workingHour = Math.floor(workingTime / (1000 * 60 * 60))
        await this.userRepository.createQueryBuilder()
            .update(UserEntity)
            .set({ totalWorkingHour: () => `totalWorkingHour + ${workingHour}` })
            .where("userId = :userId", { userId: userId })
            .execute()
    }

}


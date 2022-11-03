import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/jwt/jwt.model';
import { v4 as getUUID } from 'uuid';
import { Repository, UpdateEvent } from 'typeorm';
import { CreateTaskDTO } from './dto/request/create-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TeamUtil } from 'src/team/team.util';
import { UpdateTaskDTO } from './dto/request/update-task.dto';
import { UpdateTaskStartedDTO } from './dto/request/update-task-started.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity) private taskRepository: Repository<TaskEntity>,
        private readonly teamUtil: TeamUtil
    ) { }

    async CreateTask(dto: CreateTaskDTO, user: User) {
        const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
        const newTask: TaskEntity = plainToClass(TaskEntity, {
            teamId: teamId,
            taskId: getUUID(),
            title: dto.title,
            location: dto.location,
            description: dto.description,
            mentionId: dto.mention,
            important: dto.important
        })
        await this.taskRepository.save(newTask);
    }

    async DeleteTask(taskId: string) {
        await this.taskRepository.createQueryBuilder()
            .delete()
            .where("taskId = :taskId", { taskId: taskId })
            .execute()
    }

    async ViewTeamTask(user: User) {
        const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
        return this.taskRepository.find({
            relations: {
                mention: true
            },
            select: {
                mention: {
                    nickname: true
                }
            },
            where: { teamId: teamId }
        });
    }

    async UpdateTask(dto: UpdateTaskDTO) {
        await this.taskRepository.createQueryBuilder()
            .update(TaskEntity)
            .set({
                title: dto.title,
                location: dto.location,
                description: dto.description,
                mentionId: dto.mention,
                important: dto.important
            })
            .where("taskId = :taskId", { taskId: dto.taskId })
            .execute();
    }

    async UpdateTaskState(dto: UpdateTaskStartedDTO, user: User) {
        await this.taskRepository.createQueryBuilder()
            .update(TaskEntity)
            .set({
                started: dto.started === "true" ? true : false,
                managerId: user.userId
            })
            .where("taskId = :taskId", { taskId: dto.taskId })
            .execute();
    }

    

    async ViewMyCommit(user: User) {
        return await this.taskRepository.find({
            where: { managerId: user.userId, completed: true, examined: true }
        });
    }
}

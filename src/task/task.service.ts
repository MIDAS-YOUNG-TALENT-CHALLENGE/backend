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
import { UpdateTaskCompeletedDTO } from './dto/request/update-task-completed.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private readonly teamUtil: TeamUtil,
  ) {}

  async CreateTask(dto: CreateTaskDTO, user: User) {
    const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
    const newTask: TaskEntity = plainToClass(TaskEntity, {
      teamId: teamId,
      taskId: getUUID(),
      title: dto.title,
      location: dto.location,
      description: dto.description,
      mentionId: dto.mention,
      important: dto.important,
    });
    await this.taskRepository.save(newTask);
  }

  async DeleteTask(taskId: string) {
    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .where('taskId = :taskId', { taskId: taskId })
      .execute();
  }

  async ViewTeamTask(user: User) {
    const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
    return this.taskRepository.find({
      relations: {
        mention: true,
      },
      select: {
        taskId: true,
        completed: true,
        title: true,
        started: true,
        description: true,
        location: true,
        mention: {
          nickname: true,
          userId: true,
        },
      },
      where: { teamId: teamId },
    });
  }

  async UpdateTask(dto: UpdateTaskDTO) {
    await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set({
        title: dto.title,
        location: dto.location,
        description: dto.description,
        mentionId: dto.mention,
        important: dto.important,
      })
      .where('taskId = :taskId', { taskId: dto.taskId })
      .execute();
  }

  async UpdateTaskStarted(dto: UpdateTaskStartedDTO, user: User) {
    await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set({
        started: dto.started === 'true' ? true : false,
        managerId: user.userId,
      })
      .where('taskId = :taskId', { taskId: dto.taskId })
      .execute();
  }

  async UpdateTaskCompeleted(dto: UpdateTaskCompeletedDTO) {
    await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set({
        completed: dto.completed === 'true' ? true : false,
        started: false,
      })
      .where('taskId = :taskId', { taskId: dto.taskId })
      .execute();
  }

  async ViewMyCommit(user: User) {
    const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
    return await this.taskRepository.find({
      where: {
        managerId: user.userId,
        completed: true,
        examined: true,
        teamId: teamId,
      },
    });
  }

  async ViewAwaitingApproval(user: User) {
    const teamId = await this.teamUtil.getTeamIdByUserId(user.userId);
    return this.taskRepository.find({
      relations: {
        manager: true,
      },
      select: {
        manager: {
          nickname: true,
        },
      },
      where: { teamId: teamId, completed: true, examined: false },
    });
  }

  async UpdateTaskExamined(taskId: string) {
    await this.taskRepository
      .createQueryBuilder()
      .update(TaskEntity)
      .set({
        examined: true,
      })
      .where('taskId = :taskId', { taskId: taskId })
      .execute();
  }
}

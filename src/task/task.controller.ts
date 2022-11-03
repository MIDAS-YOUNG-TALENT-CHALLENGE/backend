import { Body, Controller, Param, Post, UseGuards, Delete, Put, Get } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { EmployeeGuard } from 'src/auth/employee.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CreateTaskDTO } from './dto/request/create-task.dto';
import { UpdateTaskCompeletedDTO } from './dto/request/update-task-completed.dto';
import { UpdateTaskStartedDTO } from './dto/request/update-task-started.dto';
import { UpdateTaskDTO } from './dto/request/update-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post('create')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    createTask(@Body() dto: CreateTaskDTO, @GetUser() user: User) {
        return this.taskService.CreateTask(dto, user);
    }

    @Delete(':taskId')
    deleteTask(@Param('taskId') taskId) {
        return this.taskService.DeleteTask(taskId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    viewTeamTask(@GetUser() user: User) {
        return this.taskService.ViewTeamTask(user);
    }

    @Put()
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    updateTask(@Body() dto: UpdateTaskDTO, @GetUser() user: User) {
        return this.taskService.UpdateTask(dto);
    }

    @Put('started')
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    updateTaskStarted(@Body() dto: UpdateTaskStartedDTO, @GetUser() user: User) {
        return this.taskService.UpdateTaskStarted(dto, user);
    }

    @Put('completed')
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    updateTaskCompeleted(@Body() dto: UpdateTaskCompeletedDTO, @GetUser() user: User) {
        return this.taskService.UpdateTaskCompeleted(dto);
    }

    @Get('approval')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    viewAwaitingApproval(@GetUser() user: User) {
        return this.taskService.ViewAwaitingApproval(user);
    }

    @Put('examined')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    updateTaskExamined(@Body("taskId") taskId: string) {
        return this.taskService.UpdateTaskExamined(taskId);
    }

    @Get('commit')
    @UseGuards(JwtAuthGuard)
    viewMyCommit(@GetUser() user: User) {
        return this.taskService.ViewMyCommit(user);
    }
}

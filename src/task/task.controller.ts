import { Body, Controller, Param, Post, UseGuards, Delete, Put, Get } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CreateTaskDTO } from './dto/request/create-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

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

    
}

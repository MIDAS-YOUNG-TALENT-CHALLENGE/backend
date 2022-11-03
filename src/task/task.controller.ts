import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/jwt/jwt.model';
import { CreateTaskDTO } from './dto/request/create-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @Post('create')
    @UseGuards(AdminGuard)
    taskCreate(@Body() dto: CreateTaskDTO, @GetUser() user: User) {
        // this.taskService(dto, user);
    }
}

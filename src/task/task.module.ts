import { ClassTransformer } from '@nestjs/class-transformer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/team/entities/member.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { TeamUtil } from 'src/team/team.util';
import { UserEntity } from 'src/user/entities/user.entity';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, UserEntity, TeamEntity, MemberEntity]),
        ClassTransformer,
    ],
    controllers: [TaskController],
    providers: [TaskService, TeamUtil]
})
export class TaskModule { }

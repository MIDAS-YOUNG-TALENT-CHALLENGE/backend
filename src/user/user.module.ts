import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClassTransformer } from '@nestjs/class-transformer';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { WorkingHourEntity } from './entities/working-hour.entity';
import { TeamService } from 'src/team/team.service';
import { TeamModule } from 'src/team/team.module';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, WorkingHourEntity, TeamEntity, MemberEntity]),
        ClassTransformer,
        AuthModule,
        TeamModule,
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '1y' },
        })
    ],
    controllers: [UserController],
    providers: [UserService, AuthService, TeamService]
})
export class UserModule { }

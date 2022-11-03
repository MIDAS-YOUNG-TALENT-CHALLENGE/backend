import { ClassTransformer } from '@nestjs/class-transformer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from './entities/member.entity';
import { TeamEntity } from './entities/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamUtil } from './team.util';

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity, TeamEntity, MemberEntity]),
      ClassTransformer
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamUtil],
  exports: [TeamUtil]
})
export class TeamModule {}

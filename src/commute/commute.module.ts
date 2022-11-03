import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { WorkingHourEntity } from 'src/user/entities/working-hour.entity';
import { CommuteController } from './commute.controller';
import { CommuteService } from './commute.service';
import { CommuteEntity } from './entities/commute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommuteEntity, UserEntity, WorkingHourEntity])
  ],
  controllers: [CommuteController],
  providers: [CommuteService]
})
export class CommuteModule {}

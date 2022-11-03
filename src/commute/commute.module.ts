import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommuteController } from './commute.controller';
import { CommuteService } from './commute.service';
import { CommuteEntity } from './entities/commute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommuteEntity, UserEntity])
  ],
  controllers: [CommuteController],
  providers: [CommuteService]
})
export class CommuteModule {}

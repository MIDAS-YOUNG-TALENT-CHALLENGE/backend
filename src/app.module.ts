import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommuteModule } from './commute/commute.module';
import { TeamModule } from './team/team.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    AuthModule, 
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/entities/*.entity.{js,ts}']
    }),
    CommuteModule,
    TeamModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

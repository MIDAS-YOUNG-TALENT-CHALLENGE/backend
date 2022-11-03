import { Controller, Body, Post, UseGuards, Get, Param } from '@nestjs/common';
import { get } from 'http';
import { AdminGuard } from 'src/auth/admin.guard';
import { EmployeeGuard } from 'src/auth/employee.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CommuteService } from './commute.service';
import { CheckCommuteDTO } from './dto/request/check-commute.dto';
import { GetAllCommuteDTO } from './dto/request/get-all-commute.dto';

@Controller('commute')
export class CommuteController {

    constructor(private readonly commuteService: CommuteService) { }

    @Post('check')
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    checkCommute(@Body() dto: CheckCommuteDTO, @GetUser() user: User) {
        return this.commuteService.CheckCommute(dto, user);
    }

    @Get(':userId')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    getAllCommute(@Param() dto: GetAllCommuteDTO) {
        return this.commuteService.GetAllCommute(dto);
    }

    @Get()
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    getMyCommute(@GetUser() user: User) {
        return this.commuteService.GetCommuteState(user);
    }



}

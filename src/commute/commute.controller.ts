import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { EmployeeGuard } from 'src/auth/employee.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CommuteService } from './commute.service';
import { CheckCommuteDTO } from './dto/request/check-commute.dto';

@Controller('commute')
export class CommuteController {

    constructor(private readonly commuteservice: CommuteService) { }

    @Post('check')
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    checkCommute(@Body() dto: CheckCommuteDTO, @GetUser() user: User) {
        return this.commuteservice.CheckCommute(dto, user);
    }

}

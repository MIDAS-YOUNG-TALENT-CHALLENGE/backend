import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { EmployeeGuard } from 'src/auth/employee.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CreateTeamDTO } from './dto/request/create-team.dto';
import { TeamService } from './team.service';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post('create')
    @UseGuards(AdminGuard)
    createTeam(
        @GetUser() user: User,
        @Body() dto: CreateTeamDTO
    ) {
        return this.teamService.CreateTeam(user, dto);
    }

    @Post('join')
    @UseGuards(EmployeeGuard)
    joinTeam(
        @GetUser() user: User,
        @Body('teamCode') teamCode: string
    ) {
        return this.teamService.joinTeam(user, teamCode);
    }
    
    @Get('member')
    @UseGuards(JwtAuthGuard)
    getTeamMember(@GetUser() user: User) {
        return this.teamService.GetTeamMember(user);
    }

}

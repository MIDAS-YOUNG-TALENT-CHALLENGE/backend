import { Body, Controller, Post, Get, UseGuards, Put, Param } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { EmployeeGuard } from 'src/auth/employee.guard';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/auth/jwt/jwt.model';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { LoginDTO } from './dto/request/login.dto';
import { UpdateUserDTO } from './dto/request/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post('create')
    createUser(@Body() dto: CreateUserDTO) {
        return this.userService.Register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDTO) {
        return this.userService.login(dto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    test(@GetUser() user: User) {
        return user;
    }

    @Put('set/hours')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    setWorkingHours(@Body('workingHour') workingHour: number) {
        return this.userService.UpdateWorkingHour(workingHour);
    }

    @Get('all')
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    viewAllUser() {
        return this.userService.ViewAllUser();
    }

    @Put()
    @UseGuards(AdminGuard)
    @UseGuards(JwtAuthGuard)
    updateUser(@Body() dto: UpdateUserDTO) {
        return this.userService.UpdateUser(dto);
    }

    @Put('my')
    @UseGuards(EmployeeGuard)
    @UseGuards(JwtAuthGuard)
    updateMyInfo(@GetUser() user: User, @Body("nickname") nickname: string) {
        console.log(nickname);
        const dto: UpdateUserDTO = {
            userId: user.userId,
            nickname: nickname
        }
        return this.userService.UpdateUser(dto);
    }

}
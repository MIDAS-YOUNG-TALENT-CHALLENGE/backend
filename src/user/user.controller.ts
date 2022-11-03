import { Body, Controller, Post, Get, UseGuards, Put, Param } from '@nestjs/common';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CreateUserDTO } from './dto/request/create-user.dto';
import { LoginDTO } from './dto/request/login.dto';
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
    test(@GetUser() user) {
        return user;
    }

    // Todo::Team User List

}

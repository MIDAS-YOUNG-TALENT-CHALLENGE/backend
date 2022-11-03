import { Transform } from 'class-transformer';
import { IsIn, IsString, Matches, MaxLength, MinLength, IsEmail, IsNumber, IsOptional } from 'class-validator'
import { UserRole } from 'src/user/entities/user.entity';

export class CreateUserDTO {
    
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    nickname: string;

    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;

    @IsIn(["supervisor", "employee"])
    role: UserRole

    @IsOptional()
    @IsString()
    teamCode?: string;

    @IsOptional()
    @IsString()
    teamName?: string;

}
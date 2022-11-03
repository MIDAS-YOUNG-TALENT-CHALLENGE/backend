import { Transform } from 'class-transformer';
import { IsIn, IsString, Matches, MaxLength, MinLength, IsEmail } from 'class-validator'
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

}
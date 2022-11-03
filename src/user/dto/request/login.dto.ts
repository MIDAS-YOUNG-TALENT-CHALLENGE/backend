import { IsString, Matches, IsEmail } from 'class-validator'

export class LoginDTO {

    @IsEmail()
    email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;

}
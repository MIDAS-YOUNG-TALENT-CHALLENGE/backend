import { Transform } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDTO {

    @IsNumber()
    userId: number;
    
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    nickname: string;

}
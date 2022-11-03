import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class CreateTaskDTO {

    @IsString()
    title: string;

    @IsString()
    location: string;

    @IsString()
    description: string;

    @IsNumber()
    mention: number;

    @IsBoolean()
    important: Boolean;
    
}
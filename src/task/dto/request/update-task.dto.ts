import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateTaskDTO {

    @IsString()
    taskId: string;

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
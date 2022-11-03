import { IsIn, IsString } from "class-validator";

export class UpdateTaskStartedDTO {

    @IsString()
    taskId: string;

    @IsIn(['true', 'false'])
    started: string;
    
}
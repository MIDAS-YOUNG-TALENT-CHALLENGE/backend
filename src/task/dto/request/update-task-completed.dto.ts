import { IsIn, IsString } from "class-validator";

export class UpdateTaskCompeletedDTO {

    @IsString()
    taskId: string;

    @IsIn(['true'])
    completed: string;

}
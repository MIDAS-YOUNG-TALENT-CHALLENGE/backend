import { IsNumber } from 'class-validator';
export class GetAllCommuteDTO {
    
    @IsNumber()
    userId: number;

}
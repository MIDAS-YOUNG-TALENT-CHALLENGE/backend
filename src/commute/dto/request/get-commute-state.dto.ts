import { IsNumber } from 'class-validator';
export class GetCommuteStateDTO {
    
    @IsNumber()
    userId: number;

}
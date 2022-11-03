import { IsIn } from 'class-validator';
import { CommuteState } from 'src/commute/entities/commute.entity';

export class CheckCommuteDTO {
    
    @IsIn(["attendance", "leave"])
    state: CommuteState;

}
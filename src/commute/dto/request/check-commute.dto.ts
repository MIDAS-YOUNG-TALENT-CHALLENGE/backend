import { Transform } from 'class-transformer';
import { IsIn, IsString, Matches, MaxLength, MinLength, IsEmail, IsDate } from 'class-validator'
import { CommuteState } from 'src/commute/entities/commute.entity';
import { UserRole } from 'src/user/entities/user.entity';

export class CheckCommuteDTO {
    
    @IsIn(["attendance", "leave"])
    state: CommuteState;

}
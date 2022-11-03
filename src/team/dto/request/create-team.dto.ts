import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateTeamDTO {

    @IsString()
    teamName: string;

    @IsString()
    teamCode: string;

}
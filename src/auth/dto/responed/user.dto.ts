import { Expose } from "@nestjs/class-transformer";
import { UserRole } from "src/user/entities/user.entity";

export class UserDto {

    @Expose()
    userId: number;

    @Expose()
    role: UserRole;

    @Expose()
    nickname: string;

    @Expose()
    email: string;

}
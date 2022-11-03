import { UserRole } from "src/user/entities/user.entity";

export type User = {
    usercode: number,
    role: UserRole,
    nickname: string,
    email: string,
}
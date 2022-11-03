import { UserRole } from "src/user/entities/user.entity";

export type User = {
    userId: number,
    role: UserRole,
    nickname: string,
    email: string,
}
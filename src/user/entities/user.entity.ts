import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    SUPERVISOR = "supervisor",
    EMPOLYEE = "employee",
}

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ unsigned: true })
    userId: number;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.EMPOLYEE
    })
    role: UserRole;

    @Column({
        nullable: false,
        length: 20
    })
    nickname: string;

    @Column({
        length: 20,
        nullable: false
    })
    email: string;

    @Column({
        length: 200,
        nullable: false
    })
    password: string;

    @Column({
        length: 50,
        nullable: true,
        default: "주소 등록 안함"
    })
    address: string;

    @Column({
        type: "int",
        default: 0  
    })
    totalWorkingHour: number;
    
}

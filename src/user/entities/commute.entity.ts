import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export enum CommuteState {
    ATTENDANCE = "attendance",
    LEAVE = "leave",
}

@Entity('commute')
export class CommuteEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ unsigned: true })
    commuteId: number;

    @ManyToOne(type => UserEntity, user => user.userId)
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    userId: number;

    @Column({
        type: "enum",
        enum: CommuteState,
        default: CommuteState.ATTENDANCE
    })
    state: CommuteState;

    @Column({
        type: Date
    })
    date: Date;

    @Column({
        unsigned: true
    })
    week: number;
    
}

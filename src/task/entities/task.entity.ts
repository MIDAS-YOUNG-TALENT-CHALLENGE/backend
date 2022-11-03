import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/team/entities/member.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('task')
export class TaskEntity {

    @PrimaryColumn({ type: "uuid" })
    taskId: string;

    @ManyToOne(type => TeamEntity, team => team.teamId)
    @JoinColumn({ name: 'teamId' })
    team: TeamEntity;

    @ManyToOne(type => UserEntity, manager => manager.userId)
    @JoinColumn({ name: 'managerId' })
    manager: UserEntity;

    @Column({ nullable: true, unsigned: true })
    managerId: number;

    @Column({ nullable: false, type: 'uuid' })
    teamId: string;

    @Column({
        length: 64
    })
    title: string;

    @Column({
        length: 64
    })
    location: string;

    @Column({
        length: 1000
    })
    description: string;

    @ManyToOne(type => UserEntity, mention => mention.userId)
    @JoinColumn({ name: 'mentionId' })
    mention: UserEntity;

    @Column({ nullable: true, unsigned: true })
    mentionId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ 
        type: Boolean, 
        default: false
    })
    important: Boolean;

    @Column({ 
        type: Boolean, 
        default: false
    })
    started: Boolean;

    @Column({ 
        type: Boolean, 
        default: false
    })
    completed: Boolean;

    @Column({ 
        type: Boolean, 
        default: false
    })
    examined: Boolean;

}

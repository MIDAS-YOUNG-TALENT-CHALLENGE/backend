import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Entity('task')
export class TaskEntity {

    @PrimaryColumn({ type: "uuid" })
    taskId: string;

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

    @Column({ nullable: false, unsigned: true })
    mentionId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ 
        type: Boolean, 
        default: false
    })
    important: Boolean;
}

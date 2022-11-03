import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/team/entities/member.entity';

@Entity('team')
export class TeamEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => UserEntity, leader => leader.userId)
    @JoinColumn({name: 'leaderId'})
    leader: UserEntity;

    @Column({nullable: false, unsigned: true})
    leaderId: number;
    
    @Column({
        length: 32
    })
    name: string;

    @Column({
        type: "int",
        width: 4
    })
    teamCode: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(type => MemberEntity, member => member.team)
    members: MemberEntity[];
}

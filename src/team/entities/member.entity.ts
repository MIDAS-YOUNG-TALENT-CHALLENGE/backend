import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('member')
export class MemberEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({unsigned: true})
    id: number;

    @ManyToOne(type => TeamEntity, team => team.members, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'teamId'})
    team: TeamEntity;

    @Column({nullable: false, type:"uuid"})
    teamId: string;

    @ManyToOne(type => UserEntity, user => user.userId)
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column({nullable: false, unsigned: true})
    userId: number;

    @CreateDateColumn({nullable: false})
    createdAt: Date
}

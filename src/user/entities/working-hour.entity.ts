import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('working-hour')
export class WorkingHourEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn({ unsigned: true })
    id: number;

    @Column({
        type: "int",
        width: 4
    })
    workingHour: number;

}

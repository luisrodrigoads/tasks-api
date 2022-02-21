import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import moment from "moment";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @CreateDateColumn({type: "timestamp"})
    created_at: Date;

    @Column({type:"timestamp",nullable: true})
    deadline_at: Timestamp;

    @Column({type:"timestamp", nullable: true})
    finished_at: Timestamp;

    @UpdateDateColumn({type: "timestamp",nullable: true})
    updated_at:Timestamp;

    @Column({default: false})
    isFinished: boolean;

    @Column({default: false})
    isLate: boolean;

}
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    Timestamp, 
    UpdateDateColumn 
    } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @Column({type:"timestamp",nullable: true})
    deadlineAt: Timestamp;

    @Column({type:"timestamp", nullable: true})
    finishedAt: Timestamp;

    @UpdateDateColumn({type: "timestamp",nullable: true})
    updatedAt:Timestamp;

    @Column({default: false})
    isFinished: boolean;

    @Column({default: false})
    isLate: boolean;

}
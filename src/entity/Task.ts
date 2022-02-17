import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @CreateDateColumn({type: "timestamp",default: "now()"})
    created_at: Date;

    @Column({type: "timestamp",nullable: true})
    deadline_at: Date;

    @Column({type: "timestamp",nullable: true})
    finished_at: Date;

    @UpdateDateColumn({type: "timestamp",nullable: true})
    updated_at: Date;

    @Column({default: false})
    isFinished: boolean;

    @Column({default: false})
    isLate: boolean;

}
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Answer } from './Answer';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 400 })
    question: string

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];
}
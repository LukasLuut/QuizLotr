import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Question } from './Question';

@Entity('answers')
export class Answer {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 400 })
    answer: string

    @Column({ type: 'boolean' })
    correct: boolean;

    @ManyToOne(() => Question, question => question.answers)
    question: Question;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Question } from './Question'

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 400 })
  answer: string

  // Nunca é enviado ao cliente antes da resposta (ver QuestionService.toPublicQuestion)
  @Column({ type: 'boolean' })
  correct: boolean

  @ManyToOne(() => Question, question => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question

  @Column({ type: 'int' })
  questionId: number
}

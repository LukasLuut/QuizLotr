import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm'
import { Answer } from './Answer'

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 400 })
  question: string

  // Região da jornada (0 = Condado ... 7 = Montanha da Perdição), ver game/rules.ts
  @Index()
  @Column({ type: 'tinyint', unsigned: true })
  region: number

  // 1 = fácil, 2 = médio, 3 = difícil
  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  difficulty: number

  // Curiosidade mostrada depois da resposta
  @Column({ type: 'varchar', length: 400, nullable: true })
  explanation: string | null

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[]
}

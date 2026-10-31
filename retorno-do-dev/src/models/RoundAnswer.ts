import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm'
import { Round } from './Round'

// Uma resposta dada em uma partida. A restrição única impede responder a mesma pergunta duas vezes.
@Entity('round_answers')
@Unique('UQ_round_question', ['roundId', 'questionId'])
export class RoundAnswer {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Round, round => round.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roundId' })
  round: Round

  @Column({ type: 'int' })
  roundId: number

  @Column({ type: 'int' })
  questionId: number

  // null = tempo esgotado sem resposta
  @Column({ type: 'int', nullable: true })
  answerId: number | null

  @Column({ type: 'tinyint', unsigned: true })
  region: number

  @Column({ type: 'boolean' })
  isCorrect: boolean

  @Column({ type: 'int', default: 0 })
  points: number

  @Column({ type: 'int', default: 0 })
  elapsedSeconds: number

  @Column({ type: 'boolean', default: false })
  usedRing: boolean

  // Pulada com o Passolargo
  @Column({ type: 'boolean', default: false })
  skipped: boolean

  @CreateDateColumn({ precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  answeredAt: Date
}

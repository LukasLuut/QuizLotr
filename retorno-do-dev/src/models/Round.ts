import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, Index } from 'typeorm'
import { User } from './User'
import { RoundAnswer } from './RoundAnswer'
import type { GameMode } from '../game/rules'

export type RoundStatus = 'active' | 'finished' | 'failed' | 'abandoned'

// Uma partida. Todo o estado do jogo (pergunta atual, pontos, vidas) fica aqui, no servidor.
@Entity('rounds')
@Index(['status', 'mode', 'scoreRound'])
export class Round {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.rounds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'varchar', length: 20, default: 'normal' })
  mode: GameMode

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: RoundStatus

  // Perguntas sorteadas para a partida, em ordem
  @Column({ type: 'simple-json' })
  questionIds: number[]

  // Índice da próxima pergunta a responder
  @Column({ type: 'int', default: 0 })
  currentIndex: number

  // Quando a pergunta atual foi entregue ao cliente (base do bônus de velocidade)
  @Column({ type: 'datetime', precision: 3, nullable: true })
  currentServedAt: Date | null

  @Column({ type: 'int', default: 0 })
  scoreRound: number

  @Column({ type: 'int', default: 0 })
  correctCount: number

  @Column({ type: 'int', default: 0 })
  streak: number

  @Column({ type: 'int', default: 0 })
  maxStreak: number

  @Column({ type: 'int', nullable: true })
  lives: number | null

  // Soma do tempo de resposta (cada pergunta conta no máximo 60 s)
  @Column({ type: 'int', default: 0 })
  activeSeconds: number

  @Column({ type: 'int', default: 0 })
  completionBonus: number

  @CreateDateColumn({ precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  startedAt: Date

  @Column({ type: 'datetime', precision: 3, nullable: true })
  finishedAt: Date | null

  @OneToMany(() => RoundAnswer, ra => ra.round)
  answers: RoundAnswer[]
}

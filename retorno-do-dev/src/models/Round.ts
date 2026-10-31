import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, Index } from 'typeorm'
import { User } from './User'
import { RoundAnswer } from './RoundAnswer'
import type { GameMode, Help, Journey } from '../game/rules'

export type RoundStatus = 'active' | 'finished' | 'failed' | 'abandoned'
export type FailReason = 'lives' | 'corrupted'

// Efeitos de ajuda na pergunta atual (sobrevivem a um F5)
export interface QuestionAssist {
  eliminated?: number[]
  palantir?: { answerId: number; percent: number }[]
}

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

  // 'main' = Sociedade do Anel; 'hobbit' = jornada bônus (fora do ranking)
  @Column({ type: 'varchar', length: 20, default: 'main' })
  journey: Journey

  // Personagem do jogador no início da partida (define as habilidades)
  @Column({ type: 'varchar', length: 20, default: 'gandalf' })
  persona: string

  // O Peso do Anel: 0 a 100; em 100 a partida termina
  @Column({ type: 'int', default: 0 })
  corruption: number

  @Column({ type: 'int', default: 0 })
  ringUses: number

  // Quantas vezes cada ajuda já foi usada
  @Column({ type: 'simple-json', nullable: true })
  helpsUsed: Partial<Record<Help, number>> | null

  @Column({ type: 'simple-json', nullable: true })
  currentAssist: QuestionAssist | null

  // Escudo de Gondor (Boromir) já gasto
  @Column({ type: 'boolean', default: false })
  shieldUsed: boolean

  // Regiões em que a Teimosia Anã (Gimli) já segurou a sequência
  @Column({ type: 'simple-json', nullable: true })
  streakShieldRegions: number[] | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  failReason: FailReason | null

  // Acertos em menos de 3 s (conquista Relâmpago)
  @Column({ type: 'int', default: 0 })
  fastCorrect: number

  @Column({ type: 'int', default: 0 })
  livesLost: number

  // Perguntas sorteadas para a partida, em ordem
  @Column({ type: 'simple-json' })
  questionIds: number[]

  // Índice da próxima pergunta a responder
  @Column({ type: 'int', default: 0 })
  currentIndex: number

  // Quando a pergunta atual foi entregue ao cliente (base do bônus de velocidade)
  @Column({ type: 'datetime', precision: 3, nullable: true })
  currentServedAt: Date | null

  // Menu aberto (Esc): o relógio da pergunta fica parado desde este momento
  @Column({ type: 'datetime', precision: 3, nullable: true })
  pausedAt: Date | null

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

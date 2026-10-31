import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm'
import { User } from './User'

// Conquista desbloqueada por um jogador. Os textos ficam em game/rules.ts (ACHIEVEMENTS).
@Entity('achievements')
@Unique('UQ_user_achievement', ['userId', 'code'])
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 60 })
  code: string

  @Column({ type: 'varchar', length: 120 })
  title: string

  @ManyToOne(() => User, user => user.achievements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ type: 'int' })
  userId: number

  @CreateDateColumn()
  unlockedAt: Date
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import bcrypt from 'bcrypt'
import { Achievement } from './Achievement'
import { Round } from './Round'
import { env } from '../config/env'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 120 })
  name: string

  @Column({ type: 'varchar', unique: true, length: 160 })
  email: string

  // select: false — a senha nunca vem em consultas comuns, só quando pedida explicitamente
  @Column({ type: 'varchar', length: 100, select: false })
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Foto de perfil: código de um personagem (ver PERSONAS em game/rules.ts)
  @Column({ type: 'varchar', length: 20, nullable: true })
  avatar: string | null

  // Título escolhido pelo jogador: código de uma conquista desbloqueada (ver game/rules.ts)
  @Column({ type: 'varchar', length: 60, nullable: true })
  titleCode: string | null

  // Melhor pontuação do jogador em uma partida concluída
  @Column({ type: 'int', default: 0 })
  bestScore: number

  @OneToMany(() => Round, round => round.user)
  rounds: Round[]

  @OneToMany(() => Achievement, achievement => achievement.user)
  achievements: Achievement[]

  // O hash é feito explicitamente pelo service: assim nenhuma senha
  // (nem uma que comece com "$2") é gravada em texto puro por engano
  static hashPassword(plain: string) {
    return bcrypt.hash(plain, env.bcryptRounds)
  }

  // Compara a senha digitada com o hash salvo (exige o campo password carregado)
  validatePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password)
  }
}

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Question } from './Question';
import { User } from './User';

@Entity('rounds')
export class Round {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'integer'})
    scoreRound: number
    
    @ManyToOne(() => User, user => user.rounds)
    @JoinColumn()
    user: User;
}
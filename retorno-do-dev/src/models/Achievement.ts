import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { Answer } from './Answer';
import { User } from './User';

@Entity('achievements')
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 400 })
    title: string

    @ManyToOne(() => User, user => user.achievements)
    @JoinColumn({ name: 'userId' })
    user: User;
}
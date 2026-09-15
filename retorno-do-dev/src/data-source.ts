import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { User } from './models/User'
import { Question } from './models/Question'
import { Answer } from './models/Answer'
import { Achievement } from './models/Achievement'
import { Round } from './models/Round'

config() // carrega variáveis do .env

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Question, Answer, Achievement, Round],
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // cria tabelas automaticamente (apenas dev!)
  logging: true
})
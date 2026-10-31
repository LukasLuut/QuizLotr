import 'reflect-metadata'
import path from 'path'
import { DataSource } from 'typeorm'
import { env } from './config/env'
import { User } from './models/User'
import { Question } from './models/Question'
import { Answer } from './models/Answer'
import { Achievement } from './models/Achievement'
import { Round } from './models/Round'
import { RoundAnswer } from './models/RoundAnswer'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  charset: 'utf8mb4',
  entities: [User, Question, Answer, Achievement, Round, RoundAnswer],
  // .ts em desenvolvimento (ts-node), .js no build (dist/)
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  // O schema muda só por migrations (npm run migration:generate / migration:run)
  synchronize: false,
  // Só erros e avisos por padrão: o log de queries exporia parâmetros (e-mails, hashes)
  logging: env.sqlLogging ? ['query', 'error', 'warn'] : ['error', 'warn'],
})

// src/config/env.ts
import { config } from 'dotenv'

config({ quiet: true }) // carrega variáveis do .env (não sobrescreve as que já existem no ambiente)

// Lê uma variável obrigatória e falha cedo, com mensagem clara, se ela estiver ausente
function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Variável de ambiente ${name} não definida (veja .env_example)`)
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: required('DB_USERNAME'),
    password: process.env.DB_PASSWORD || '',
    database: required('DB_NAME'),
  },
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400,
  bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  // Origens liberadas no CORS, separadas por vírgula
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean),
  sqlLogging: process.env.DB_LOGGING === 'true',
}

export const isProduction = env.nodeEnv === 'production'
export const isTest = env.nodeEnv === 'test'

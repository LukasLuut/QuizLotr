// src/server.ts
import app from './app'
import { env } from './config/env'
import { AppDataSource } from './data-source'
import { seedQuestions } from './seeds/seed'

async function bootstrap() {
  await AppDataSource.initialize()
  // Aplica migrations pendentes e garante o banco de perguntas
  await AppDataSource.runMigrations()
  await seedQuestions(AppDataSource)
  app.listen(env.port, () => console.log(`Servidor rodando na porta ${env.port}`))
}

bootstrap().catch(err => {
  console.error('Falha ao iniciar o servidor:', err)
  process.exit(1)
})

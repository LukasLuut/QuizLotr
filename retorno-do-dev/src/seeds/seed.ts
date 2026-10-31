// src/seeds/seed.ts
import { DataSource } from 'typeorm'
import { Question } from '../models/Question'
import { Answer } from '../models/Answer'
import { QUESTIONS } from './questions'

// Insere o banco de perguntas se a tabela estiver vazia (idempotente: pode rodar várias vezes)
export async function seedQuestions(ds: DataSource) {
  const count = await ds.getRepository(Question).count()
  if (count > 0) return 0

  await ds.transaction(async manager => {
    for (const q of QUESTIONS) {
      const saved = await manager.getRepository(Question).save({
        question: q.question,
        region: q.region,
        difficulty: q.difficulty,
        explanation: q.explanation,
      })
      await manager
        .getRepository(Answer)
        .insert(q.answers.map(a => ({ answer: a.answer, correct: a.correct, questionId: saved.id })))
    }
  })
  return QUESTIONS.length
}

// Execução direta: npm run seed
if (require.main === module) {
  ;(async () => {
    const { AppDataSource } = await import('../data-source')
    await AppDataSource.initialize()
    await AppDataSource.runMigrations()
    const inserted = await seedQuestions(AppDataSource)
    console.log(inserted ? `${inserted} perguntas inseridas` : 'Perguntas já cadastradas, nada a fazer')
    await AppDataSource.destroy()
  })().catch(err => {
    console.error('Falha no seed:', err)
    process.exit(1)
  })
}

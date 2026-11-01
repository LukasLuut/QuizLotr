// src/seeds/seed.ts
import { DataSource } from 'typeorm'
import { Question } from '../models/Question'
import { Answer } from '../models/Answer'
import { QUESTIONS } from './questions'

// Insere as perguntas que ainda não estão no banco, pela região + texto (idempotente: pode rodar
// várias vezes, e um banco antigo recebe só as novas, como as regiões novas de O Hobbit)
export async function seedQuestions(ds: DataSource) {
  const rows = await ds.getRepository(Question).find({ select: { region: true, question: true } })
  const key = (region: number, question: string) => `${region}|${question}`
  const saved = new Set(rows.map(r => key(r.region, r.question)))
  const missing = QUESTIONS.filter(q => !saved.has(key(q.region, q.question)))
  if (missing.length === 0) return 0

  await ds.transaction(async manager => {
    for (const q of missing) {
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
  return missing.length
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

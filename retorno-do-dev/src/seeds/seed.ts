// src/seeds/seed.ts
import { DataSource } from 'typeorm'
import { Question } from '../models/Question'
import { Answer } from '../models/Answer'
import { QUESTIONS } from './questions'

// Insere as perguntas das regiões que ainda não têm nenhuma (idempotente: pode rodar várias
// vezes, e um banco antigo recebe só as regiões novas, como as da jornada O Hobbit)
export async function seedQuestions(ds: DataSource) {
  const rows = await ds.getRepository(Question).createQueryBuilder('q').select('DISTINCT q.region', 'region').getRawMany<{ region: number }>()
  const filled = new Set(rows.map(r => Number(r.region)))
  const missing = QUESTIONS.filter(q => !filled.has(q.region))
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

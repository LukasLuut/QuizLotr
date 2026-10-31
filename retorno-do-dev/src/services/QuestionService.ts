import { EntityManager } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Question } from '../models/Question'
import { NotFoundError } from '../errors/HttpError'
import { JOURNEY_PLAN, Journey, shuffle } from '../game/rules'

export interface PublicQuestion {
  id: number
  question: string
  region: number
  difficulty: number
  // sem o campo "correct": o gabarito só sai depois da resposta
  answers: { id: number; answer: string }[]
}

export function toPublicQuestion(q: Question): PublicQuestion {
  return {
    id: q.id,
    question: q.question,
    region: q.region,
    difficulty: q.difficulty,
    answers: shuffle(q.answers).map(a => ({ id: a.id, answer: a.answer })),
  }
}

export class QuestionService {
  private get repo() {
    return AppDataSource.getRepository(Question)
  }

  // Sorteia as perguntas de uma partida: N por região, regiões na ordem da jornada
  async drawForRound(journey: Journey = 'main'): Promise<number[]> {
    const { regions, perRegion } = JOURNEY_PLAN[journey]
    const rows = await this.repo.find({ select: { id: true, region: true } })
    const ids: number[] = []
    for (const region of regions) {
      const pool = rows.filter(r => r.region === region).map(r => r.id)
      ids.push(...shuffle(pool).slice(0, perRegion))
    }
    if (ids.length === 0) throw new NotFoundError('Nenhuma pergunta cadastrada. Rode "npm run seed".')
    return ids
  }

  async findWithAnswers(id: number, manager?: EntityManager): Promise<Question> {
    const repo = manager ? manager.getRepository(Question) : this.repo
    const question = await repo.findOne({ where: { id }, relations: { answers: true } })
    if (!question) throw new NotFoundError('Pergunta não encontrada')
    return question
  }

  // Região de cada pergunta (para o cliente saber onde a jornada muda de região)
  async regionsOf(ids: number[]): Promise<number[]> {
    if (ids.length === 0) return []
    const rows = await this.repo.find({ select: { id: true, region: true }, where: ids.map(id => ({ id })) })
    const byId = new Map(rows.map(r => [r.id, r.region]))
    return ids.map(id => byId.get(id) ?? 0)
  }
}

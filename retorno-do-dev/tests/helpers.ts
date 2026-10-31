import request from 'supertest'
import app from '../src/app'
import { AppDataSource } from '../src/data-source'
import { seedQuestions } from '../src/seeds/seed'
import { Answer } from '../src/models/Answer'

export const api = () => request(app)

// Recria o banco de teste do zero: migrations + perguntas
export async function resetDatabase() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize()
  await AppDataSource.dropDatabase()
  await AppDataSource.runMigrations()
  await seedQuestions(AppDataSource)
}

export async function closeDatabase() {
  if (AppDataSource.isInitialized) await AppDataSource.destroy()
}

let counter = 0
export const PASSWORD = 'Anel@123'

// Cadastra e loga um jogador novo, devolvendo o token
export async function createPlayer(name = 'Frodo Bolseiro') {
  counter += 1
  const email = `jogador${counter}-${Date.now()}@condado.me`
  const reg = await api().post('/auth/register').send({ name, email, password: PASSWORD })
  if (reg.status !== 201) throw new Error(`cadastro falhou: ${JSON.stringify(reg.body)}`)
  const login = await api().post('/auth/login').send({ email, password: PASSWORD })
  return { token: login.body.token as string, user: login.body.user, email }
}

export const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

// Gabarito lido direto do banco (o cliente nunca recebe isso antes de responder)
export async function correctAnswerId(questionId: number) {
  const answer = await AppDataSource.getRepository(Answer).findOneByOrFail({ questionId, correct: true })
  return answer.id
}

export async function wrongAnswerId(questionId: number) {
  const answer = await AppDataSource.getRepository(Answer).findOneByOrFail({ questionId, correct: false })
  return answer.id
}

// Busca a pergunta atual e responde certo ou errado
export async function answerCurrent(token: string, roundId: number, correct: boolean) {
  const q = await api().get(`/rounds/${roundId}/question`).set(auth(token))
  const questionId = q.body.question.id
  const answerId = correct ? await correctAnswerId(questionId) : await wrongAnswerId(questionId)
  return api().post(`/rounds/${roundId}/answer`).set(auth(token)).send({ questionId, answerId })
}

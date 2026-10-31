import { api, auth, closeDatabase, createPlayer, resetDatabase, answerCurrent, correctAnswerId, wrongAnswerId } from './helpers'
import { AppDataSource } from '../src/data-source'
import { Achievement } from '../src/models/Achievement'
import { ACHIEVEMENTS } from '../src/game/rules'

beforeAll(resetDatabase)
afterAll(closeDatabase)

// Dá ao jogador N conquistas (nível do viajante = N)
async function grantLevel(userId: number, level: number) {
  await AppDataSource.getRepository(Achievement).insert(ACHIEVEMENTS.slice(0, level).map(a => ({ code: a.code, title: a.title, userId })))
}

async function question(token: string, roundId: number) {
  return (await api().get(`/rounds/${roundId}/question`).set(auth(token))).body
}

describe('O Peso do Anel', () => {
  it('usar o Anel corrompe; a corrupção máxima encerra a partida', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    expect(round.body.persona).toBe('gandalf')
    expect(round.body.corruption).toBe(0)

    let last: any
    for (let i = 0; i < 10; i++) {
      const q = await question(p.token, round.body.id)
      last = await api()
        .post(`/rounds/${round.body.id}/answer`)
        .set(auth(p.token))
        .send({ questionId: q.question.id, answerId: await wrongAnswerId(q.question.id), useRing: true })
      if (last.body.status !== 'active') break
    }
    expect(last.body.status).toBe('failed')
    expect(last.body.failReason).toBe('corrupted')
    expect(last.body.corruption).toBe(100)
    expect(last.body.newAchievements.map((a: any) => a.code)).toContain('dominado')
    expect(last.body.summary.failReason).toBe('corrupted')
  })

  it('acerto com o Anel vale mais que sem', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    const q = await question(p.token, round.body.id)
    const res = await api()
      .post(`/rounds/${round.body.id}/answer`)
      .set(auth(p.token))
      .send({ questionId: q.question.id, answerId: await correctAnswerId(q.question.id), useRing: true })
    expect(res.body.usedRing).toBe(true)
    expect(res.body.points).toBeGreaterThanOrEqual(2000)
    expect(res.body.corruption).toBe(15)
    expect(res.body.ringUses).toBe(1)
  })
})

describe('ajudas temáticas', () => {
  it('Conselho elimina 2 erradas e persiste no F5; acaba depois do limite', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    expect(round.body.helpsAllowed.conselho).toBe(2) // Gandalf
    const q = await question(p.token, round.body.id)
    const correct = await correctAnswerId(q.question.id)

    const help = await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'conselho' })
    expect(help.status).toBe(200)
    expect(help.body.eliminated).toHaveLength(2)
    expect(help.body.eliminated).not.toContain(correct)
    expect((await question(p.token, round.body.id)).eliminated).toEqual(help.body.eliminated)

    await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'conselho' }).expect(200)
    const third = await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'conselho' })
    expect(third.status).toBe(409)
  })

  it('Palantír mostra a distribuição somando 100%', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    await question(p.token, round.body.id)
    const res = await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'palantir' })
    expect(res.body.palantir).toHaveLength(4)
    const sum = res.body.palantir.reduce((a: number, b: any) => a + b.percent, 0)
    expect(sum).toBeGreaterThanOrEqual(98)
    expect(sum).toBeLessThanOrEqual(102)
  })

  it('Lembas dá vida no Desafio; Passolargo pula sem perder a sequência', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({ mode: 'desafio' })
    const lembas = await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'lembas' })
    expect(lembas.body.lives).toBe(4)

    await answerCurrent(p.token, round.body.id, true)
    await question(p.token, round.body.id)
    const skip = await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'passolargo' })
    expect(skip.body.skipped).toBe(true)
    expect(skip.body.streak).toBe(1)
    expect(skip.body.answered).toBe(2)
    expect(skip.body.lives).toBe(4)
  })

  it('ajuda inválida responde 400', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    expect((await api().post(`/rounds/${round.body.id}/help`).set(auth(p.token)).send({ help: 'silmaril' })).status).toBe(400)
  })
})

describe('personagens e nível do viajante', () => {
  it('personagem bloqueado não pode ser escolhido; nível libera', async () => {
    const p = await createPlayer()
    expect((await api().get('/users/me').set(auth(p.token))).body.level).toBe(0)
    expect((await api().put('/users/me').set(auth(p.token)).send({ avatar: 'aragorn' })).status).toBe(400)
    expect((await api().put('/users/me').set(auth(p.token)).send({ avatar: 'sam' })).status).toBe(200)

    await grantLevel(p.user.id, 8)
    const ok = await api().put('/users/me').set(auth(p.token)).send({ avatar: 'aragorn' })
    expect(ok.status).toBe(200)
    expect(ok.body.level).toBe(8)
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    expect(round.body.persona).toBe('aragorn')
    expect(round.body.helpsAllowed.lembas).toBe(2)
  })

  it('Sam começa o Desafio com uma vida a mais', async () => {
    const p = await createPlayer()
    await api().put('/users/me').set(auth(p.token)).send({ avatar: 'sam' }).expect(200)
    const round = await api().post('/rounds').set(auth(p.token)).send({ mode: 'desafio' })
    expect(round.body.lives).toBe(4)
  })

  it('a jornada O Hobbit abre no nível 5 e fica fora do ranking', async () => {
    const p = await createPlayer('Bilbo Bolseiro')
    expect((await api().post('/rounds').set(auth(p.token)).send({ journey: 'hobbit' })).status).toBe(403)

    await grantLevel(p.user.id, 5)
    const round = await api().post('/rounds').set(auth(p.token)).send({ journey: 'hobbit' })
    expect(round.status).toBe(201)
    expect(round.body.total).toBe(12)
    expect([...new Set(round.body.regionPlan)]).toEqual([8, 9, 10])
    expect(round.body.regionRules[8].name).toBe('Enigmas no Escuro')

    let last: any
    for (let i = 0; i < round.body.total; i++) last = await answerCurrent(p.token, round.body.id, true)
    expect(last.body.status).toBe('finished')
    expect(last.body.summary.rank).toBeNull()
    expect(last.body.newAchievements.map((a: any) => a.code)).toEqual(expect.arrayContaining(['la-e-de-volta', 'tesouro-de-smaug']))

    const ranking = await api().get('/rounds/ranking?mode=normal')
    expect(ranking.body.find((r: any) => r.userId === p.user.id)).toBeUndefined()
  })
})

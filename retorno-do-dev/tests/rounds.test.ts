import { api, auth, closeDatabase, createPlayer, resetDatabase, answerCurrent, correctAnswerId } from './helpers'

beforeAll(resetDatabase)
afterAll(closeDatabase)

describe('partida', () => {
  it('sorteia 5 perguntas por região, em ordem de região', async () => {
    const p = await createPlayer()
    const res = await api().post('/rounds').set(auth(p.token)).send({ mode: 'normal' })
    expect(res.status).toBe(201)
    expect(res.body.total).toBe(40)
    expect(res.body.regionPlan).toEqual([...res.body.regionPlan].sort((a: number, b: number) => a - b))
    expect(res.body.lives).toBeNull()
  })

  it('a pergunta não traz o gabarito', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    const q = await api().get(`/rounds/${round.body.id}/question`).set(auth(p.token))
    expect(q.status).toBe(200)
    expect(q.body.question.answers).toHaveLength(4)
    expect(JSON.stringify(q.body)).not.toMatch(/correct/)
  })

  it('acerto pontua no servidor, erro vale 0 e revela a correta', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    const right = await answerCurrent(p.token, round.body.id, true)
    expect(right.status).toBe(200)
    expect(right.body.isCorrect).toBe(true)
    expect(right.body.points).toBeGreaterThanOrEqual(1000)

    const wrong = await answerCurrent(p.token, round.body.id, false)
    expect(wrong.body.isCorrect).toBe(false)
    expect(wrong.body.points).toBe(0)
    expect(wrong.body.correctAnswerId).toEqual(expect.any(Number))
    expect(wrong.body.explanation).toEqual(expect.any(String))
    expect(wrong.body.score).toBe(right.body.score)
  })

  it('responder a mesma pergunta duas vezes responde 409', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    const q = await api().get(`/rounds/${round.body.id}/question`).set(auth(p.token))
    const body = { questionId: q.body.question.id, answerId: await correctAnswerId(q.body.question.id) }
    const [a, b] = await Promise.all([
      api().post(`/rounds/${round.body.id}/answer`).set(auth(p.token)).send(body),
      api().post(`/rounds/${round.body.id}/answer`).set(auth(p.token)).send(body),
    ])
    expect([a.status, b.status].sort()).toEqual([200, 409])
  })

  it('o cliente não consegue mandar pontuação', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    const q = await api().get(`/rounds/${round.body.id}/question`).set(auth(p.token))
    const res = await api()
      .post(`/rounds/${round.body.id}/answer`)
      .set(auth(p.token))
      .send({ questionId: q.body.question.id, answerId: q.body.question.answers[0].id, score: 99999999 })
    expect(res.status).toBe(400)
  })

  it('não acessa a partida de outro jogador', async () => {
    const owner = await createPlayer()
    const other = await createPlayer()
    const round = await api().post('/rounds').set(auth(owner.token)).send({})
    expect((await api().get(`/rounds/${round.body.id}/question`).set(auth(other.token))).status).toBe(404)
  })

  it('começar outra partida abandona a anterior (F5 não soma pontos)', async () => {
    const p = await createPlayer()
    const first = await api().post('/rounds').set(auth(p.token)).send({})
    await answerCurrent(p.token, first.body.id, true)
    const second = await api().post('/rounds').set(auth(p.token)).send({})
    expect(second.body.score).toBe(0)
    expect((await api().get(`/rounds/${first.body.id}`).set(auth(p.token))).body.status).toBe('abandoned')
    expect((await api().get('/rounds/current').set(auth(p.token))).body.id).toBe(second.body.id)
  })

  it('modo desafio termina em derrota após 3 erros', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({ mode: 'desafio' })
    expect(round.body.lives).toBe(3)
    await answerCurrent(p.token, round.body.id, false)
    await answerCurrent(p.token, round.body.id, false)
    const last = await answerCurrent(p.token, round.body.id, false)
    expect(last.body.status).toBe('failed')
    expect(last.body.summary.status).toBe('failed')
  })

  it('jornada completa: 40 perguntas, bônus de conclusão, conquistas e ranking por jogador', async () => {
    const p = await createPlayer('Frodo Campeão')
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    let last: any
    const unlocked: string[] = []
    for (let i = 0; i < round.body.total; i++) {
      last = await answerCurrent(p.token, round.body.id, true)
      expect(last.status).toBe(200)
      unlocked.push(...last.body.newAchievements.map((a: any) => a.code))
    }
    expect(last.body.status).toBe('finished')
    expect(last.body.summary.correctCount).toBe(40)
    expect(last.body.summary.completionBonus).toBeGreaterThan(0)
    expect(last.body.summary.perRegion).toHaveLength(8)
    expect(last.body.summary.rank).toBe(1)
    expect(unlocked).toEqual(expect.arrayContaining(['primeiros-passos', 'sem-hesitar', 'moria-perfeita', 'queimador-de-anel', 'sabio']))

    // segunda partida concluída não duplica o jogador no ranking
    const again = await api().post('/rounds').set(auth(p.token)).send({})
    for (let i = 0; i < again.body.total; i++) await answerCurrent(p.token, again.body.id, i % 2 === 0)

    const ranking = await api().get('/rounds/ranking?mode=normal')
    expect(ranking.status).toBe(200)
    expect(ranking.body.filter((r: any) => r.userId === p.user.id)).toHaveLength(1)
    expect(ranking.body[0]).toMatchObject({ position: 1, name: 'Frodo Campeão', score: last.body.score })
    expect(JSON.stringify(ranking.body)).not.toMatch(/email|password/)

    const achievements = await api().get('/users/me/achievements').set(auth(p.token))
    expect(achievements.body.find((a: any) => a.code === 'queimador-de-anel').unlocked).toBe(true)

    const me = await api().get('/users/me').set(auth(p.token))
    expect(me.body.bestScore).toBe(last.body.score)
  })

  it('não responde depois de encerrada', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    await api().post(`/rounds/${round.body.id}/abandon`).set(auth(p.token))
    expect((await api().get(`/rounds/${round.body.id}/question`).set(auth(p.token))).status).toBe(409)
  })
})

import { api, auth, closeDatabase, createPlayer, PASSWORD, resetDatabase, answerCurrent } from './helpers'

beforeAll(resetDatabase)
afterAll(closeDatabase)

const noPassword = (body: unknown) => expect(JSON.stringify(body)).not.toMatch(/password/i)

describe('cadastro e login', () => {
  it('cadastra sem devolver a senha', async () => {
    const res = await api().post('/auth/register').send({ name: 'Samwise Gamgi', email: 'sam@condado.me', password: PASSWORD })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ name: 'Samwise Gamgi', email: 'sam@condado.me', bestScore: 0 })
    noPassword(res.body)
  })

  it('rejeita campos extras (id, score) no cadastro', async () => {
    const res = await api()
      .post('/auth/register')
      .send({ name: 'Intruso', email: 'intruso@mordor.me', password: PASSWORD, id: 1, score: 99999 })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/não é permitido/)
  })

  it('body vazio responde 400 em JSON', async () => {
    const res = await api().post('/auth/register').send()
    expect(res.status).toBe(400)
    expect(res.headers['content-type']).toMatch(/json/)
  })

  it('e-mail duplicado responde 409', async () => {
    const res = await api().post('/auth/register').send({ name: 'Sam', email: 'SAM@condado.me', password: PASSWORD })
    expect(res.status).toBe(409)
  })

  it('loga por e-mail e devolve token', async () => {
    const res = await api().post('/auth/login').send({ email: 'sam@condado.me', password: PASSWORD })
    expect(res.status).toBe(200)
    expect(res.body.token).toEqual(expect.any(String))
    noPassword(res.body.user)
  })

  it('senha errada e e-mail inexistente têm a mesma resposta', async () => {
    const wrong = await api().post('/auth/login').send({ email: 'sam@condado.me', password: 'Errada@1' })
    const unknown = await api().post('/auth/login').send({ email: 'ninguem@condado.me', password: 'Errada@1' })
    expect(wrong.status).toBe(401)
    expect(unknown.status).toBe(401)
    expect(wrong.body.message).toBe(unknown.body.message)
  })

  it('homônimos conseguem logar (login é por e-mail)', async () => {
    const a = await createPlayer('Pippin Tûk')
    const b = await createPlayer('Pippin Tûk')
    expect(a.token).toBeTruthy()
    expect(b.token).toBeTruthy()
    expect(a.user.id).not.toBe(b.user.id)
  })
})

describe('conta do jogador', () => {
  it('não existe listagem pública de usuários', async () => {
    const res = await api().get('/users')
    expect(res.status).toBe(404)
  })

  it('/me exige token', async () => {
    expect((await api().get('/users/me')).status).toBe(401)
    expect((await api().get('/users/me').set(auth('token.invalido.aqui'))).status).toBe(401)
  })

  it('não permite alterar outra conta enviando id (tomada de conta)', async () => {
    const victim = await createPlayer('Vítima')
    const attacker = await createPlayer('Atacante')
    const res = await api()
      .put('/users/me')
      .set(auth(attacker.token))
      .send({ id: victim.user.id, password: 'Tomada@123' })
    expect(res.status).toBe(400)
    const login = await api().post('/auth/login').send({ email: victim.email, password: PASSWORD })
    expect(login.status).toBe(200)
  })

  it('não permite alterar score pelo perfil nem senha fraca', async () => {
    const p = await createPlayer()
    expect((await api().put('/users/me').set(auth(p.token)).send({ bestScore: 999999 })).status).toBe(400)
    expect((await api().put('/users/me').set(auth(p.token)).send({ password: '1' })).status).toBe(400)
  })

  it('atualiza nome e senha válidos', async () => {
    const p = await createPlayer()
    const res = await api().put('/users/me').set(auth(p.token)).send({ name: 'Meriadoc', password: 'Nova@1234' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Meriadoc')
    noPassword(res.body)
    const login = await api().post('/auth/login').send({ email: p.email, password: 'Nova@1234' })
    expect(login.status).toBe(200)
  })

  it('exclui conta de quem já jogou (cascade)', async () => {
    const p = await createPlayer()
    const round = await api().post('/rounds').set(auth(p.token)).send({})
    await answerCurrent(p.token, round.body.id, true)
    const res = await api().delete('/users/me').set(auth(p.token))
    expect(res.status).toBe(200)
    expect((await api().get('/users/me').set(auth(p.token))).status).toBe(404)
  })
})

describe('foto de perfil', () => {
  const tinyPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

  it('salva, devolve e remove a foto', async () => {
    const p = await createPlayer()
    const saved = await api().put('/users/me').set(auth(p.token)).send({ avatar: tinyPng })
    expect(saved.status).toBe(200)
    expect(saved.body.avatar).toBe(tinyPng)
    const removed = await api().put('/users/me').set(auth(p.token)).send({ avatar: null })
    expect(removed.body.avatar).toBeNull()
  })

  it('rejeita o que não é imagem', async () => {
    const p = await createPlayer()
    const res = await api().put('/users/me').set(auth(p.token)).send({ avatar: 'data:text/html;base64,PHNjcmlwdD4=' })
    expect(res.status).toBe(400)
  })
})

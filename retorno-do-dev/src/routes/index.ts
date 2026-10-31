// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import roundRoutes from './round.routes'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
// Cadastro e login
router.use('/auth', authRoutes)
// Conta do jogador logado
router.use('/users', userRoutes)
// Partidas: perguntas, respostas, pontuação e ranking
router.use('/rounds', roundRoutes)

export default router

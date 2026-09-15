// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import questionRouter from './question.routes'

// Cria uma instância de Router do Express
const router = Router()

// Define as rotas principais da aplicação
// Todas as rotas de autenticação estarão em /auth
router.use('/auth', authRoutes)
// Todas as rotas de usuários estarão em /users
router.use('/users', userRoutes)
// Todas as rotas de perguntas estarão em /questions
router.use('/questions', questionRouter)

export default router
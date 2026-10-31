// src/routes/auth.routes.ts
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { AuthController } from '../controllers/AuthController'
import { validateDTO } from '../middlewares/validateDTO'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { LoginUserDTO } from '../dtos/LoginUserDTO'
import { isTest } from '../config/env'

const router = Router()
const controller = new AuthController()

// Limita tentativas de login/cadastro por IP (força bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 1000 : 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
})

// ValidateDTO valida o corpo da requisição e rejeita campos fora do DTO
router.post('/register', authLimiter, validateDTO(CreateUserDTO), controller.register.bind(controller))
router.post('/login', authLimiter, validateDTO(LoginUserDTO), controller.login.bind(controller))

export default router

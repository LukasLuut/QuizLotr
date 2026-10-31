import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { validateDTO } from '../middlewares/validateDTO'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'

const router = Router()
const controller = new UserController()

// Não existe listagem pública de usuários: cada jogador só acessa /me
router.get('/me', authMiddleware, controller.me.bind(controller))
router.put('/me', authMiddleware, validateDTO(UpdateUserDTO), controller.update.bind(controller))
router.delete('/me', authMiddleware, controller.remove.bind(controller))
router.get('/me/achievements', authMiddleware, controller.achievements.bind(controller))

export default router

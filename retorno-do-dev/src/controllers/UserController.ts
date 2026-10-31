import { Request, Response } from 'express'
import { UserService } from '../services/UserService'
import { AchievementService } from '../services/AchievementService'

const service = new UserService()
const achievements = new AchievementService()

// Todas as rotas usam req.user.id (do token): um jogador só lê e altera a própria conta
export class UserController {
  async me(req: Request, res: Response) {
    res.json(await service.findById(req.user!.id))
  }

  async update(req: Request, res: Response) {
    res.json(await service.update(req.user!.id, req.body))
  }

  async remove(req: Request, res: Response) {
    res.json(await service.remove(req.user!.id))
  }

  async achievements(req: Request, res: Response) {
    res.json(await achievements.list(req.user!.id))
  }
}

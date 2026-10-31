import { Request, Response } from 'express'
import { generateToken } from '../utils/jwt' // Importa a função que gera o JWT
import { UserService } from '../services/UserService'

const service = new UserService()

// Sem try/catch: no Express 5 os erros lançados chegam ao errorHandler central
export class AuthController {
  async register(req: Request, res: Response) {
    const user = await service.create(req.body)
    res.status(201).json(user)
  }

  // O cliente guarda o token e o envia no header Authorization: Bearer <token>
  async login(req: Request, res: Response) {
    const user = await service.authenticate(req.body)
    res.json({ user, token: generateToken(user.id) })
  }
}

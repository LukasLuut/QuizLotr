import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { UnauthorizedError } from '../errors/HttpError'

// Middleware para proteger rotas que exigem autenticação
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // Pega o header de autorização da requisição ("Bearer <token>")
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token não fornecido'))
  }

  // Retorna o id do usuário se o token for válido, ou null se inválido/expirado
  const userId = verifyToken(authHeader.slice(7))
  if (!userId) {
    return next(new UnauthorizedError('Sessão expirada ou token inválido'))
  }

  // req.user fica disponível para os controllers (ex.: /me usa req.user.id)
  req.user = { id: userId }
  next()
}

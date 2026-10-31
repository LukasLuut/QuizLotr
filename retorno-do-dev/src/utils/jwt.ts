import jwt from 'jsonwebtoken'
import { env } from '../config/env'

// O token carrega só o id do usuário (sub). Nome, e-mail e pontuação
// são buscados no banco quando necessário, para nunca ficarem desatualizados no token.
export const generateToken = (userId: number) => {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresIn,
  })
}

// Retorna o id do usuário se o token for válido, ou null se inválido/expirado
export const verifyToken = (token: string): number | null => {
  try {
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] })
    const id = typeof payload === 'object' ? Number(payload.sub) : NaN
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

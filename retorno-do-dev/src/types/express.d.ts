// Tipagem de req.user (preenchido pelo authMiddleware), sem precisar de "as any"
import 'express'

declare global {
  namespace Express {
    interface Request {
      user?: { id: number }
    }
  }
}

export {}

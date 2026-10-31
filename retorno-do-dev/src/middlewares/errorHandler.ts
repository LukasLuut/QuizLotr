// src/middlewares/errorHandler.ts
import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../errors/HttpError'
import { isProduction, isTest } from '../config/env'

// Rotas inexistentes respondem 404 em JSON (em vez da página HTML padrão do Express)
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Rota ${req.method} ${req.path} não encontrada` })
}

// Handler central: toda resposta de erro sai como JSON { message, details? }.
// No Express 5, promises rejeitadas nos controllers chegam aqui sozinhas.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, ...(err.details ? { details: err.details } : {}) })
  }

  // JSON malformado no corpo da requisição
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido no corpo da requisição' })
  }

  if (!isTest) console.error(err)
  // Nunca vaza SQL, stack trace ou caminhos do disco para o cliente
  res.status(500).json({ message: 'Erro interno do servidor', ...(isProduction ? {} : { error: String(err?.message || err) }) })
}

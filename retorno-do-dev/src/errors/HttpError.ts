// src/errors/HttpError.ts
// Erros com status HTTP. Os services lançam estes erros e o errorHandler os converte em JSON.

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
    this.name = 'HttpError'
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Requisição inválida', details?: unknown) {
    super(400, message, details)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Não autorizado') {
    super(401, message)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Acesso negado') {
    super(403, message)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Recurso não encontrado') {
    super(404, message)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflito') {
    super(409, message)
  }
}

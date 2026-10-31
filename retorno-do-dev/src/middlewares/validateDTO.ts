// src/middlewares/validateDTO.ts

// Importa funções para transformar objetos e validar classes
import { plainToInstance } from 'class-transformer' // Converte objetos comuns (JSON) em instâncias de classes
import { validate, ValidationError } from 'class-validator' // Função que valida uma instância usando decorators
import { Request, Response, NextFunction } from 'express' // Tipos do Express
import { BadRequestError } from '../errors/HttpError'

type Source = 'body' | 'params' | 'query'

// Achata os erros do class-validator em uma lista simples de mensagens por campo
function formatErrors(errors: ValidationError[]) {
  return errors.map(err => {
    const constraints = { ...(err.constraints || {}) }
    if (constraints.whitelistValidation) constraints.whitelistValidation = `O campo "${err.property}" não é permitido`
    return { field: err.property, messages: Object.values(constraints) }
  })
}

// Cria um middleware de validação para qualquer DTO.
// whitelist + forbidNonWhitelisted: campos fora do DTO (ex.: id, score) geram 400,
// o que impede mass assignment em cadastro e atualização de perfil.
export function validateDTO(dtoClass: any, source: Source = 'body') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req[source] ?? {})

    const errors = await validate(dtoObj, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    })

    if (errors.length > 0) {
      const details = formatErrors(errors)
      const message = details.flatMap(d => d.messages).join('. ')
      return next(new BadRequestError(message, details))
    }

    // Só os campos validados seguem para o controller
    if (source === 'body') req.body = dtoObj
    else Object.assign(req, { validated: { ...(req as any).validated, [source]: dtoObj } })
    next()
  }
}

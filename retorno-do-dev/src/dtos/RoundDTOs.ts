// src/dtos/RoundDTOs.ts
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min } from 'class-validator'
import { GAME_MODES, GameMode } from '../game/rules'

export class StartRoundDTO {
  @IsOptional()
  @IsIn(GAME_MODES, { message: `Modo deve ser um destes: ${GAME_MODES.join(', ')}` })
  mode?: GameMode
}

export class AnswerDTO {
  @IsInt({ message: 'questionId deve ser um número inteiro' })
  @Min(1, { message: 'questionId inválido' })
  questionId: number

  // null ou ausente = tempo esgotado sem resposta
  @IsOptional()
  @IsInt({ message: 'answerId deve ser um número inteiro' })
  @Min(1, { message: 'answerId inválido' })
  answerId?: number | null
}

export class IdParamDTO {
  @Type(() => Number)
  @IsInt({ message: 'id deve ser um número inteiro' })
  @Min(1, { message: 'id inválido' })
  id: number
}

export class RankingQueryDTO {
  @IsOptional()
  @IsIn(GAME_MODES, { message: `Modo deve ser um destes: ${GAME_MODES.join(', ')}` })
  mode?: GameMode

  @IsOptional()
  @IsIn(['all', 'week'], { message: 'Período deve ser "all" ou "week"' })
  period?: 'all' | 'week'
}

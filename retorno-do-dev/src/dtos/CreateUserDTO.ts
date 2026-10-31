// src/dtos/CreateUserDTO.ts
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

// Regras compartilhadas com o UpdateUserDTO
export const NAME_PATTERN = /^[A-Za-zÀ-ÿ\s'-]+$/
export const PASSWORD_RULES = [
  [/(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula'],
  [/(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula'],
  [/(?=.*\d)/, 'Senha deve conter pelo menos um número'],
  [/(?=.*[@$!%*?&#])/, 'Senha deve conter pelo menos um caractere especial (@$!%*?&#)'],
] as const

export class CreateUserDTO {
  @IsString({ message: 'O nome é obrigatório' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Matches(NAME_PATTERN, { message: 'Nome deve conter apenas letras e espaços' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name: string

  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email: string

  @IsString({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(72, { message: 'Senha deve ter no máximo 72 caracteres' })
  @Matches(PASSWORD_RULES[0][0], { message: PASSWORD_RULES[0][1] })
  @Matches(PASSWORD_RULES[1][0], { message: PASSWORD_RULES[1][1] })
  @Matches(PASSWORD_RULES[2][0], { message: PASSWORD_RULES[2][1] })
  @Matches(PASSWORD_RULES[3][0], { message: PASSWORD_RULES[3][1] })
  password: string
}

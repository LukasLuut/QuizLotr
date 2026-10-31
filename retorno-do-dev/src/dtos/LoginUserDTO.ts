// src/dtos/LoginUserDTO.ts
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'

// O login não repete as regras de complexidade do cadastro: só confere o formato
export class LoginUserDTO {
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email: string

  @IsString({ message: 'A senha é obrigatória' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MaxLength(72, { message: 'Senha deve ter no máximo 72 caracteres' })
  password: string
}

// src/dtos/UpdateUserDTO.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { NAME_PATTERN, PASSWORD_RULES } from './CreateUserDTO'

export const AVATAR_MAX_LENGTH = 400_000

// Mesmas regras do cadastro, mas todos os campos são opcionais.
// Qualquer outro campo (id, score...) é rejeitado pelo validateDTO.
export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'Nome inválido' })
  @IsNotEmpty({ message: 'O nome não pode ficar vazio' })
  @Matches(NAME_PATTERN, { message: 'Nome deve conter apenas letras e espaços' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name?: string

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  @MaxLength(100, { message: 'E-mail deve ter no máximo 100 caracteres' })
  email?: string

  @IsOptional()
  @IsString({ message: 'Senha inválida' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(72, { message: 'Senha deve ter no máximo 72 caracteres' })
  @Matches(PASSWORD_RULES[0][0], { message: PASSWORD_RULES[0][1] })
  @Matches(PASSWORD_RULES[1][0], { message: PASSWORD_RULES[1][1] })
  @Matches(PASSWORD_RULES[2][0], { message: PASSWORD_RULES[2][1] })
  @Matches(PASSWORD_RULES[3][0], { message: PASSWORD_RULES[3][1] })
  password?: string

  // Foto de perfil reduzida no navegador (até ~300 KB). null remove a foto.
  @IsOptional()
  @IsString({ message: 'Imagem inválida' })
  @MaxLength(AVATAR_MAX_LENGTH, { message: 'A imagem é grande demais (máx. 300 KB)' })
  @Matches(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, { message: 'A imagem deve ser PNG, JPEG ou WebP' })
  avatar?: string | null

  // Código da conquista usada como título (null volta ao título padrão)
  @IsOptional()
  @IsString({ message: 'Título inválido' })
  @MaxLength(60, { message: 'Título inválido' })
  titleCode?: string | null
}

// src/dtos/CreateUserDTO.ts
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
  @IsNotEmpty({ message: "O nome é obrigatório" })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, { message: "Nome deve conter apenas letras e espaços" })
  @MaxLength(50, { message: "Nome deve ter no máximo 50 caracteres" })
  name: string;

  @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  @Matches(/(?=.*[a-z])/, { message: "Senha deve conter pelo menos uma letra minúscula" })
  @Matches(/(?=.*[A-Z])/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
  @Matches(/(?=.*\d)/, { message: "Senha deve conter pelo menos um número" })
  @Matches(/(?=.*[@$!%*?&])/, { message: "Senha deve conter pelo menos um caractere especial (@$!%*?&)" })
  password: string;
}

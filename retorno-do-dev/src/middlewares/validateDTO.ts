// src/middlewares/validateDTO.ts

// Importa funções para transformar objetos e validar classes
import { plainToInstance } from "class-transformer"; // Converte objetos comuns (JSON) em instâncias de classes
import { validate } from "class-validator";         // Função que valida uma instância usando decorators
import { Request, Response, NextFunction } from "express"; // Tipos do Express

// Função que cria um middleware de validação para qualquer DTO
export function validateDTO(dtoClass: any) {
    // Retorna uma função compatível com Express (middleware)
    return async (req: Request, res: Response, next: NextFunction) => {
        // Converte o corpo da requisição (req.body) em uma instância da classe DTO
        // Isso é necessário para que o class-validator consiga ler os decorators (@IsEmail, @IsNotEmpty, etc.)
        const dtoObj = plainToInstance(dtoClass, req.body);

        // Valida a instância do DTO, é uma função do class-validator que verifica se está tudo como definimos
        // Retorna um array de erros, se houver algum campo inválido
        const errors = await validate(dtoObj);

        // Se houver erros, retorna resposta 400 (Bad Request) com mensagens
        if (errors.length > 0) {
            // O validate retorna um array de objetos, um para cada campo que falhou na validação.

            // errors.map(err => err.constraints) serve para extrair apenas as mensagens de erro, ignorando outras informações
            // 'constraints' contém mensagens de erro geradas pelos decorators do DTO
            // Exemplo: { name: "O nome é obrigatório", email: "E-mail inválido" }
            return res.status(400).json(errors.map(err => err.constraints));
        }

        // Se não houver erros, passa para o próximo middleware ou controller
        next();
    };
}
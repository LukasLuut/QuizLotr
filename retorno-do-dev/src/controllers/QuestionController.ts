import { Request, Response } from 'express'
import { UserService } from '../services/UserService'
import { QuestionService } from '../services/QuestionService'

const service = new QuestionService()

export class QuestionController {

    // Método para buscar todas as perguntas e respostas
    async list(req: Request, res: Response) {
        try {
            const users = await service.findAll()
            res.json(users)
        }
        catch (e: any) {
            res.status(404).json({ message: e.getMessage() })
        }
    }

    // Método para buscar uma pergunta pelo ID
    async getById(req: Request, res: Response) {
        try {
            // Pega o ID dos parâmetros da requisição
            const { id } = req.params;
            // Chama o serviço para buscar a pergunta pelo ID
            const question = await service.findById(Number(id))
            res.json(question)
        } catch (e: any) {
            res.status(404).json({ message: e.message })
        }
    }

    // Método para validar se a resposta está correta
    async validateQuestion(req: Request, res: Response) {
        try {
            // Chama o serviço para validar se a resposta está correta
            const result = await service.validateQuestion(req.body);
            res.json(result);
        }
        catch (e: any) {
            res.status(404).json({ message: e.getMessage() })
        }
    }
}
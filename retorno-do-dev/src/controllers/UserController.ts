import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

const service = new UserService()

export class UserController {

    // Método para criar um novo usuário
    async create(req: Request, res: Response) {
        try {
            // Chama o serviço para criar um novo usuário
            const user = await service.create(req.body)
            res.status(201).json(user)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    // Método para remover um usuário pelo ID
    async remove(req: Request, res: Response) {
        try {
            // Chama o serviço para remover o usuário pelo ID, passando o ID do usuário autenticado
            const result = await service.remove((req as any).user.id)
            res.json(result)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    // Método para remover um usuário pelo ID
    async removeById(req: Request, res: Response) {
        try {
            // Chama o serviço para remover o usuário pelo ID, passando o ID do usuário autenticado
            const result = await service.removeById((req as any).user.id)
            res.json(result)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    // Método para atualizar um usuário pelo ID
    async update(req: Request, res: Response) {
        try {
            // Chama o serviço para atualizar o usuário pelo 
            const user = await service.update((req as any).user.id, req.body)
            res.json(user)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    // Método para buscar um usuário pelo ID
    async getById(req: Request, res: Response) {
        try {
            // Chama o serviço para buscar o usuário pelo ID, passando o ID do usuário autenticado
            const result = await service.findById((req as any).user.id);
            res.json(result)
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    // Método para buscar um usuário pelo e-mail
    async getbyEmail(req: Request, res: Response) {
        try {
            // Chama o serviço para buscar o usuário pelo e-mail
            const result = await service.findByEmail(req.params.email);
            res.json(result)
        } catch (e: any) {
            res.status(400).json({ message: e.message})
        }
    }

    // Método para buscar todos os usuários
    async findAll (req:Request, res: Response) {
        try {
            // Chama o serviço para buscar todos os usuários
            const result = await service.findAll();
            res.json(result)
        } catch (e:any) {
            res.json (400).json({message: e.message})
        }
    }

    // Método para buscar o ranking dos usuários
    async ranking (req:Request, res: Response) {
        try {
            // Chama o serviço para buscar o ranking dos usuários
            const result = await service.ranking();
            res.json(result)
        } catch (e:any) {
            res.json (400).json({message: e.message})
        }
    }

    // Método para alterar a pontuação do usuário
    async score(req: Request, res: Response) {
        try {
            // Chama o serviço para alterar a pontuação do usuário, passando o ID do usuário autenticado e o corpo da requisição
            const user = await service.changeScore((req as any).user.id, req.body);
            return res.json(user);
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    async scoreZero(req: Request, res: Response) {
        try {
            // Chama o serviço para alterar a pontuação do usuário, passando o ID do usuário autenticado e o corpo da requisição
            const user = await service.changeScoreForZero((req as any).user.id);
            return res.json(user);
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    async createRound(req: Request, res: Response) {
        try {
            // Chama o serviço para alterar a pontuação do usuário, passando o ID do usuário autenticado e o corpo da requisição
            const user = await service.setScoreRound((req as any).user.id, req.body);
            return res.json(user);
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }

    

}



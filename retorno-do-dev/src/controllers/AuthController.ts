import { Request, Response } from 'express'
import { generateToken } from '../utils/jwt' // Importa a função que gera o JWT
import { UserService } from '../services/UserService'

const service = new UserService()

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await service.create(req.body)
      res.status(201).json(user)
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { name, password } = req.body
      const user = await service.findByName(name)
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
  
      const valid = await user.validatePassword(password)
      if (!valid) return res.status(401).json({ message: 'Senha inválida' })
  
      const safe: any = { ...user }
      delete safe.password // Remove a senha antes de enviar os dados ao cliente
  
      // ===============================
      // GERANDO O TOKEN JWT
      // ===============================
      // Aqui estamos criando um token que contém o id e o email do usuário
      // Esse token será enviado ao cliente e usado para autenticação em outras rotas
      const token = generateToken({ id: user.id, email: user.email, score: user.score, name: user.name })
      // O token é um código seguro que representa o usuário logado.
      // Exemplo de token:
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBtYWlsLmNvbSIsImlhdCI6MTY5Mjk2MDAwMCwiZXhwIjoxNjkyOTY4MDAwfQ.RANDOMHASH
  
      // ===============================
      // ENVIANDO O TOKEN AO CLIENTE
      // ===============================
      // O cliente deve guardar esse token (normalmente em localStorage ou cookies)
      // e enviá-lo em cada requisição que precisa de autenticação
      // o backend só envia o token ao cliente, não guarda
      res.json({ user: safe, token })
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }
  
}

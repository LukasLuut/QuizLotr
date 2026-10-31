import { AppDataSource } from '../data-source'
import { User } from '../models/User'
import { ConflictError, NotFoundError, UnauthorizedError } from '../errors/HttpError'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'
import { LoginUserDTO } from '../dtos/LoginUserDTO'

export interface PublicUser {
  id: number
  name: string
  email: string
  bestScore: number
  avatar: string | null
  createdAt: Date
}

// Única forma de um usuário sair da API: só campos públicos, nunca a senha
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bestScore: user.bestScore,
    avatar: user.avatar ?? null,
    createdAt: user.createdAt,
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export class UserService {
  // Repositório pra acessar o banco de dados de usuários
  private userRepository = AppDataSource.getRepository(User)

  // Cria um novo usuário. Só name, email e password são usados (o DTO já barrou o resto).
  async create(data: CreateUserDTO): Promise<PublicUser> {
    const email = normalizeEmail(data.email)
    const exists = await this.userRepository.findOne({ where: { email } })
    if (exists) throw new ConflictError('E-mail já cadastrado')

    const user = this.userRepository.create({
      name: data.name.trim(),
      email,
      password: await User.hashPassword(data.password),
    })
    await this.userRepository.save(user)
    return toPublicUser(user)
  }

  // Confere e-mail e senha. A mensagem é a mesma nos dois casos para não revelar quais e-mails existem.
  async authenticate(data: LoginUserDTO): Promise<PublicUser> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: normalizeEmail(data.email) })
      .getOne()

    const valid = user ? await user.validatePassword(data.password) : false
    if (!user || !valid) throw new UnauthorizedError('E-mail ou senha inválidos')
    return toPublicUser(user)
  }

  async findById(id: number): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundError('Usuário não encontrado')
    return toPublicUser(user)
  }

  // Atualiza só os campos permitidos, copiados um a um (sem Object.assign do body)
  async update(id: number, data: UpdateUserDTO): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundError('Usuário não encontrado')

    if (data.name !== undefined) user.name = data.name.trim()
    if (data.email !== undefined) {
      const email = normalizeEmail(data.email)
      if (email !== user.email) {
        const taken = await this.userRepository.findOne({ where: { email } })
        if (taken) throw new ConflictError('E-mail já cadastrado')
        user.email = email
      }
    }
    if (data.password !== undefined) user.password = await User.hashPassword(data.password)
    if (data.avatar !== undefined) user.avatar = data.avatar

    await this.userRepository.save(user)
    return this.findById(id)
  }

  // Remove o usuário. Partidas, respostas e conquistas saem junto (ON DELETE CASCADE).
  async remove(id: number) {
    const result = await this.userRepository.delete({ id })
    if (!result.affected) throw new NotFoundError('Usuário não encontrado')
    return { message: 'Conta excluída' }
  }
}

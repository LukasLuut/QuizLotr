import { AppDataSource } from '../data-source'
import { User } from '../models/User'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/HttpError'
import { CreateUserDTO } from '../dtos/CreateUserDTO'
import { UpdateUserDTO } from '../dtos/UpdateUserDTO'
import { LoginUserDTO } from '../dtos/LoginUserDTO'
import { Achievement } from '../models/Achievement'
import { PERSONA_INFO, achievementByCode, isPersona, isPersonaUnlocked, levelFromAchievements } from '../game/rules'

export const DEFAULT_TITLE = 'Viajante do Condado'

export interface PublicUser {
  id: number
  name: string
  email: string
  bestScore: number
  avatar: string | null
  // título exibido abaixo do nome (vem de uma conquista desbloqueada)
  title: string
  titleCode: string | null
  // Nível do viajante (= conquistas desbloqueadas): libera personagens e a jornada O Hobbit
  level: number
  createdAt: Date
}

// Única forma de um usuário sair da API: só campos públicos, nunca a senha
export function toPublicUser(user: User, level = 0): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bestScore: user.bestScore,
    // fotos antigas (imagens enviadas) não valem mais: só personagens da lista
    avatar: isPersona(user.avatar) ? user.avatar : null,
    title: (user.titleCode && achievementByCode(user.titleCode)?.title) || DEFAULT_TITLE,
    titleCode: user.titleCode ?? null,
    level,
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
    return toPublicUser(user, await this.levelOf(user.id))
  }

  async findById(id: number): Promise<PublicUser> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundError('Usuário não encontrado')
    return toPublicUser(user, await this.levelOf(id))
  }

  private async levelOf(userId: number) {
    return levelFromAchievements(await AppDataSource.getRepository(Achievement).count({ where: { userId } }))
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
    if (data.avatar !== undefined) {
      // personagens acima do nível do viajante continuam bloqueados
      if (isPersona(data.avatar) && !isPersonaUnlocked(data.avatar, await this.levelOf(id))) {
        throw new BadRequestError(`${PERSONA_INFO[data.avatar].name} abre no nível ${PERSONA_INFO[data.avatar].unlockLevel} do viajante`)
      }
      user.avatar = data.avatar
    }
    if (data.titleCode !== undefined) {
      if (data.titleCode !== null) {
        // só vale título de conquista que o jogador já desbloqueou
        const owned = await AppDataSource.getRepository(Achievement).findOne({ where: { userId: id, code: data.titleCode } })
        if (!owned) throw new BadRequestError('Este título ainda não foi desbloqueado')
      }
      user.titleCode = data.titleCode
    }

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

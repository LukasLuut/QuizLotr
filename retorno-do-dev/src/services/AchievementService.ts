import { EntityManager } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Achievement } from '../models/Achievement'
import { ACHIEVEMENTS, AchievementDef, achievementByCode } from '../game/rules'

export interface AchievementView extends AchievementDef {
  unlocked: boolean
  unlockedAt: Date | null
}

export class AchievementService {
  // Concede as conquistas que o jogador ainda não tem e devolve só as novas
  async grant(userId: number, codes: string[], manager: EntityManager = AppDataSource.manager): Promise<AchievementDef[]> {
    const unique = [...new Set(codes)]
    if (unique.length === 0) return []

    const repo = manager.getRepository(Achievement)
    const owned = await repo.find({ where: { userId }, select: { code: true } })
    const ownedCodes = new Set(owned.map(a => a.code))

    const fresh = unique.filter(c => !ownedCodes.has(c)).map(achievementByCode).filter((a): a is AchievementDef => !!a)
    if (fresh.length > 0) {
      await repo.insert(fresh.map(a => ({ code: a.code, title: a.title, userId })))
    }
    return fresh
  }

  // Lista todas as conquistas do jogo, marcando as desbloqueadas pelo jogador
  async list(userId: number): Promise<AchievementView[]> {
    const owned = await AppDataSource.getRepository(Achievement).find({ where: { userId } })
    const byCode = new Map(owned.map(a => [a.code, a]))
    return ACHIEVEMENTS.map(def => {
      const got = byCode.get(def.code)
      return { ...def, unlocked: !!got, unlockedAt: got?.unlockedAt ?? null }
    })
  }
}

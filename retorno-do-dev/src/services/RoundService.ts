import { EntityManager } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Round, RoundStatus } from '../models/Round'
import { RoundAnswer } from '../models/RoundAnswer'
import { User } from '../models/User'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/HttpError'
import { QuestionService, toPublicQuestion } from './QuestionService'
import { AchievementService } from './AchievementService'
import {
  GameMode,
  MAX_COUNTED_SECONDS,
  MODE_RULES,
  REGIONS,
  AchievementDef,
  achievementsOnAnswer,
  achievementsOnFinish,
  answerPoints,
  completionBonus,
  isTimeExpired,
} from '../game/rules'

const RANKED: RoundStatus[] = ['finished', 'failed']

export interface RoundState {
  id: number
  mode: GameMode
  status: RoundStatus
  total: number
  answered: number
  score: number
  correctCount: number
  streak: number
  lives: number | null
  timeLimitSeconds: number | null
  // região de cada pergunta da partida, na ordem (sem o conteúdo das perguntas)
  regionPlan: number[]
  startedAt: Date
}

export interface RegionStats {
  region: number
  name: string
  correct: number
  total: number
}

export interface RoundSummary {
  id: number
  mode: GameMode
  status: RoundStatus
  score: number
  completionBonus: number
  correctCount: number
  answered: number
  total: number
  maxStreak: number
  activeSeconds: number
  durationSeconds: number
  perRegion: RegionStats[]
  rank: number | null
}

export interface RankingEntry {
  position: number
  userId: number
  name: string
  score: number
}

const secondsBetween = (from: Date, to: Date) => Math.max(0, (to.getTime() - from.getTime()) / 1000)

export class RoundService {
  private questions = new QuestionService()
  private achievements = new AchievementService()

  // Inicia uma partida nova. Partidas ativas anteriores do jogador são abandonadas
  // (não entram no ranking), então F5 ou "Reiniciar" nunca somam pontos de duas partidas.
  async start(userId: number, mode: GameMode = 'normal'): Promise<RoundState> {
    const questionIds = await this.questions.drawForRound()
    const round = await AppDataSource.transaction(async manager => {
      const repo = manager.getRepository(Round)
      await repo.update({ userId, status: 'active' }, { status: 'abandoned', finishedAt: new Date() })
      const created = repo.create({
        userId,
        mode,
        status: 'active',
        questionIds,
        currentIndex: 0,
        lives: MODE_RULES[mode].lives,
      })
      return repo.save(created)
    })
    return this.toState(round)
  }

  // Partida em andamento do jogador (para "Continuar jornada"), ou null
  async current(userId: number): Promise<RoundState | null> {
    const round = await AppDataSource.getRepository(Round).findOne({
      where: { userId, status: 'active' },
      order: { id: 'DESC' },
    })
    return round ? this.toState(round) : null
  }

  async state(userId: number, roundId: number): Promise<RoundState> {
    return this.toState(await this.findOwned(userId, roundId))
  }

  // Entrega a pergunta atual. O primeiro envio marca o horário que vale para o bônus de
  // velocidade; recarregar a página não reinicia esse relógio.
  async currentQuestion(userId: number, roundId: number) {
    return AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      this.assertActive(round)

      const questionId = round.questionIds[round.currentIndex]
      if (!round.currentServedAt) {
        round.currentServedAt = new Date()
        await manager.getRepository(Round).update(round.id, { currentServedAt: round.currentServedAt })
      }
      const question = await this.questions.findWithAnswers(questionId, manager)
      const limit = MODE_RULES[round.mode].timeLimitSeconds
      const elapsed = secondsBetween(round.currentServedAt, round.pausedAt ?? new Date())

      return {
        index: round.currentIndex,
        total: round.questionIds.length,
        question: toPublicQuestion(question),
        timeLimitSeconds: limit,
        remainingSeconds: limit === null ? null : Math.max(0, Math.ceil(limit - elapsed)),
      }
    })
  }

  // Registra a resposta da pergunta atual e calcula os pontos no servidor.
  // answerId null = tempo esgotado. O lock na linha da partida impede corrida de cliques.
  async answer(userId: number, roundId: number, questionId: number, answerId: number | null) {
    const result = await AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      this.assertActive(round)

      const expectedId = round.questionIds[round.currentIndex]
      if (questionId !== expectedId) throw new ConflictError('Esta pergunta já foi respondida ou não é a pergunta atual')
      if (!round.currentServedAt) throw new ConflictError('Busque a pergunta antes de responder')

      const question = await this.questions.findWithAnswers(questionId, manager)
      const chosen = answerId === null ? null : question.answers.find(a => a.id === answerId)
      if (answerId !== null && !chosen) throw new BadRequestError('Alternativa não pertence a esta pergunta')

      // Responder com o menu aberto retoma o relógio antes de calcular o tempo
      const now = new Date()
      if (round.pausedAt) {
        round.currentServedAt = new Date(round.currentServedAt.getTime() + (now.getTime() - round.pausedAt.getTime()))
        round.pausedAt = null
      }
      const elapsed = secondsBetween(round.currentServedAt, now)
      const timeExpired = answerId === null || isTimeExpired(round.mode, elapsed)
      const isCorrect = !timeExpired && !!chosen?.correct

      round.streak = isCorrect ? round.streak + 1 : 0
      round.maxStreak = Math.max(round.maxStreak, round.streak)
      const points = answerPoints(isCorrect, round.streak, elapsed)
      round.scoreRound += points
      if (isCorrect) round.correctCount += 1
      if (!isCorrect && round.lives !== null) round.lives = Math.max(0, round.lives - 1)
      round.activeSeconds += Math.round(Math.min(elapsed, MAX_COUNTED_SECONDS))

      await manager.getRepository(RoundAnswer).insert({
        roundId: round.id,
        questionId,
        answerId,
        region: question.region,
        isCorrect,
        points,
        elapsedSeconds: Math.round(elapsed),
      })

      round.currentIndex += 1
      round.currentServedAt = null

      // Região concluída? (próxima pergunta é de outra região, ou acabou a partida)
      const regionPlan = await this.questions.regionsOf(round.questionIds)
      const regionDone = round.currentIndex >= regionPlan.length || regionPlan[round.currentIndex] !== question.region
      let regionCompleted: { region: number; correct: number; total: number } | undefined
      if (regionDone) {
        const answers = await manager.getRepository(RoundAnswer).find({ where: { roundId: round.id, region: question.region } })
        regionCompleted = { region: question.region, correct: answers.filter(a => a.isCorrect).length, total: answers.length }
      }

      const codes = achievementsOnAnswer({ isCorrect, streak: round.streak, regionCompleted })

      // Fim de partida: todas respondidas, ou sem vidas no modo Desafio
      const completed = round.currentIndex >= round.questionIds.length
      const outOfLives = round.lives === 0
      if (completed || outOfLives) {
        // Ficar sem vidas (mesmo na última pergunta) conta como derrota
        round.status = outOfLives ? 'failed' : 'finished'
        round.finishedAt = now
        if (round.status === 'finished') {
          round.completionBonus = completionBonus(round.activeSeconds, round.questionIds.length)
          round.scoreRound += round.completionBonus
        }
        codes.push(
          ...achievementsOnFinish({
            completed: round.status === 'finished',
            mode: round.mode,
            correctCount: round.correctCount,
            total: round.questionIds.length,
            activeSeconds: round.activeSeconds,
          }),
        )
        await manager
          .getRepository(User)
          .createQueryBuilder()
          .update()
          .set({ bestScore: () => `GREATEST(bestScore, ${Math.trunc(round.scoreRound)})` })
          .where('id = :id', { id: userId })
          .execute()
      }

      await manager.getRepository(Round).save(round)
      const newAchievements: AchievementDef[] = await this.achievements.grant(userId, codes, manager)
      const correctAnswer = question.answers.find(a => a.correct)

      return {
        round,
        response: {
          isCorrect,
          timeExpired,
          correctAnswerId: correctAnswer?.id ?? null,
          explanation: question.explanation,
          points,
          score: round.scoreRound,
          streak: round.streak,
          lives: round.lives,
          answered: round.currentIndex,
          total: round.questionIds.length,
          status: round.status,
          regionCompleted: regionCompleted ?? null,
          newAchievements,
        },
      }
    })

    const ended = result.round.status !== 'active'
    return { ...result.response, summary: ended ? await this.summary(userId, roundId) : null }
  }

  // Menu aberto (Esc): congela o relógio da pergunta atual
  async pause(userId: number, roundId: number) {
    return AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      if (round.status === 'active' && !round.pausedAt) {
        await manager.getRepository(Round).update(round.id, { pausedAt: new Date() })
      }
      return { paused: round.status === 'active' }
    })
  }

  // Menu fechado: o tempo parado não conta para o bônus nem para o limite do modo Desafio
  async resume(userId: number, roundId: number) {
    return AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      if (round.pausedAt) {
        const now = new Date()
        const servedAt = round.currentServedAt
          ? new Date(round.currentServedAt.getTime() + (now.getTime() - round.pausedAt.getTime()))
          : null
        await manager.getRepository(Round).update(round.id, { pausedAt: null, currentServedAt: servedAt })
      }
      return { paused: false }
    })
  }

  // Abandona a partida (Reiniciar / Sair): ela deixa de valer para o ranking
  async abandon(userId: number, roundId: number) {
    const round = await this.findOwned(userId, roundId)
    if (round.status === 'active') {
      await AppDataSource.getRepository(Round).update(round.id, { status: 'abandoned', finishedAt: new Date() })
    }
    return { message: 'Partida encerrada' }
  }

  async summary(userId: number, roundId: number): Promise<RoundSummary> {
    const round = await this.findOwned(userId, roundId)
    const answers = await AppDataSource.getRepository(RoundAnswer).find({ where: { roundId: round.id } })
    const plan = await this.questions.regionsOf(round.questionIds)

    const perRegion: RegionStats[] = REGIONS.map((name, region) => ({
      region,
      name,
      correct: answers.filter(a => a.region === region && a.isCorrect).length,
      total: plan.filter(r => r === region).length,
    })).filter(r => r.total > 0)

    const rank = RANKED.includes(round.status) ? await this.rankOf(round.mode, round.scoreRound) : null
    const end = round.finishedAt ?? new Date()

    return {
      id: round.id,
      mode: round.mode,
      status: round.status,
      score: round.scoreRound,
      completionBonus: round.completionBonus,
      correctCount: round.correctCount,
      answered: round.currentIndex,
      total: round.questionIds.length,
      maxStreak: round.maxStreak,
      activeSeconds: round.activeSeconds,
      durationSeconds: Math.round(secondsBetween(round.startedAt, end)),
      perRegion,
      rank,
    }
  }

  // Ranking: melhor partida de cada jogador (cada um aparece uma vez só)
  async ranking(mode: GameMode = 'normal', period: 'all' | 'week' = 'all', limit = 10): Promise<RankingEntry[]> {
    const qb = AppDataSource.getRepository(Round)
      .createQueryBuilder('r')
      .innerJoin('r.user', 'u')
      .select('u.id', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('MAX(r.scoreRound)', 'score')
      .where('r.status IN (:...statuses)', { statuses: RANKED })
      .andWhere('r.mode = :mode', { mode })
      .groupBy('u.id')
      .addGroupBy('u.name')
      .orderBy('score', 'DESC')
      .addOrderBy('MIN(r.finishedAt)', 'ASC')
      .limit(limit)

    if (period === 'week') {
      qb.andWhere('r.finishedAt >= :since', { since: new Date(Date.now() - 7 * 24 * 3600 * 1000) })
    }

    const rows = await qb.getRawMany<{ userId: number; name: string; score: string }>()
    return rows.map((row, i) => ({ position: i + 1, userId: Number(row.userId), name: row.name, score: Number(row.score) }))
  }

  // Posição de uma pontuação no ranking do modo (1 + jogadores com melhor pontuação maior)
  private async rankOf(mode: GameMode, score: number) {
    const row = await AppDataSource.getRepository(Round)
      .createQueryBuilder('r')
      .select('COUNT(DISTINCT r.userId)', 'better')
      .where('r.status IN (:...statuses)', { statuses: RANKED })
      .andWhere('r.mode = :mode', { mode })
      .andWhere('r.scoreRound > :score', { score })
      .getRawOne<{ better: string }>()
    return Number(row?.better ?? 0) + 1
  }

  // Busca a partida garantindo que pertence ao jogador (404 para partidas de outros)
  private async findOwned(userId: number, roundId: number, manager?: EntityManager, lock = false) {
    const repo = (manager ?? AppDataSource.manager).getRepository(Round)
    const round = await repo.findOne({
      where: { id: roundId, userId },
      ...(lock ? { lock: { mode: 'pessimistic_write' as const } } : {}),
    })
    if (!round) throw new NotFoundError('Partida não encontrada')
    return round
  }

  private assertActive(round: Round) {
    if (round.status !== 'active') throw new ConflictError('Esta partida já foi encerrada')
  }

  private async toState(round: Round): Promise<RoundState> {
    return {
      id: round.id,
      mode: round.mode,
      status: round.status,
      total: round.questionIds.length,
      answered: round.currentIndex,
      score: round.scoreRound,
      correctCount: round.correctCount,
      streak: round.streak,
      lives: round.lives,
      timeLimitSeconds: MODE_RULES[round.mode].timeLimitSeconds,
      regionPlan: await this.questions.regionsOf(round.questionIds),
      startedAt: round.startedAt,
    }
  }
}

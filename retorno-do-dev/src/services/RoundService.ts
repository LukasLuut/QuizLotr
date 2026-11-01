import { EntityManager } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Round, RoundStatus } from '../models/Round'
import { RoundAnswer } from '../models/RoundAnswer'
import { User } from '../models/User'
import { Achievement } from '../models/Achievement'
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../errors/HttpError'
import { QuestionService, toPublicQuestion } from './QuestionService'
import { AchievementService } from './AchievementService'
import {
  GameMode,
  HELPS,
  HOBBIT_UNLOCK_LEVEL,
  Help,
  Journey,
  LEMBAS_CORRUPTION_RELIEF,
  MAX_CORRUPTION,
  MAX_COUNTED_SECONDS,
  MODE_RULES,
  REGIONS,
  AchievementDef,
  achievementsOnAnswer,
  achievementsOnFinish,
  clampCorruption,
  completionBonus,
  helpsAllowed,
  isPersona,
  isPersonaUnlocked,
  JOURNEY_DEFAULT_PERSONA,
  Persona,
  personaFitsJourney,
  isTimeExpired,
  levelFromAchievements,
  personaMods,
  personaOrDefault,
  questionTimeLimit,
  regionRule,
  scoreAnswer,
  shuffle,
} from '../game/rules'

const RANKED: RoundStatus[] = ['finished', 'failed']

export interface RoundState {
  id: number
  mode: GameMode
  journey: Journey
  persona: string
  status: RoundStatus
  total: number
  answered: number
  score: number
  correctCount: number
  streak: number
  lives: number | null
  corruption: number
  ringUses: number
  helpsUsed: Partial<Record<Help, number>>
  helpsAllowed: Record<Help, number>
  timeLimitSeconds: number | null
  // região de cada pergunta da partida, na ordem (sem o conteúdo das perguntas)
  regionPlan: number[]
  // regra própria de cada região da partida
  regionRules: Record<number, { name: string; description: string }>
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
  journey: Journey
  persona: string
  status: RoundStatus
  failReason: string | null
  score: number
  completionBonus: number
  correctCount: number
  answered: number
  total: number
  maxStreak: number
  corruption: number
  ringUses: number
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
const FAST_SECONDS = 3
// Palantír: com poucas respostas registradas, a visão é gerada (inclinada para a correta)
const PALANTIR_MIN_SAMPLES = 5

// Desfecho de uma resposta (ou de um pulo com o Passolargo)
interface Outcome {
  questionId: number
  answerId: number | null
  region: number
  isCorrect: boolean
  skipped: boolean
  usedRing: boolean
  elapsed: number
  points: number
}

export class RoundService {
  private questions = new QuestionService()
  private achievements = new AchievementService()

  // Inicia uma partida nova. Partidas ativas anteriores do jogador são abandonadas
  // (não entram no ranking), então F5 ou "Reiniciar" nunca somam pontos de duas partidas.
  async start(userId: number, mode: GameMode = 'normal', journey: Journey = 'main', chosen?: Persona): Promise<RoundState> {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } })
    if (!user) throw new NotFoundError('Usuário não encontrado')
    const level = await this.levelOf(userId)
    if (journey === 'hobbit' && level < HOBBIT_UNLOCK_LEVEL) {
      throw new ForbiddenError(`A jornada O Hobbit abre no nível ${HOBBIT_UNLOCK_LEVEL} do viajante`)
    }
    // Personagem escolhido para a partida: precisa estar liberado e ser da jornada
    let persona: Persona
    if (chosen) {
      if (!personaFitsJourney(chosen, journey)) throw new BadRequestError('Este personagem não faz parte desta jornada')
      if (!isPersonaUnlocked(chosen, level)) throw new ForbiddenError('Personagem ainda bloqueado para o seu nível')
      persona = chosen
    } else {
      // sem escolha: a foto do perfil, se servir; senão o padrão da jornada
      persona = personaOrDefault(user.avatar)
      if (!isPersonaUnlocked(persona, level) || !personaFitsJourney(persona, journey)) persona = JOURNEY_DEFAULT_PERSONA[journey]
    }

    const questionIds = await this.questions.drawForRound(journey)
    const baseLives = MODE_RULES[mode].lives
    const round = await AppDataSource.transaction(async manager => {
      const repo = manager.getRepository(Round)
      await repo.update({ userId, status: 'active' }, { status: 'abandoned', finishedAt: new Date() })
      const created = repo.create({
        userId,
        mode,
        journey,
        persona,
        status: 'active',
        questionIds,
        currentIndex: 0,
        lives: baseLives === null ? null : baseLives + (personaMods(persona).extraLives ?? 0),
        helpsUsed: {},
        streakShieldRegions: [],
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
      const limit = questionTimeLimit(round.mode, question.region, round.persona)
      const elapsed = secondsBetween(round.currentServedAt, round.pausedAt ?? new Date())

      return {
        index: round.currentIndex,
        total: round.questionIds.length,
        question: toPublicQuestion(question),
        timeLimitSeconds: limit,
        remainingSeconds: limit === null ? null : Math.max(0, Math.ceil(limit - elapsed)),
        // efeitos de ajudas já usadas nesta pergunta (sobrevivem a um F5)
        eliminated: round.currentAssist?.eliminated ?? [],
        palantir: round.currentAssist?.palantir ?? null,
      }
    })
  }

  // Registra a resposta da pergunta atual e calcula os pontos no servidor.
  // answerId null = tempo esgotado. O lock na linha da partida impede corrida de cliques.
  async answer(userId: number, roundId: number, questionId: number, answerId: number | null, useRing = false) {
    const result = await AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      this.assertActive(round)

      const expectedId = round.questionIds[round.currentIndex]
      if (questionId !== expectedId) throw new ConflictError('Esta pergunta já foi respondida ou não é a pergunta atual')
      if (!round.currentServedAt) throw new ConflictError('Busque a pergunta antes de responder')

      const question = await this.questions.findWithAnswers(questionId, manager)
      const chosen = answerId === null ? null : question.answers.find(a => a.id === answerId)
      if (answerId !== null && !chosen) throw new BadRequestError('Alternativa não pertence a esta pergunta')

      const now = new Date()
      const elapsed = this.elapsedNow(round, now)
      const limit = questionTimeLimit(round.mode, question.region, round.persona)
      const timeExpired = answerId === null || isTimeExpired(round.mode, elapsed, limit)
      const isCorrect = !timeExpired && !!chosen?.correct

      const mods = personaMods(round.persona)
      const rule = regionRule(question.region)
      const regionPlan = await this.questions.regionsOf(round.questionIds)
      const isLastOfRegion = round.currentIndex + 1 >= regionPlan.length || regionPlan[round.currentIndex + 1] !== question.region

      // Escudos: Boromir anula o 1º erro da partida; Gimli segura a sequência no 1º erro de cada região
      const shielded = !isCorrect && !!mods.firstErrorShield && !round.shieldUsed
      if (shielded) round.shieldUsed = true
      let keepStreak = shielded || (!isCorrect && !!rule.keepStreakOnError)
      const shieldRegions = round.streakShieldRegions ?? []
      if (!isCorrect && !keepStreak && mods.regionStreakShield && !shieldRegions.includes(question.region)) {
        round.streakShieldRegions = [...shieldRegions, question.region]
        keepStreak = true
      }

      round.streak = isCorrect ? round.streak + 1 : keepStreak ? round.streak : 0
      round.maxStreak = Math.max(round.maxStreak, round.streak)

      const scored = scoreAnswer({
        isCorrect,
        streak: round.streak,
        elapsedSeconds: elapsed,
        region: question.region,
        persona: round.persona,
        usedRing: useRing,
        isLastOfRegion,
        mode: round.mode,
        shielded,
      })
      round.scoreRound = Math.max(0, round.scoreRound + scored.points)
      round.corruption = clampCorruption(round.corruption + scored.corruptionDelta)
      if (useRing) round.ringUses += 1
      if (isCorrect) round.correctCount += 1
      if (isCorrect && elapsed < FAST_SECONDS) round.fastCorrect += 1
      if (!isCorrect && !shielded && round.lives !== null) {
        // errar com o Anel no modo Desafio custa uma vida a mais
        const lost = Math.min(round.lives, useRing ? 2 : 1)
        round.lives -= lost
        round.livesLost += lost
      }

      const outcome: Outcome = { questionId, answerId, region: question.region, isCorrect, skipped: false, usedRing: useRing, elapsed, points: scored.points }
      const progress = await this.advance(manager, userId, round, outcome, regionPlan, now)
      const correctAnswer = question.answers.find(a => a.correct)

      return {
        round,
        response: {
          isCorrect,
          timeExpired,
          skipped: false,
          usedRing: useRing,
          shielded,
          correctAnswerId: correctAnswer?.id ?? null,
          explanation: question.explanation,
          points: scored.points,
          ...progress,
        },
      }
    })

    const ended = result.round.status !== 'active'
    return { ...result.response, summary: ended ? await this.summary(userId, roundId) : null }
  }

  // Ajudas temáticas: cada uma vale uma vez por partida (alguns personagens têm extras)
  async help(userId: number, roundId: number, help: Help) {
    const result = await AppDataSource.transaction(async manager => {
      const round = await this.findOwned(userId, roundId, manager, true)
      this.assertActive(round)

      const used = round.helpsUsed ?? {}
      if ((used[help] ?? 0) >= helpsAllowed(round.persona)[help]) throw new ConflictError('Esta ajuda já foi usada nesta partida')
      const needsQuestion = help !== 'lembas'
      if (needsQuestion && !round.currentServedAt) throw new ConflictError('Busque a pergunta antes de pedir ajuda')
      round.helpsUsed = { ...used, [help]: (used[help] ?? 0) + 1 }

      const questionId = round.questionIds[round.currentIndex]
      const question = needsQuestion ? await this.questions.findWithAnswers(questionId, manager) : null
      const assist = { ...(round.currentAssist ?? {}) }
      const response: Record<string, unknown> = { help }

      if (help === 'conselho' && question) {
        // Conselho de Gandalf: elimina duas alternativas erradas
        const already = new Set(assist.eliminated ?? [])
        const wrong = question.answers.filter(a => !a.correct && !already.has(a.id)).map(a => a.id)
        assist.eliminated = [...already, ...shuffle(wrong).slice(0, 2)]
        round.currentAssist = assist
        response.eliminated = assist.eliminated
      }

      if (help === 'palantir' && question) {
        assist.palantir = await this.palantirVision(manager, question.id, question.answers)
        round.currentAssist = assist
        response.palantir = assist.palantir
      }

      if (help === 'lembas') {
        if (round.lives !== null) round.lives += 1
        round.corruption = personaMods(round.persona).lembasClearsCorruption ? 0 : clampCorruption(round.corruption - LEMBAS_CORRUPTION_RELIEF)
        response.lives = round.lives
        response.corruption = round.corruption
      }

      if (help === 'passolargo' && question) {
        // Passolargo: pula a pergunta sem perder pontos, vida nem sequência
        const now = new Date()
        const regionPlan = await this.questions.regionsOf(round.questionIds)
        const outcome: Outcome = {
          questionId,
          answerId: null,
          region: question.region,
          isCorrect: false,
          skipped: true,
          usedRing: false,
          elapsed: this.elapsedNow(round, now),
          points: 0,
        }
        const progress = await this.advance(manager, userId, round, outcome, regionPlan, now)
        Object.assign(response, {
          skipped: true,
          isCorrect: false,
          timeExpired: false,
          usedRing: false,
          shielded: false,
          correctAnswerId: question.answers.find(a => a.correct)?.id ?? null,
          explanation: question.explanation,
          points: 0,
          ...progress,
        })
        return { round, response }
      }

      await manager.getRepository(Round).save(round)
      response.helpsUsed = round.helpsUsed
      return { round, response }
    })

    const ended = result.round.status !== 'active'
    return { ...result.response, summary: ended ? await this.summary(userId, roundId) : null }
  }

  // Menu aberto: congela o relógio da pergunta atual
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

    // na ordem da viagem (em O Hobbit a ordem não é a dos índices das regiões)
    const perRegion: RegionStats[] = [...new Set(plan)].map(region => ({
      region,
      name: REGIONS[region],
      correct: answers.filter(a => a.region === region && a.isCorrect).length,
      total: plan.filter(r => r === region).length,
    }))

    // A jornada bônus não entra no ranking
    const ranked = RANKED.includes(round.status) && round.journey === 'main'
    const rank = ranked ? await this.rankOf(round.mode, round.scoreRound) : null
    const end = round.finishedAt ?? new Date()

    return {
      id: round.id,
      mode: round.mode,
      journey: round.journey,
      persona: round.persona,
      status: round.status,
      failReason: round.failReason,
      score: round.scoreRound,
      completionBonus: round.completionBonus,
      correctCount: round.correctCount,
      answered: round.currentIndex,
      total: round.questionIds.length,
      maxStreak: round.maxStreak,
      corruption: round.corruption,
      ringUses: round.ringUses,
      activeSeconds: round.activeSeconds,
      durationSeconds: Math.round(secondsBetween(round.startedAt, end)),
      perRegion,
      rank,
    }
  }

  // Ranking: melhor partida de cada jogador na jornada principal (cada um aparece uma vez só)
  async ranking(mode: GameMode = 'normal', period: 'all' | 'week' = 'all', limit = 10): Promise<RankingEntry[]> {
    const qb = AppDataSource.getRepository(Round)
      .createQueryBuilder('r')
      .innerJoin('r.user', 'u')
      .select('u.id', 'userId')
      .addSelect('u.name', 'name')
      .addSelect('MAX(r.scoreRound)', 'score')
      .where('r.status IN (:...statuses)', { statuses: RANKED })
      .andWhere('r.mode = :mode', { mode })
      .andWhere("r.journey = 'main'")
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

  // Nível do viajante = conquistas desbloqueadas
  async levelOf(userId: number, manager: EntityManager = AppDataSource.manager) {
    return levelFromAchievements(await manager.getRepository(Achievement).count({ where: { userId } }))
  }

  // Grava o desfecho da pergunta atual, passa para a próxima e encerra a partida se for o caso
  private async advance(manager: EntityManager, userId: number, round: Round, outcome: Outcome, regionPlan: number[], now: Date) {
    round.activeSeconds += Math.round(Math.min(outcome.elapsed, MAX_COUNTED_SECONDS))
    await manager.getRepository(RoundAnswer).insert({
      roundId: round.id,
      questionId: outcome.questionId,
      answerId: outcome.answerId,
      region: outcome.region,
      isCorrect: outcome.isCorrect,
      points: outcome.points,
      elapsedSeconds: Math.round(outcome.elapsed),
      usedRing: outcome.usedRing,
      skipped: outcome.skipped,
    })

    round.currentIndex += 1
    round.currentServedAt = null
    round.pausedAt = null
    round.currentAssist = null

    // Região concluída? (próxima pergunta é de outra região, ou acabou a partida)
    const regionDone = round.currentIndex >= regionPlan.length || regionPlan[round.currentIndex] !== outcome.region
    let regionCompleted: { region: number; correct: number; total: number } | undefined
    if (regionDone) {
      const answers = await manager.getRepository(RoundAnswer).find({ where: { roundId: round.id, region: outcome.region } })
      regionCompleted = { region: outcome.region, correct: answers.filter(a => a.isCorrect).length, total: answers.length }
    }

    const codes = outcome.skipped ? [] : achievementsOnAnswer({ isCorrect: outcome.isCorrect, streak: round.streak, regionCompleted })

    // Fim de partida: todas respondidas, sem vidas no modo Desafio, ou tomado pelo Anel
    const completed = round.currentIndex >= round.questionIds.length
    const outOfLives = round.lives === 0
    const corrupted = round.corruption >= MAX_CORRUPTION
    if (completed || outOfLives || corrupted) {
      // Perder (mesmo na última pergunta) conta como derrota
      round.status = outOfLives || corrupted ? 'failed' : 'finished'
      round.failReason = corrupted ? 'corrupted' : outOfLives ? 'lives' : null
      round.finishedAt = now
      if (round.status === 'finished') {
        round.completionBonus = completionBonus(round.activeSeconds, round.questionIds.length)
        round.scoreRound += round.completionBonus
      }
      codes.push(...(await this.finishAchievements(manager, userId, round, regionPlan, corrupted)))
      if (round.journey === 'main') {
        await manager
          .getRepository(User)
          .createQueryBuilder()
          .update()
          .set({ bestScore: () => `GREATEST(bestScore, ${Math.trunc(round.scoreRound)})` })
          .where('id = :id', { id: userId })
          .execute()
      }
    }

    await manager.getRepository(Round).save(round)
    const newAchievements: AchievementDef[] = await this.achievements.grant(userId, codes, manager)

    return {
      score: round.scoreRound,
      streak: round.streak,
      lives: round.lives,
      corruption: round.corruption,
      ringUses: round.ringUses,
      helpsUsed: round.helpsUsed ?? {},
      answered: round.currentIndex,
      total: round.questionIds.length,
      status: round.status,
      failReason: round.failReason,
      regionCompleted: regionCompleted ?? null,
      newAchievements,
      level: await this.levelOf(userId, manager),
    }
  }

  private async finishAchievements(manager: EntityManager, userId: number, round: Round, regionPlan: number[], corrupted: boolean) {
    const answers = await manager.getRepository(RoundAnswer).find({ where: { roundId: round.id } })
    const perfectRegions = [...new Set(regionPlan)].filter(region => {
      const inRegion = answers.filter(a => a.region === region)
      return inRegion.length === regionPlan.filter(r => r === region).length && inRegion.every(a => a.isCorrect)
    })

    const completed = round.status === 'finished'
    const previous = await manager
      .getRepository(Round)
      .createQueryBuilder('r')
      .select('COUNT(*)', 'count')
      .addSelect('GROUP_CONCAT(DISTINCT r.persona)', 'personas')
      .where('r.userId = :userId', { userId })
      .andWhere("r.status = 'finished'")
      .andWhere('r.id <> :id', { id: round.id })
      .getRawOne<{ count: string; personas: string | null }>()
    const personas = new Set((previous?.personas ?? '').split(',').filter(isPersona))
    if (completed) personas.add(personaOrDefault(round.persona))

    return achievementsOnFinish({
      completed,
      journey: round.journey,
      mode: round.mode,
      correctCount: round.correctCount,
      total: round.questionIds.length,
      activeSeconds: round.activeSeconds,
      corrupted,
      ringUses: round.ringUses,
      helpTypesUsed: HELPS.filter(h => (round.helpsUsed?.[h] ?? 0) > 0).length,
      livesLost: round.livesLost,
      fastCorrect: round.fastCorrect,
      perfectRegions,
      finishedJourneys: Number(previous?.count ?? 0) + (completed ? 1 : 0),
      distinctPersonas: personas.size,
    })
  }

  // Visão do Palantír: como os viajantes responderam esta pergunta
  private async palantirVision(manager: EntityManager, questionId: number, answers: { id: number; correct: boolean }[]) {
    const rows = await manager
      .getRepository(RoundAnswer)
      .createQueryBuilder('ra')
      .select('ra.answerId', 'answerId')
      .addSelect('COUNT(*)', 'count')
      .where('ra.questionId = :questionId', { questionId })
      .andWhere('ra.answerId IS NOT NULL')
      .groupBy('ra.answerId')
      .getRawMany<{ answerId: number; count: string }>()
    const counts = new Map(rows.map(r => [Number(r.answerId), Number(r.count)]))
    let total = [...counts.values()].reduce((a, b) => a + b, 0)

    if (total < PALANTIR_MIN_SAMPLES) {
      // visão gerada: a correta fica entre 45% e 70%, o resto se divide entre as erradas
      counts.clear()
      const correctShare = 45 + Math.floor(Math.random() * 26)
      let rest = 100 - correctShare
      const wrong = shuffle(answers.filter(a => !a.correct))
      wrong.forEach((a, i) => {
        const share = i === wrong.length - 1 ? rest : Math.floor(Math.random() * (rest + 1) * 0.7)
        counts.set(a.id, share)
        rest -= share
      })
      answers.filter(a => a.correct).forEach(a => counts.set(a.id, correctShare))
      total = 100
    }

    return answers.map(a => ({ answerId: a.id, percent: Math.round(((counts.get(a.id) ?? 0) / total) * 100) }))
  }

  // Tempo gasto na pergunta atual (responder com o menu aberto retoma o relógio antes)
  private elapsedNow(round: Round, now: Date) {
    if (!round.currentServedAt) return 0
    if (round.pausedAt) {
      round.currentServedAt = new Date(round.currentServedAt.getTime() + (now.getTime() - round.pausedAt.getTime()))
      round.pausedAt = null
    }
    return secondsBetween(round.currentServedAt, now)
  }

  // Posição de uma pontuação no ranking do modo (1 + jogadores com melhor pontuação maior)
  private async rankOf(mode: GameMode, score: number) {
    const row = await AppDataSource.getRepository(Round)
      .createQueryBuilder('r')
      .select('COUNT(DISTINCT r.userId)', 'better')
      .where('r.status IN (:...statuses)', { statuses: RANKED })
      .andWhere('r.mode = :mode', { mode })
      .andWhere("r.journey = 'main'")
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
    const regionPlan = await this.questions.regionsOf(round.questionIds)
    const regionRules = Object.fromEntries(
      [...new Set(regionPlan)].map(r => {
        const { name, description } = regionRule(r)
        return [r, { name, description }]
      }),
    )
    return {
      id: round.id,
      mode: round.mode,
      journey: round.journey,
      persona: round.persona,
      status: round.status,
      total: round.questionIds.length,
      answered: round.currentIndex,
      score: round.scoreRound,
      correctCount: round.correctCount,
      streak: round.streak,
      lives: round.lives,
      corruption: round.corruption,
      ringUses: round.ringUses,
      helpsUsed: round.helpsUsed ?? {},
      helpsAllowed: helpsAllowed(round.persona),
      timeLimitSeconds: MODE_RULES[round.mode].timeLimitSeconds,
      regionPlan,
      regionRules,
      startedAt: round.startedAt,
    }
  }
}

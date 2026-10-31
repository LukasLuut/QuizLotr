// src/game/rules.ts
// Regras do jogo em funções puras: a pontuação é sempre calculada aqui, no servidor.

// Regiões da jornada, na ordem do mapa
export const REGIONS = [
  'O Condado',
  'Bri',
  'Valfenda',
  'Moria',
  'Lothlórien',
  'Argonath',
  'Mordor',
  'Montanha da Perdição',
] as const

export const MORIA_REGION = 3

// Quantas perguntas são sorteadas de cada região por partida
export const QUESTIONS_PER_REGION = 5

export const GAME_MODES = ['normal', 'desafio'] as const
export type GameMode = (typeof GAME_MODES)[number]

export interface ModeRules {
  lives: number | null // null = sem limite de erros
  timeLimitSeconds: number | null // null = sem limite por pergunta
}

export const MODE_RULES: Record<GameMode, ModeRules> = {
  normal: { lives: null, timeLimitSeconds: null },
  desafio: { lives: 3, timeLimitSeconds: 20 },
}

// Margem para latência de rede antes de considerar o tempo esgotado
export const TIME_LIMIT_GRACE_SECONDS = 2
// Tempo máximo contado por pergunta (pausas longas não inflam o tempo da partida)
export const MAX_COUNTED_SECONDS = 60

export const BASE_POINTS = 1000
export const SPEED_BONUS_MAX = 300
export const SPEED_BONUS_WINDOW_SECONDS = 20
export const COMPLETION_BONUS_MAX = 2000
export const SECONDS_PER_QUESTION_TARGET = 20

// Multiplicador de sequência: 1x no primeiro acerto, +0,1x por acerto seguido, até 1,9x
export function streakMultiplier(streak: number) {
  return 1 + 0.1 * (Math.min(Math.max(streak, 1), 10) - 1)
}

// Bônus de velocidade: cai linearmente de 300 a 0 ao longo de 20 s
export function speedBonus(elapsedSeconds: number) {
  const ratio = 1 - elapsedSeconds / SPEED_BONUS_WINDOW_SECONDS
  return Math.max(0, Math.round(SPEED_BONUS_MAX * ratio))
}

// Pontos de uma resposta. Errar ou deixar o tempo acabar vale 0.
export function answerPoints(isCorrect: boolean, streak: number, elapsedSeconds: number) {
  if (!isCorrect) return 0
  return Math.round(BASE_POINTS * streakMultiplier(streak)) + speedBonus(elapsedSeconds)
}

// Bônus ao concluir a jornada: quanto menos tempo de resposta, maior
export function completionBonus(activeSeconds: number, totalQuestions: number) {
  const target = totalQuestions * SECONDS_PER_QUESTION_TARGET
  if (target <= 0) return 0
  return Math.max(0, Math.round(COMPLETION_BONUS_MAX * (1 - activeSeconds / target)))
}

export function isTimeExpired(mode: GameMode, elapsedSeconds: number) {
  const limit = MODE_RULES[mode].timeLimitSeconds
  return limit !== null && elapsedSeconds > limit + TIME_LIMIT_GRACE_SECONDS
}

// Embaralhamento Fisher-Yates (gera uma cópia)
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Conquistas -----------------------------------------------------------------

export interface AchievementDef {
  code: string
  title: string
  description: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { code: 'primeiros-passos', title: 'Primeiros Passos', description: 'Acerte sua primeira pergunta.' },
  { code: 'passo-firme', title: 'Passo Firme', description: 'Acerte 5 perguntas seguidas.' },
  { code: 'sem-hesitar', title: 'Sem Hesitar', description: 'Acerte 10 perguntas seguidas.' },
  { code: 'moria-perfeita', title: 'Sem Errar em Moria', description: 'Acerte todas as perguntas de Moria em uma partida.' },
  { code: 'queimador-de-anel', title: 'Queimador de Anel', description: 'Conclua a jornada até a Montanha da Perdição.' },
  { code: 'sabio', title: 'Sábio da Terra-média', description: 'Conclua uma jornada com 90% ou mais de acertos.' },
  { code: 'pes-ligeiros', title: 'Pés Ligeiros', description: 'Conclua uma jornada com menos de 5 minutos de resposta.' },
  { code: 'sobrevivente', title: 'Sobrevivente', description: 'Conclua a jornada no modo Desafio.' },
]

export function achievementByCode(code: string) {
  return ACHIEVEMENTS.find(a => a.code === code)
}

export interface AnswerContext {
  isCorrect: boolean
  streak: number
  // acertos e total da região atual, quando a região acabou de ser concluída
  regionCompleted?: { region: number; correct: number; total: number }
}

// Conquistas que podem ser ganhas no momento da resposta
export function achievementsOnAnswer(ctx: AnswerContext): string[] {
  const codes: string[] = []
  if (ctx.isCorrect) codes.push('primeiros-passos')
  if (ctx.streak >= 5) codes.push('passo-firme')
  if (ctx.streak >= 10) codes.push('sem-hesitar')
  const rc = ctx.regionCompleted
  if (rc && rc.region === MORIA_REGION && rc.total > 0 && rc.correct === rc.total) codes.push('moria-perfeita')
  return codes
}

export interface FinishContext {
  completed: boolean
  mode: GameMode
  correctCount: number
  total: number
  activeSeconds: number
}

// Conquistas avaliadas no fim da partida
export function achievementsOnFinish(ctx: FinishContext): string[] {
  if (!ctx.completed) return []
  const codes = ['queimador-de-anel']
  if (ctx.total > 0 && ctx.correctCount / ctx.total >= 0.9) codes.push('sabio')
  if (ctx.activeSeconds < 300) codes.push('pes-ligeiros')
  if (ctx.mode === 'desafio') codes.push('sobrevivente')
  return codes
}

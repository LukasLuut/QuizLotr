// src/game/rules.ts
// Regras do jogo em funções puras: a pontuação é sempre calculada aqui, no servidor.

// Regiões, na ordem do mapa. 0-7: jornada principal; 8-10: jornada bônus "O Hobbit"
export const REGIONS = [
  'O Condado',
  'Bri',
  'Valfenda',
  'Moria',
  'Lothlórien',
  'Argonath',
  'Mordor',
  'Montanha da Perdição',
  'Montanhas Sombrias',
  'Floresta das Trevas',
  'Erebor',
] as const

export const MORIA_REGION = 3

// Quantas perguntas são sorteadas de cada região por partida (jornada principal)
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
export const DEFAULT_STREAK_CAP = 1.9

// Multiplicador de sequência: 1x no primeiro acerto, +0,1x por acerto seguido, até o limite (1,9x)
export function streakMultiplier(streak: number, cap = DEFAULT_STREAK_CAP) {
  return Math.min(cap, 1 + 0.1 * (Math.max(streak, 1) - 1))
}

// Bônus de velocidade: cai linearmente de 300 a 0 ao longo da janela (20 s)
export function speedBonus(elapsedSeconds: number, windowSeconds = SPEED_BONUS_WINDOW_SECONDS) {
  if (windowSeconds <= 0) return 0
  const ratio = 1 - elapsedSeconds / windowSeconds
  return Math.max(0, Math.round(SPEED_BONUS_MAX * ratio))
}

// Pontos base de uma resposta. Errar ou deixar o tempo acabar vale 0.
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

export function isTimeExpired(mode: GameMode, elapsedSeconds: number, limitSeconds: number | null = MODE_RULES[mode].timeLimitSeconds) {
  return limitSeconds !== null && elapsedSeconds > limitSeconds + TIME_LIMIT_GRACE_SECONDS
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

// Jornadas -------------------------------------------------------------------

export const JOURNEYS = ['main', 'hobbit'] as const
export type Journey = (typeof JOURNEYS)[number]

// Regiões e perguntas por região de cada jornada
export const JOURNEY_PLAN: Record<Journey, { regions: number[]; perRegion: number }> = {
  main: { regions: [0, 1, 2, 3, 4, 5, 6, 7], perRegion: QUESTIONS_PER_REGION },
  hobbit: { regions: [8, 9, 10], perRegion: 4 },
}

// Nível do viajante necessário para a jornada bônus
export const HOBBIT_UNLOCK_LEVEL = 5

// Regras próprias de cada região -----------------------------------------------

export interface RegionRule {
  name: string
  description: string
  keepStreakOnError?: boolean // errar não zera a sequência
  speedBonusFactor?: number // multiplica o bônus de velocidade
  pointsFactor?: number // multiplica os pontos de acerto
  timeFactor?: number // multiplica o tempo da pergunta e a janela do bônus de velocidade
  lastQuestionFactor?: number // multiplica os pontos da última pergunta da região
  quickBonus?: { seconds: number; points: number } // acerto rápido rende bônus
  slowPenalty?: { seconds: number; points: number } // demorar custa pontos
  wrongPenalty?: number // errar custa pontos
  wrongCorruption?: number // errar aumenta a corrupção
  ringCorruptionFactor?: number // usar o Anel corrompe mais
}

export const REGION_RULES: Record<number, RegionRule> = {
  0: { name: 'Paz do Condado', description: 'Errar não quebra a sua sequência de acertos.', keepStreakOnError: true },
  1: { name: 'Cavaleiros Negros', description: 'Há pressa: o bônus de velocidade vale o dobro.', speedBonusFactor: 2 },
  2: { name: 'Sabedoria de Elrond', description: 'Acertos valem 20% a mais.', pointsFactor: 1.2 },
  3: { name: 'Escuridão de Moria', description: 'A pergunta surge do escuro. Acerte em até 6 s e ganhe +300.', quickBonus: { seconds: 6, points: 300 } },
  4: { name: 'Espelho de Galadriel', description: 'A última pergunta da região vale o triplo.', lastQuestionFactor: 3 },
  5: { name: 'Correnteza do Anduin', description: 'O tempo corre pela metade: menos tempo e bônus de velocidade mais curto.', timeFactor: 0.5 },
  6: { name: 'Olho de Sauron', description: 'O Anel corrompe o dobro, e cada erro corrompe +10.', ringCorruptionFactor: 2, wrongCorruption: 10 },
  7: { name: 'Fenda da Perdição', description: 'Acertos valem 50% a mais; erros custam 500 pontos e +15 de corrupção.', pointsFactor: 1.5, wrongPenalty: 500, wrongCorruption: 15 },
  8: { name: 'Enigmas no Escuro', description: 'Responda em até 8 s, ou o Gollum leva 200 pontos.', slowPenalty: { seconds: 8, points: 200 } },
  9: { name: 'Teias da Floresta', description: 'As aranhas não perdoam: errar custa 300 pontos.', wrongPenalty: 300 },
  10: { name: 'Tesouro de Smaug', description: 'Acertos valem o dobro, mas a cobiça faz o Anel corromper 50% a mais.', pointsFactor: 2, ringCorruptionFactor: 1.5 },
}

export const regionRule = (region: number): RegionRule => REGION_RULES[region] ?? { name: '', description: '' }

// O Peso do Anel ---------------------------------------------------------------

export const RING_POINTS_FACTOR = 2 // acerto com o Anel
export const RING_USE_CORRUPTION = 15 // cada uso
export const RING_WRONG_CORRUPTION = 15 // a mais quando erra com o Anel
export const RING_WRONG_PENALTY = 500 // pontos perdidos ao errar com o Anel (modo Jornada)
export const PURE_ANSWER_RELIEF = 5 // acerto sem o Anel alivia a corrupção
export const MAX_CORRUPTION = 100

// Ajudas temáticas (uma de cada por partida) ----------------------------------

export const HELPS = ['conselho', 'palantir', 'lembas', 'passolargo'] as const
export type Help = (typeof HELPS)[number]
export const isHelp = (value: unknown): value is Help => typeof value === 'string' && (HELPS as readonly string[]).includes(value)
export const LEMBAS_CORRUPTION_RELIEF = 25

// Personagens e habilidades ---------------------------------------------------

// Imagens em quizSenhorDosAneis/src/assets/images/personas
export const PERSONAS = ['frodo', 'sam', 'gandalf', 'pippin', 'legolas', 'gimli', 'aragorn', 'boromir', 'arwen', 'galadriel'] as const
export type Persona = (typeof PERSONAS)[number]
export const isPersona = (value: unknown): value is Persona => typeof value === 'string' && (PERSONAS as readonly string[]).includes(value)
export const DEFAULT_PERSONA: Persona = 'gandalf'

export interface PersonaMods {
  extraLives?: number
  extraSeconds?: number // tempo a mais por pergunta (Desafio)
  speedWindowBonus?: number // segundos a mais na janela do bônus de velocidade
  streakCap?: number // limite do multiplicador de sequência
  ringCorruptionFactor?: number
  ringPointsFactor?: number
  corruptionGrowthFactor?: number // toda corrupção cresce menos
  pointsFactor?: number
  regionPointsFactor?: Record<number, number>
  extraHelps?: Partial<Record<Help, number>>
  regionStreakShield?: boolean // 1º erro de cada região não zera a sequência
  firstErrorShield?: boolean // 1º erro da partida não custa nada
  lembasClearsCorruption?: boolean
}

export interface PersonaInfo {
  name: string
  unlockLevel: number
  abilities: { code: string; name: string; description: string }[]
  mods: PersonaMods
}

export const PERSONA_INFO: Record<Persona, PersonaInfo> = {
  frodo: {
    name: 'Frodo',
    unlockLevel: 0,
    abilities: [
      { code: 'portador', name: 'Portador do Anel', description: 'O Anel corrompe 40% menos.' },
      { code: 'coragem', name: 'Coragem de Hobbit', description: 'Acertos com o Anel valem 2,5x.' },
    ],
    mods: { ringCorruptionFactor: 0.6, ringPointsFactor: 2.5 },
  },
  sam: {
    name: 'Sam',
    unlockLevel: 0,
    abilities: [
      { code: 'leal', name: 'Coração Leal', description: '+1 vida no modo Desafio.' },
      { code: 'jardineiro', name: 'Jardineiro do Condado', description: 'Toda corrupção cresce 30% mais devagar.' },
    ],
    mods: { extraLives: 1, corruptionGrowthFactor: 0.7 },
  },
  gandalf: {
    name: 'Gandalf',
    unlockLevel: 0,
    abilities: [
      { code: 'istar', name: 'Sabedoria de Istar', description: '+1 Conselho de Gandalf por partida.' },
      { code: 'anor', name: 'Chama de Anor', description: 'Acertos valem 10% a mais.' },
    ],
    mods: { extraHelps: { conselho: 1 }, pointsFactor: 1.1 },
  },
  pippin: {
    name: 'Pippin',
    unlockLevel: 2,
    abilities: [
      { code: 'tuk', name: 'Tolo de um Tûk', description: '+1 Passolargo por partida.' },
      { code: 'curioso', name: 'Olhar Curioso', description: '+1 Visão do Palantír por partida.' },
    ],
    mods: { extraHelps: { passolargo: 1, palantir: 1 } },
  },
  legolas: {
    name: 'Legolas',
    unlockLevel: 4,
    abilities: [
      { code: 'olhos', name: 'Olhos de Elfo', description: '+5 s por pergunta no modo Desafio.' },
      { code: 'flecha', name: 'Flecha Certeira', description: 'Janela do bônus de velocidade 5 s maior.' },
    ],
    mods: { extraSeconds: 5, speedWindowBonus: 5 },
  },
  gimli: {
    name: 'Gimli',
    unlockLevel: 6,
    abilities: [
      { code: 'teimosia', name: 'Teimosia Anã', description: 'O 1º erro de cada região não zera a sequência.' },
      { code: 'durin', name: 'Machado de Durin', description: 'Acertos em Moria e Erebor valem 25% a mais.' },
    ],
    mods: { regionStreakShield: true, regionPointsFactor: { 3: 1.25, 10: 1.25 } },
  },
  aragorn: {
    name: 'Aragorn',
    unlockLevel: 8,
    abilities: [
      { code: 'herdeiro', name: 'Herdeiro de Isildur', description: 'A sequência multiplica os pontos até 2,5x.' },
      { code: 'athelas', name: 'Athelas', description: '+1 Lembas por partida.' },
    ],
    mods: { streakCap: 2.5, extraHelps: { lembas: 1 } },
  },
  boromir: {
    name: 'Boromir',
    unlockLevel: 10,
    abilities: [
      { code: 'escudo', name: 'Escudo de Gondor', description: 'O 1º erro da partida não custa vida, pontos nem corrupção.' },
      { code: 'forca', name: 'Força de Gondor', description: 'Acertos valem 10% a mais.' },
    ],
    mods: { firstErrorShield: true, pointsFactor: 1.1 },
  },
  arwen: {
    name: 'Arwen',
    unlockLevel: 12,
    abilities: [
      { code: 'evenstar', name: 'Graça de Evenstar', description: 'O Lembas também zera a corrupção.' },
      { code: 'vau', name: 'Fuga pelo Vau', description: '+3 s por pergunta no modo Desafio.' },
    ],
    mods: { lembasClearsCorruption: true, extraSeconds: 3 },
  },
  galadriel: {
    name: 'Galadriel',
    unlockLevel: 15,
    abilities: [
      { code: 'nenya', name: 'Nenya', description: 'O Anel corrompe 50% menos.' },
      { code: 'earendil', name: 'Luz de Eärendil', description: '+1 Conselho de Gandalf por partida.' },
    ],
    mods: { ringCorruptionFactor: 0.5, extraHelps: { conselho: 1 } },
  },
}

export const personaOrDefault = (persona: string | null | undefined): Persona => (isPersona(persona) ? persona : DEFAULT_PERSONA)
export const personaMods = (persona: string | null | undefined): PersonaMods => PERSONA_INFO[personaOrDefault(persona)].mods

// Quantas vezes cada ajuda pode ser usada na partida
export const helpsAllowed = (persona: string | null | undefined): Record<Help, number> => {
  const extra = personaMods(persona).extraHelps ?? {}
  return Object.fromEntries(HELPS.map(h => [h, 1 + (extra[h] ?? 0)])) as Record<Help, number>
}

// Nível do viajante = conquistas desbloqueadas
export const levelFromAchievements = (count: number) => count
export const isPersonaUnlocked = (persona: Persona, level: number) => level >= PERSONA_INFO[persona].unlockLevel

// Pontuação completa de uma resposta ------------------------------------------

export interface ScoreInput {
  isCorrect: boolean
  streak: number // sequência já contando esta resposta
  elapsedSeconds: number
  region: number
  persona: string | null | undefined
  usedRing: boolean
  isLastOfRegion: boolean
  mode: GameMode
  shielded: boolean // erro absorvido pelo Escudo de Gondor
}

export interface ScoreResult {
  points: number // pode ser negativo (penalidades)
  corruptionDelta: number
}

const growth = (value: number, mods: PersonaMods) => (value > 0 ? value * (mods.corruptionGrowthFactor ?? 1) : value)

// Janela do bônus de velocidade, já com região e personagem
export function speedWindow(region: number, persona: string | null | undefined) {
  const rule = regionRule(region)
  return SPEED_BONUS_WINDOW_SECONDS * (rule.timeFactor ?? 1) + (personaMods(persona).speedWindowBonus ?? 0)
}

// Tempo limite da pergunta (Desafio), já com região e personagem
export function questionTimeLimit(mode: GameMode, region: number, persona: string | null | undefined) {
  const base = MODE_RULES[mode].timeLimitSeconds
  if (base === null) return null
  return Math.round(base * (regionRule(region).timeFactor ?? 1) + (personaMods(persona).extraSeconds ?? 0))
}

export function scoreAnswer(input: ScoreInput): ScoreResult {
  const rule = regionRule(input.region)
  const mods = personaMods(input.persona)
  let corruption = 0

  if (input.usedRing) corruption += RING_USE_CORRUPTION * (mods.ringCorruptionFactor ?? 1) * (rule.ringCorruptionFactor ?? 1)

  if (!input.isCorrect) {
    if (input.shielded) return { points: 0, corruptionDelta: Math.round(growth(corruption, mods)) }
    let points = -(rule.wrongPenalty ?? 0)
    if (input.usedRing) {
      corruption += RING_WRONG_CORRUPTION * (mods.ringCorruptionFactor ?? 1) * (rule.ringCorruptionFactor ?? 1)
      if (input.mode === 'normal') points -= RING_WRONG_PENALTY
    }
    corruption += rule.wrongCorruption ?? 0
    return { points, corruptionDelta: Math.round(growth(corruption, mods)) }
  }

  const base = Math.round(BASE_POINTS * streakMultiplier(input.streak, mods.streakCap))
  const speed = Math.round(speedBonus(input.elapsedSeconds, speedWindow(input.region, input.persona)) * (rule.speedBonusFactor ?? 1))
  let points = base + speed
  points *= rule.pointsFactor ?? 1
  points *= mods.pointsFactor ?? 1
  points *= mods.regionPointsFactor?.[input.region] ?? 1
  if (input.isLastOfRegion) points *= rule.lastQuestionFactor ?? 1
  if (input.usedRing) points *= mods.ringPointsFactor ?? RING_POINTS_FACTOR
  if (rule.quickBonus && input.elapsedSeconds <= rule.quickBonus.seconds) points += rule.quickBonus.points
  if (rule.slowPenalty && input.elapsedSeconds > rule.slowPenalty.seconds) points -= rule.slowPenalty.points
  if (!input.usedRing) corruption -= PURE_ANSWER_RELIEF

  return { points: Math.round(points), corruptionDelta: Math.round(growth(corruption, mods)) }
}

export const clampCorruption = (value: number) => Math.min(MAX_CORRUPTION, Math.max(0, value))

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
  { code: 'imparavel', title: 'Imparável', description: 'Acerte 20 perguntas seguidas.' },
  { code: 'cavaleiro-negro', title: 'Mais Rápido que os Nazgûl', description: 'Acerte todas as perguntas de Bri em uma partida.' },
  { code: 'moria-perfeita', title: 'Sem Errar em Moria', description: 'Acerte todas as perguntas de Moria em uma partida.' },
  { code: 'amigo-dos-elfos', title: 'Amigo dos Elfos', description: 'Acerte todas as perguntas de Valfenda e Lothlórien na mesma partida.' },
  { code: 'heroi-da-fenda', title: 'Herói da Fenda', description: 'Acerte todas as perguntas da Montanha da Perdição.' },
  { code: 'queimador-de-anel', title: 'Queimador de Anel', description: 'Conclua a jornada até a Montanha da Perdição.' },
  { code: 'sabio', title: 'Sábio da Terra-média', description: 'Conclua uma jornada com 90% ou mais de acertos.' },
  { code: 'jornada-perfeita', title: 'Jornada Perfeita', description: 'Conclua uma jornada sem errar nenhuma pergunta.' },
  { code: 'pes-ligeiros', title: 'Pés Ligeiros', description: 'Conclua uma jornada com menos de 5 minutos de resposta.' },
  { code: 'relampago', title: 'Relâmpago de Gandalf', description: 'Acerte 5 perguntas em menos de 3 s cada em uma partida.' },
  { code: 'sobrevivente', title: 'Sobrevivente', description: 'Conclua a jornada no modo Desafio.' },
  { code: 'lenda-do-desafio', title: 'Lenda do Desafio', description: 'Conclua o modo Desafio sem perder nenhuma vida.' },
  { code: 'coracao-puro', title: 'Coração Puro', description: 'Conclua uma jornada sem usar o Anel.' },
  { code: 'portador', title: 'Portador do Anel', description: 'Use o Anel 5 vezes em uma partida e conclua a jornada.' },
  { code: 'dominado', title: 'Dominado pelo Anel', description: 'Deixe o Anel corromper você por completo.' },
  { code: 'por-conta-propria', title: 'Por Conta Própria', description: 'Conclua uma jornada sem usar nenhuma ajuda.' },
  { code: 'toda-ajuda', title: 'Toda Ajuda É Bem-vinda', description: 'Use as quatro ajudas em uma mesma partida.' },
  { code: 'la-e-de-volta', title: 'Lá e de Volta Outra Vez', description: 'Conclua a jornada bônus O Hobbit.' },
  { code: 'tesouro-de-smaug', title: 'Tesouro de Smaug', description: 'Acerte todas as perguntas de Erebor.' },
  { code: 'veterano', title: 'Veterano da Terra-média', description: 'Conclua 5 jornadas.' },
  { code: 'sociedade', title: 'A Sociedade Completa', description: 'Conclua jornadas com 3 personagens diferentes.' },
]

export function achievementByCode(code: string) {
  return ACHIEVEMENTS.find(a => a.code === code)
}

// Regiões que, gabaritadas, dão conquista na hora
const PERFECT_REGION_ACHIEVEMENT: Record<number, string> = { 1: 'cavaleiro-negro', 3: 'moria-perfeita', 7: 'heroi-da-fenda', 10: 'tesouro-de-smaug' }

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
  if (ctx.streak >= 20) codes.push('imparavel')
  const rc = ctx.regionCompleted
  if (rc && rc.total > 0 && rc.correct === rc.total && PERFECT_REGION_ACHIEVEMENT[rc.region]) codes.push(PERFECT_REGION_ACHIEVEMENT[rc.region])
  return codes
}

export interface FinishContext {
  completed: boolean
  journey: Journey
  mode: GameMode
  correctCount: number
  total: number
  activeSeconds: number
  corrupted: boolean
  ringUses: number
  helpTypesUsed: number // tipos de ajuda diferentes usados
  livesLost: number
  fastCorrect: number
  perfectRegions: number[]
  finishedJourneys: number // jornadas concluídas pelo jogador, contando esta
  distinctPersonas: number // personagens diferentes em jornadas concluídas, contando esta
}

// Conquistas avaliadas no fim da partida
export function achievementsOnFinish(ctx: FinishContext): string[] {
  const codes: string[] = []
  if (ctx.corrupted) codes.push('dominado')
  if (ctx.helpTypesUsed >= HELPS.length) codes.push('toda-ajuda')
  if (ctx.fastCorrect >= 5) codes.push('relampago')
  if (ctx.perfectRegions.includes(2) && ctx.perfectRegions.includes(4)) codes.push('amigo-dos-elfos')
  if (!ctx.completed) return codes

  codes.push(ctx.journey === 'hobbit' ? 'la-e-de-volta' : 'queimador-de-anel')
  if (ctx.total > 0 && ctx.correctCount / ctx.total >= 0.9) codes.push('sabio')
  if (ctx.total > 0 && ctx.correctCount === ctx.total) codes.push('jornada-perfeita')
  if (ctx.activeSeconds < 300) codes.push('pes-ligeiros')
  if (ctx.mode === 'desafio') codes.push('sobrevivente')
  if (ctx.mode === 'desafio' && ctx.livesLost === 0) codes.push('lenda-do-desafio')
  if (ctx.ringUses === 0) codes.push('coracao-puro')
  if (ctx.ringUses >= 5) codes.push('portador')
  if (ctx.helpTypesUsed === 0) codes.push('por-conta-propria')
  if (ctx.finishedJourneys >= 5) codes.push('veterano')
  if (ctx.distinctPersonas >= 3) codes.push('sociedade')
  return codes
}

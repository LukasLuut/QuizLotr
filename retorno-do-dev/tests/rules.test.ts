import {
  answerPoints,
  achievementsOnAnswer,
  achievementsOnFinish,
  completionBonus,
  isTimeExpired,
  shuffle,
  speedBonus,
  streakMultiplier,
  scoreAnswer,
  questionTimeLimit,
  helpsAllowed,
  isPersonaUnlocked,
  ACHIEVEMENTS,
  PURE_ANSWER_RELIEF,
  RING_POINTS_FACTOR,
  RING_USE_CORRUPTION,
} from '../src/game/rules'

describe('regras de pontuação', () => {
  it('erro vale 0 pontos', () => {
    expect(answerPoints(false, 0, 1)).toBe(0)
  })

  it('acerto vale 1000 mais bônus de velocidade', () => {
    expect(answerPoints(true, 1, 0)).toBe(1300)
    expect(answerPoints(true, 1, 30)).toBe(1000)
  })

  it('sequência multiplica até 1,9x', () => {
    expect(streakMultiplier(1)).toBe(1)
    expect(streakMultiplier(5)).toBeCloseTo(1.4)
    expect(streakMultiplier(50)).toBeCloseTo(1.9)
  })

  it('bônus de velocidade cai até zero em 20 s', () => {
    expect(speedBonus(0)).toBe(300)
    expect(speedBonus(10)).toBe(150)
    expect(speedBonus(25)).toBe(0)
  })

  it('bônus de conclusão diminui com o tempo', () => {
    expect(completionBonus(0, 40)).toBe(2000)
    expect(completionBonus(400, 40)).toBe(1000)
    expect(completionBonus(5000, 40)).toBe(0)
  })

  it('tempo esgotado só existe no modo desafio, com margem de 2 s', () => {
    expect(isTimeExpired('normal', 500)).toBe(false)
    expect(isTimeExpired('desafio', 21)).toBe(false)
    expect(isTimeExpired('desafio', 23)).toBe(true)
  })

  it('shuffle não perde nem duplica itens', () => {
    const items = [1, 2, 3, 4, 5]
    expect(shuffle(items).sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5])
  })
})

describe('conquistas', () => {
  it('na resposta: primeiro acerto, sequências e Moria perfeita', () => {
    expect(achievementsOnAnswer({ isCorrect: true, streak: 10 })).toEqual(['primeiros-passos', 'passo-firme', 'sem-hesitar'])
    expect(achievementsOnAnswer({ isCorrect: false, streak: 0, regionCompleted: { region: 3, correct: 5, total: 5 } })).toContain('moria-perfeita')
    expect(achievementsOnAnswer({ isCorrect: true, streak: 1, regionCompleted: { region: 3, correct: 4, total: 5 } })).not.toContain('moria-perfeita')
  })

  it('no fim: conquistas de jornada só com a jornada concluída', () => {
    const base = {
      journey: 'main' as const,
      mode: 'desafio' as const,
      corrupted: false,
      ringUses: 1,
      helpTypesUsed: 1,
      livesLost: 1,
      fastCorrect: 0,
      perfectRegions: [],
      finishedJourneys: 1,
      distinctPersonas: 1,
    }
    expect(achievementsOnFinish({ ...base, completed: false, correctCount: 40, total: 40, activeSeconds: 10 })).toEqual([])
    expect(achievementsOnFinish({ ...base, completed: true, correctCount: 38, total: 40, activeSeconds: 200 })).toEqual([
      'queimador-de-anel',
      'sabio',
      'pes-ligeiros',
      'sobrevivente',
    ])
    expect(achievementsOnFinish({ ...base, completed: false, corrupted: true, correctCount: 3, total: 40, activeSeconds: 10 })).toEqual(['dominado'])
    expect(
      achievementsOnFinish({ ...base, journey: 'hobbit', completed: true, ringUses: 0, helpTypesUsed: 0, correctCount: 1, total: 12, activeSeconds: 900 }),
    ).toEqual(expect.arrayContaining(['la-e-de-volta', 'coracao-puro', 'por-conta-propria']))
  })
})

describe('O Peso do Anel, regiões e personagens', () => {
  const input = {
    isCorrect: true,
    streak: 1,
    elapsedSeconds: 30,
    region: 2, // Valfenda: +20%
    persona: 'frodo',
    usedRing: false,
    isLastOfRegion: false,
    mode: 'normal' as const,
    shielded: false,
  }

  it('acerto sem o Anel alivia a corrupção; com o Anel dobra (Frodo 2,5x) e corrompe', () => {
    expect(scoreAnswer(input)).toEqual({ points: 1200, corruptionDelta: -PURE_ANSWER_RELIEF })
    expect(scoreAnswer({ ...input, usedRing: true })).toEqual({ points: 3000, corruptionDelta: Math.round(RING_USE_CORRUPTION * 0.6) })
    expect(scoreAnswer({ ...input, persona: 'pippin', usedRing: true }).points).toBe(1200 * RING_POINTS_FACTOR)
  })

  it('errar com o Anel custa pontos e mais corrupção', () => {
    expect(scoreAnswer({ ...input, isCorrect: false, usedRing: true, persona: 'pippin' })).toEqual({ points: -500, corruptionDelta: 30 })
  })

  it('Olho de Sauron dobra a corrupção do Anel; Fenda pune erros', () => {
    expect(scoreAnswer({ ...input, region: 6, persona: 'pippin', usedRing: true }).corruptionDelta).toBe(30)
    expect(scoreAnswer({ ...input, region: 7, persona: 'pippin', isCorrect: false })).toEqual({ points: -500, corruptionDelta: 15 })
  })

  it('Escudo de Gondor anula o erro', () => {
    expect(scoreAnswer({ ...input, region: 7, isCorrect: false, shielded: true })).toEqual({ points: 0, corruptionDelta: 0 })
  })

  it('Espelho de Galadriel triplica a última da região; Moria premia rapidez', () => {
    expect(scoreAnswer({ ...input, region: 4, persona: 'pippin', isLastOfRegion: true }).points).toBe(3000)
    expect(scoreAnswer({ ...input, region: 3, persona: 'pippin', elapsedSeconds: 5 }).points).toBe(1000 + speedBonus(5) + 300)
  })

  it('Correnteza corta o tempo pela metade; Legolas ganha 5 s', () => {
    expect(questionTimeLimit('desafio', 5, 'pippin')).toBe(10)
    expect(questionTimeLimit('desafio', 5, 'legolas')).toBe(15)
    expect(questionTimeLimit('normal', 5, 'legolas')).toBeNull()
  })

  it('Aragorn passa do limite de 1,9x da sequência', () => {
    expect(streakMultiplier(30)).toBeCloseTo(1.9)
    expect(streakMultiplier(30, 2.5)).toBeCloseTo(2.5)
  })

  it('ajudas extras por personagem e desbloqueio por nível', () => {
    expect(helpsAllowed('gandalf')).toEqual({ conselho: 2, palantir: 1, lembas: 1, passolargo: 1 })
    expect(helpsAllowed('pippin')).toMatchObject({ palantir: 2, passolargo: 2 })
    expect(isPersonaUnlocked('frodo', 0)).toBe(true)
    expect(isPersonaUnlocked('galadriel', 14)).toBe(false)
  })

  it('24 conquistas com códigos únicos', () => {
    expect(ACHIEVEMENTS).toHaveLength(24)
    expect(new Set(ACHIEVEMENTS.map(a => a.code)).size).toBe(24)
  })
})

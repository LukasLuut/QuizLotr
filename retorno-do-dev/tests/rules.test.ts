import {
  answerPoints,
  achievementsOnAnswer,
  achievementsOnFinish,
  completionBonus,
  isTimeExpired,
  shuffle,
  speedBonus,
  streakMultiplier,
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

  it('no fim: só conta jornada concluída', () => {
    expect(achievementsOnFinish({ completed: false, mode: 'desafio', correctCount: 40, total: 40, activeSeconds: 10 })).toEqual([])
    expect(achievementsOnFinish({ completed: true, mode: 'desafio', correctCount: 38, total: 40, activeSeconds: 200 })).toEqual([
      'queimador-de-anel',
      'sabio',
      'pes-ligeiros',
      'sobrevivente',
    ])
  })
})

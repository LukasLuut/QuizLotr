// "Servidor" da versão demo: as mesmas chamadas de services/api.js, respondidas no navegador.
// Espelha retorno-do-dev/src/services/RoundService.ts usando as mesmas regras (rules.ts) e o
// mesmo banco de perguntas (seeds/questions.ts), importados direto do backend: mudou a regra
// lá, muda aqui. Tudo fica no sessionStorage (some ao fechar o navegador).
import {
  ACHIEVEMENTS,
  HELPS,
  JOURNEY_PLAN,
  LEMBAS_CORRUPTION_RELIEF,
  MAX_CORRUPTION,
  MAX_COUNTED_SECONDS,
  MODE_RULES,
  REGIONS,
  JOURNEY_DEFAULT_PERSONA,
  achievementByCode,
  achievementsOnAnswer,
  achievementsOnFinish,
  clampCorruption,
  completionBonus,
  helpsAllowed,
  isPersona,
  isTimeExpired,
  personaFitsJourney,
  personaMods,
  personaOrDefault,
  questionTimeLimit,
  regionRule,
  scoreAnswer,
  shuffle,
} from "../../../retorno-do-dev/src/game/rules.ts";
import { QUESTIONS } from "../../../retorno-do-dev/src/seeds/questions.ts";

// Erro no mesmo formato do ApiError de services/api.js (as telas só leem status e message)
class DemoError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Nível alto: na demo tudo já vem liberado (personagens e a jornada O Hobbit)
export const DEMO_LEVEL = 99;
const DEFAULT_TITLE = "Viajante do Condado";
const FAST_SECONDS = 3;
// partida curta da demo: perguntas por região
const SHORT_PER_REGION = 2;

// Perguntas com ids estáveis (posição no banco) e alternativas com id próprio
const BANK = QUESTIONS.map((q, i) => ({
  id: i + 1,
  region: q.region,
  difficulty: q.difficulty,
  question: q.question,
  explanation: q.explanation,
  answers: q.answers.map((a, j) => ({ id: (i + 1) * 10 + j, answer: a.answer, correct: a.correct })),
}));
const byId = new Map(BANK.map((q) => [q.id, q]));
const question = (id) => {
  const q = byId.get(id);
  if (!q) throw new DemoError(404, "Pergunta não encontrada");
  return q;
};

// --------------------------------------------------------------------- armazenamento

const STORE_KEY = "quiz-demo";
const freshStore = () => ({
  user: { name: "Viajante", avatar: null, titleCode: null, createdAt: new Date().toISOString() },
  achievements: {}, // code -> data
  rounds: {}, // id -> partida
  nextRoundId: 1,
  short: false,
});

let memory = null; // sem sessionStorage (janela anônima, bloqueado): só memória
function load() {
  if (memory) return memory;
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    memory = raw ? { ...freshStore(), ...JSON.parse(raw) } : freshStore();
  } catch {
    memory = freshStore();
  }
  return memory;
}
function save() {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(memory));
  } catch {
    /* sem armazenamento: vale enquanto a página estiver aberta */
  }
}

// Recomeçar a demo: apaga partidas, conquistas e perfil
export function resetDemo() {
  memory = freshStore();
  try {
    sessionStorage.clear();
  } catch {
    /* nada a limpar */
  }
}

export const demoSettings = {
  get short() {
    return load().short;
  },
  set short(value) {
    load().short = !!value;
    save();
  },
};

// --------------------------------------------------------------------- usuário

function publicUser() {
  const { user } = load();
  return {
    id: 1,
    name: user.name,
    email: "",
    bestScore: 0,
    avatar: isPersona(user.avatar) ? user.avatar : null,
    title: (user.titleCode && achievementByCode(user.titleCode)?.title) || DEFAULT_TITLE,
    titleCode: user.titleCode ?? null,
    level: DEMO_LEVEL,
    createdAt: user.createdAt,
  };
}

function grant(codes) {
  const store = load();
  const fresh = [...new Set(codes)].filter((c) => !store.achievements[c]).map(achievementByCode).filter(Boolean);
  for (const a of fresh) store.achievements[a.code] = new Date().toISOString();
  return fresh;
}

// --------------------------------------------------------------------- partida

const now = () => Date.now();
const seconds = (from, to) => Math.max(0, (to - from) / 1000);

function owned(id) {
  const round = load().rounds[id];
  if (!round) throw new DemoError(404, "Partida não encontrada");
  return round;
}
function assertActive(round) {
  if (round.status !== "active") throw new DemoError(409, "Esta partida já foi encerrada");
}
const regionPlan = (round) => round.questionIds.map((id) => question(id).region);

function toState(round) {
  const plan = regionPlan(round);
  const regionRules = Object.fromEntries(
    [...new Set(plan)].map((r) => {
      const { name, description } = regionRule(r);
      return [r, { name, description }];
    })
  );
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
    helpsUsed: round.helpsUsed,
    helpsAllowed: helpsAllowed(round.persona),
    timeLimitSeconds: MODE_RULES[round.mode].timeLimitSeconds,
    regionPlan: plan,
    regionRules,
    startedAt: new Date(round.startedAt).toISOString(),
  };
}

function drawQuestions(journey, short) {
  const { regions, perRegion } = JOURNEY_PLAN[journey];
  const ids = [];
  for (const region of regions) {
    const pool = BANK.filter((q) => q.region === region).map((q) => q.id);
    ids.push(...shuffle(pool).slice(0, short ? SHORT_PER_REGION : perRegion));
  }
  return ids;
}

// Tempo gasto na pergunta atual (responder com o menu aberto retoma o relógio antes)
function elapsedNow(round, t) {
  if (!round.currentServedAt) return 0;
  if (round.pausedAt) {
    round.currentServedAt += t - round.pausedAt;
    round.pausedAt = null;
  }
  return seconds(round.currentServedAt, t);
}

// Visão do Palantír: sem outros jogadores, a visão é sempre gerada (inclinada para a correta)
function palantirVision(answers) {
  const counts = new Map();
  const correctShare = 45 + Math.floor(Math.random() * 26);
  let rest = 100 - correctShare;
  const wrong = shuffle(answers.filter((a) => !a.correct));
  wrong.forEach((a, i) => {
    const share = i === wrong.length - 1 ? rest : Math.floor(Math.random() * (rest + 1) * 0.7);
    counts.set(a.id, share);
    rest -= share;
  });
  answers.filter((a) => a.correct).forEach((a) => counts.set(a.id, correctShare));
  return answers.map((a) => ({ answerId: a.id, percent: counts.get(a.id) ?? 0 }));
}

function finishAchievements(round, plan, corrupted) {
  const perfectRegions = [...new Set(plan)].filter((region) => {
    const inRegion = round.answers.filter((a) => a.region === region);
    return inRegion.length === plan.filter((r) => r === region).length && inRegion.every((a) => a.isCorrect);
  });
  const completed = round.status === "finished";
  // jornadas e personagens contados só nesta sessão
  const previous = Object.values(load().rounds).filter((r) => r.status === "finished" && r.id !== round.id);
  const personas = new Set(previous.map((r) => personaOrDefault(r.persona)));
  if (completed) personas.add(personaOrDefault(round.persona));

  return achievementsOnFinish({
    completed,
    journey: round.journey,
    mode: round.mode,
    correctCount: round.correctCount,
    total: round.questionIds.length,
    activeSeconds: round.activeSeconds,
    corrupted,
    ringUses: round.ringUses,
    helpTypesUsed: HELPS.filter((h) => (round.helpsUsed[h] ?? 0) > 0).length,
    livesLost: round.livesLost,
    fastCorrect: round.fastCorrect,
    perfectRegions,
    finishedJourneys: previous.length + (completed ? 1 : 0),
    distinctPersonas: personas.size,
  });
}

// Grava o desfecho da pergunta atual, passa para a próxima e encerra a partida se for o caso
function advance(round, outcome, plan, t) {
  round.activeSeconds += Math.round(Math.min(outcome.elapsed, MAX_COUNTED_SECONDS));
  round.answers.push({ questionId: outcome.questionId, region: outcome.region, isCorrect: outcome.isCorrect, skipped: outcome.skipped });

  round.currentIndex += 1;
  round.currentServedAt = null;
  round.pausedAt = null;
  round.currentAssist = null;

  const regionDone = round.currentIndex >= plan.length || plan[round.currentIndex] !== outcome.region;
  let regionCompleted = null;
  if (regionDone) {
    const inRegion = round.answers.filter((a) => a.region === outcome.region);
    regionCompleted = { region: outcome.region, correct: inRegion.filter((a) => a.isCorrect).length, total: inRegion.length };
  }

  const codes = outcome.skipped ? [] : achievementsOnAnswer({ isCorrect: outcome.isCorrect, streak: round.streak, regionCompleted: regionCompleted ?? undefined });

  const completed = round.currentIndex >= round.questionIds.length;
  const outOfLives = round.lives === 0;
  const corrupted = round.corruption >= MAX_CORRUPTION;
  if (completed || outOfLives || corrupted) {
    round.status = outOfLives || corrupted ? "failed" : "finished";
    round.failReason = corrupted ? "corrupted" : outOfLives ? "lives" : null;
    round.finishedAt = t;
    if (round.status === "finished") {
      round.completionBonus = completionBonus(round.activeSeconds, round.questionIds.length);
      round.scoreRound += round.completionBonus;
    }
    codes.push(...finishAchievements(round, plan, corrupted));
  }

  const newAchievements = grant(codes);
  return {
    score: round.scoreRound,
    streak: round.streak,
    lives: round.lives,
    corruption: round.corruption,
    ringUses: round.ringUses,
    helpsUsed: round.helpsUsed,
    answered: round.currentIndex,
    total: round.questionIds.length,
    status: round.status,
    failReason: round.failReason,
    regionCompleted,
    newAchievements,
    level: DEMO_LEVEL,
  };
}

function summary(round) {
  const plan = regionPlan(round);
  // na ordem da viagem
  const perRegion = [...new Set(plan)].map((region) => ({
    region,
    name: REGIONS[region],
    correct: round.answers.filter((a) => a.region === region && a.isCorrect).length,
    total: plan.filter((r) => r === region).length,
  }));

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
    durationSeconds: Math.round(seconds(round.startedAt, round.finishedAt ?? now())),
    perRegion,
    rank: null, // sem ranking na demo
  };
}

// Executa uma operação e salva o estado (como a transação do backend)
function tx(fn) {
  return Promise.resolve().then(() => {
    const result = fn();
    save();
    return result;
  });
}

// --------------------------------------------------------------------- API

export const localApi = {
  register: () => tx(() => publicUser()),
  login: () => tx(() => ({ token: "demo", user: publicUser() })),

  me: () => tx(() => publicUser()),
  updateMe: (data) =>
    tx(() => {
      const { user } = load();
      if (typeof data.name === "string" && data.name.trim()) user.name = data.name.trim().slice(0, 40);
      if (data.avatar !== undefined) user.avatar = isPersona(data.avatar) ? data.avatar : null;
      if (data.titleCode !== undefined) user.titleCode = data.titleCode && load().achievements[data.titleCode] ? data.titleCode : null;
      return publicUser();
    }),
  deleteMe: () => tx(() => resetDemo()),
  achievements: () =>
    tx(() => {
      const got = load().achievements;
      return ACHIEVEMENTS.map((def) => ({ ...def, unlocked: !!got[def.code], unlockedAt: got[def.code] ?? null }));
    }),

  startRound: (mode = "normal", journey = "main", chosen = undefined) =>
    tx(() => {
      const store = load();
      let persona = chosen;
      if (persona) {
        if (!isPersona(persona) || !personaFitsJourney(persona, journey)) throw new DemoError(400, "Este personagem não faz parte desta jornada");
      } else {
        persona = personaOrDefault(store.user.avatar);
        if (!personaFitsJourney(persona, journey)) persona = JOURNEY_DEFAULT_PERSONA[journey];
      }
      // partidas ativas anteriores são abandonadas
      for (const r of Object.values(store.rounds)) if (r.status === "active") Object.assign(r, { status: "abandoned", finishedAt: now() });

      const baseLives = MODE_RULES[mode].lives;
      const round = {
        id: store.nextRoundId++,
        mode,
        journey,
        persona,
        status: "active",
        questionIds: drawQuestions(journey, store.short),
        currentIndex: 0,
        lives: baseLives === null ? null : baseLives + (personaMods(persona).extraLives ?? 0),
        helpsUsed: {},
        streakShieldRegions: [],
        shieldUsed: false,
        streak: 0,
        maxStreak: 0,
        scoreRound: 0,
        corruption: 0,
        ringUses: 0,
        correctCount: 0,
        fastCorrect: 0,
        livesLost: 0,
        activeSeconds: 0,
        completionBonus: 0,
        failReason: null,
        startedAt: now(),
        finishedAt: null,
        currentServedAt: null,
        pausedAt: null,
        currentAssist: null,
        answers: [],
      };
      store.rounds[round.id] = round;
      return toState(round);
    }),

  currentRound: () =>
    tx(() => {
      const active = Object.values(load().rounds).filter((r) => r.status === "active");
      return active.length ? toState(active[active.length - 1]) : null;
    }),
  roundState: (id) => tx(() => toState(owned(id))),

  question: (id) =>
    tx(() => {
      const round = owned(id);
      assertActive(round);
      if (!round.currentServedAt) round.currentServedAt = now();
      const q = question(round.questionIds[round.currentIndex]);
      const limit = questionTimeLimit(round.mode, q.region, round.persona);
      const elapsed = seconds(round.currentServedAt, round.pausedAt ?? now());
      return {
        index: round.currentIndex,
        total: round.questionIds.length,
        question: { id: q.id, question: q.question, region: q.region, difficulty: q.difficulty, answers: shuffle(q.answers).map((a) => ({ id: a.id, answer: a.answer })) },
        timeLimitSeconds: limit,
        remainingSeconds: limit === null ? null : Math.max(0, Math.ceil(limit - elapsed)),
        eliminated: round.currentAssist?.eliminated ?? [],
        palantir: round.currentAssist?.palantir ?? null,
      };
    }),

  answer: (id, questionId, answerId, useRing = false) =>
    tx(() => {
      const round = owned(id);
      assertActive(round);
      if (questionId !== round.questionIds[round.currentIndex]) throw new DemoError(409, "Esta pergunta já foi respondida ou não é a pergunta atual");
      if (!round.currentServedAt) throw new DemoError(409, "Busque a pergunta antes de responder");

      const q = question(questionId);
      const chosen = answerId === null ? null : q.answers.find((a) => a.id === answerId);
      if (answerId !== null && !chosen) throw new DemoError(400, "Alternativa não pertence a esta pergunta");

      const t = now();
      const elapsed = elapsedNow(round, t);
      const limit = questionTimeLimit(round.mode, q.region, round.persona);
      const timeExpired = answerId === null || isTimeExpired(round.mode, elapsed, limit);
      const isCorrect = !timeExpired && !!chosen?.correct;

      const mods = personaMods(round.persona);
      const rule = regionRule(q.region);
      const plan = regionPlan(round);
      const isLastOfRegion = round.currentIndex + 1 >= plan.length || plan[round.currentIndex + 1] !== q.region;

      const shielded = !isCorrect && !!mods.firstErrorShield && !round.shieldUsed;
      if (shielded) round.shieldUsed = true;
      let keepStreak = shielded || (!isCorrect && !!rule.keepStreakOnError);
      if (!isCorrect && !keepStreak && mods.regionStreakShield && !round.streakShieldRegions.includes(q.region)) {
        round.streakShieldRegions.push(q.region);
        keepStreak = true;
      }

      round.streak = isCorrect ? round.streak + 1 : keepStreak ? round.streak : 0;
      round.maxStreak = Math.max(round.maxStreak, round.streak);

      const scored = scoreAnswer({
        isCorrect,
        streak: round.streak,
        elapsedSeconds: elapsed,
        region: q.region,
        persona: round.persona,
        usedRing: useRing,
        isLastOfRegion,
        mode: round.mode,
        shielded,
      });
      round.scoreRound = Math.max(0, round.scoreRound + scored.points);
      round.corruption = clampCorruption(round.corruption + scored.corruptionDelta);
      if (useRing) round.ringUses += 1;
      if (isCorrect) round.correctCount += 1;
      if (isCorrect && elapsed < FAST_SECONDS) round.fastCorrect += 1;
      if (!isCorrect && !shielded && round.lives !== null) {
        const lost = Math.min(round.lives, useRing ? 2 : 1);
        round.lives -= lost;
        round.livesLost += lost;
      }

      const progress = advance(round, { questionId, region: q.region, isCorrect, skipped: false, elapsed }, plan, t);
      return {
        isCorrect,
        timeExpired,
        skipped: false,
        usedRing: useRing,
        shielded,
        correctAnswerId: q.answers.find((a) => a.correct)?.id ?? null,
        explanation: q.explanation,
        points: scored.points,
        ...progress,
        summary: round.status !== "active" ? summary(round) : null,
      };
    }),

  help: (id, help) =>
    tx(() => {
      const round = owned(id);
      assertActive(round);
      if ((round.helpsUsed[help] ?? 0) >= helpsAllowed(round.persona)[help]) throw new DemoError(409, "Esta ajuda já foi usada nesta partida");
      const needsQuestion = help !== "lembas";
      if (needsQuestion && !round.currentServedAt) throw new DemoError(409, "Busque a pergunta antes de pedir ajuda");
      round.helpsUsed = { ...round.helpsUsed, [help]: (round.helpsUsed[help] ?? 0) + 1 };

      const questionId = round.questionIds[round.currentIndex];
      const q = needsQuestion ? question(questionId) : null;
      const assist = { ...(round.currentAssist ?? {}) };
      const response = { help };

      if (help === "conselho" && q) {
        const already = new Set(assist.eliminated ?? []);
        const wrong = q.answers.filter((a) => !a.correct && !already.has(a.id)).map((a) => a.id);
        assist.eliminated = [...already, ...shuffle(wrong).slice(0, 2)];
        round.currentAssist = assist;
        response.eliminated = assist.eliminated;
      }

      if (help === "palantir" && q) {
        assist.palantir = palantirVision(q.answers);
        round.currentAssist = assist;
        response.palantir = assist.palantir;
      }

      if (help === "lembas") {
        if (round.lives !== null) round.lives += 1;
        round.corruption = personaMods(round.persona).lembasClearsCorruption ? 0 : clampCorruption(round.corruption - LEMBAS_CORRUPTION_RELIEF);
        response.lives = round.lives;
        response.corruption = round.corruption;
      }

      if (help === "passolargo" && q) {
        const t = now();
        const progress = advance(round, { questionId, region: q.region, isCorrect: false, skipped: true, elapsed: elapsedNow(round, t) }, regionPlan(round), t);
        Object.assign(response, {
          skipped: true,
          isCorrect: false,
          timeExpired: false,
          usedRing: false,
          shielded: false,
          correctAnswerId: q.answers.find((a) => a.correct)?.id ?? null,
          explanation: q.explanation,
          points: 0,
          ...progress,
        });
      } else {
        response.helpsUsed = round.helpsUsed;
      }
      return { ...response, summary: round.status !== "active" ? summary(round) : null };
    }),

  pause: (id) =>
    tx(() => {
      const round = owned(id);
      if (round.status === "active" && !round.pausedAt) round.pausedAt = now();
      return { paused: round.status === "active" };
    }),
  resume: (id) =>
    tx(() => {
      const round = owned(id);
      if (round.pausedAt) {
        if (round.currentServedAt) round.currentServedAt += now() - round.pausedAt;
        round.pausedAt = null;
      }
      return { paused: false };
    }),
  abandon: (id) =>
    tx(() => {
      const round = owned(id);
      if (round.status === "active") Object.assign(round, { status: "abandoned", finishedAt: now() });
      return { message: "Partida encerrada" };
    }),
  summary: (id) => tx(() => summary(owned(id))),
  ranking: () => tx(() => []),
};

// Modo apresentador (só na demo): espiar a resposta certa e mexer na corrupção
export const presenter = {
  correctAnswer(roundId) {
    const round = load().rounds[roundId];
    if (!round || round.status !== "active") return null;
    const correct = question(round.questionIds[round.currentIndex]).answers.find((a) => a.correct);
    return correct ? { id: correct.id, answer: correct.answer } : null;
  },
  setCorruption(roundId, value) {
    const round = load().rounds[roundId];
    if (!round || round.status !== "active") return null;
    round.corruption = clampCorruption(Number(value));
    save();
    return round.corruption;
  },
};

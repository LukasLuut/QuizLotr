import { useCallback, useEffect, useReducer, useRef } from "react";
import { api } from "../services/api";

// Partida desta aba: F5 em /playquiz retoma a mesma partida em vez de abrir outra
const ROUND_KEY = "quizlotr-round";
const storeRound = (id) => {
  try {
    sessionStorage.setItem(ROUND_KEY, String(id));
  } catch {
    /* sem sessionStorage: F5 começa partida nova */
  }
};
const readStoredRound = () => {
  try {
    return Number(sessionStorage.getItem(ROUND_KEY)) || null;
  } catch {
    return null;
  }
};
export const clearStoredRound = () => {
  try {
    sessionStorage.removeItem(ROUND_KEY);
  } catch {
    /* nada a limpar */
  }
};

export const FEEDBACK_MS = { correct: 2200, wrong: 3600 };
export const SCENE_MS = 3000;

/*
 Fases da partida:
   loading → scene → question-loading → answering → submitting → feedback
     feedback → question-loading            (mesma região)
     feedback → travel-ready → travelling → scene   (mudou de região)
     feedback → finished                     (fim da jornada ou sem vidas)
   qualquer fase → error → (retry) fase anterior
*/
export const initialState = {
  phase: "loading",
  round: null,
  region: 0,
  targetRegion: null,
  question: null,
  // O Peso do Anel: armado para a próxima resposta
  ringArmed: false,
  // efeitos das ajudas na pergunta atual
  assist: { eliminated: [], palantir: null },
  helpBusy: false,
  selectedId: null,
  result: null,
  summary: null,
  achievements: [],
  fresh: false,
  error: null,
  retryPhase: null,
};

const regionOf = (round, index) => round.regionPlan[Math.min(index, round.regionPlan.length - 1)] ?? 0;

export function gameReducer(state, action) {
  switch (action.type) {
    case "round-loaded": {
      const { round, fresh } = action;
      return { ...initialState, round, fresh, region: regionOf(round, round.answered), phase: "scene" };
    }
    case "scene-done":
      return state.phase === "scene" ? { ...state, phase: "question-loading", fresh: false } : state;
    case "question-loaded":
      return {
        ...state,
        phase: "answering",
        question: action.question,
        selectedId: null,
        result: null,
        ringArmed: false,
        assist: { eliminated: action.question.eliminated || [], palantir: action.question.palantir || null },
      };
    case "ring-toggle":
      return state.phase === "answering" ? { ...state, ringArmed: !state.ringArmed } : state;
    case "help-sent":
      return { ...state, helpBusy: true };
    case "help-failed":
      return { ...state, helpBusy: false };
    case "help-result": {
      const r = action.result;
      return {
        ...state,
        helpBusy: false,
        assist: {
          eliminated: r.eliminated ?? state.assist.eliminated,
          palantir: r.palantir ?? state.assist.palantir,
        },
        round: {
          ...state.round,
          helpsUsed: r.helpsUsed ?? state.round.helpsUsed,
          lives: r.lives !== undefined ? r.lives : state.round.lives,
          corruption: r.corruption ?? state.round.corruption,
        },
      };
    }
    // modo apresentador da demo
    case "corruption-set":
      return state.round ? { ...state, round: { ...state.round, corruption: action.value } } : state;
    case "answer-sent":
      return state.phase === "answering" ? { ...state, phase: "submitting", selectedId: action.answerId } : state;
    case "answer-result": {
      const r = action.result;
      return {
        ...state,
        phase: "feedback",
        helpBusy: false,
        ringArmed: false,
        result: r,
        summary: r.summary,
        achievements: [...state.achievements, ...(r.newAchievements || [])],
        round: {
          ...state.round,
          score: r.score,
          streak: r.streak,
          lives: r.lives,
          answered: r.answered,
          status: r.status,
          corruption: r.corruption ?? state.round.corruption,
          ringUses: r.ringUses ?? state.round.ringUses,
          helpsUsed: r.helpsUsed ?? state.round.helpsUsed,
          correctCount: state.round.correctCount + (r.isCorrect ? 1 : 0),
        },
      };
    }
    case "feedback-done": {
      if (state.phase !== "feedback") return state;
      if (state.summary || state.round.status !== "active") return { ...state, phase: "finished" };
      const next = regionOf(state.round, state.round.answered);
      if (next !== state.region) return { ...state, phase: "travel-ready", targetRegion: next };
      return { ...state, phase: "question-loading" };
    }
    case "travel-start":
      return state.phase === "travel-ready" ? { ...state, phase: "travelling", question: null, result: null, selectedId: null } : state;
    case "arrived":
      return state.phase === "travelling" ? { ...state, phase: "scene", region: state.targetRegion, targetRegion: null } : state;
    case "achievement-shown":
      return { ...state, achievements: state.achievements.filter((a) => a.code !== action.code) };
    case "error":
      return { ...state, phase: "error", error: action.message, retryPhase: action.retryPhase ?? state.phase };
    case "retry":
      return { ...state, phase: state.retryPhase || "question-loading", error: null };
    default:
      return state;
  }
}

/**
 * Sessão de jogo ligada à API de partidas.
 * mode: "normal" | "desafio", journey: "main" | "hobbit" e persona (só para partida nova);
 * resume: tenta continuar a partida ativa.
 */
export function useGameSession({ mode = "normal", journey = "main", persona, resume = false, paused = false } = {}) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const init = useRef(null);
  const busy = useRef(false); // trava síncrona contra clique duplo

  // Carrega ou cria a partida (uma vez só, mesmo com StrictMode montando duas vezes)
  useEffect(() => {
    let alive = true;
    if (!init.current) {
      init.current = (async () => {
        const current = await api.currentRound();
        const stored = readStoredRound();
        if (current && (resume || stored === current.id)) return { round: current, fresh: false };
        const round = await api.startRound(mode, journey, persona);
        return { round, fresh: true };
      })();
    }
    init.current
      .then(({ round, fresh }) => {
        if (!alive) return;
        storeRound(round.id);
        dispatch({ type: "round-loaded", round, fresh });
      })
      .catch((err) => {
        if (!alive) return;
        init.current = null;
        dispatch({ type: "error", message: err.message, retryPhase: "loading" });
      });
    return () => {
      alive = false;
    };
  }, [mode, journey, persona, resume, state.phase === "loading"]); // eslint-disable-line react-hooks/exhaustive-deps

  const roundId = state.round?.id;

  // Busca a pergunta atual
  useEffect(() => {
    if (state.phase !== "question-loading" || !roundId) return;
    const controller = new AbortController();
    api
      .question(roundId, controller.signal)
      .then((question) => dispatch({ type: "question-loaded", question }))
      .catch((err) => {
        if (err.name !== "AbortError") dispatch({ type: "error", message: err.message, retryPhase: "question-loading" });
      });
    return () => controller.abort();
  }, [state.phase, roundId]);

  // Menu aberto (Esc): o servidor congela o relógio da pergunta
  const roundActive = state.round?.status === "active";
  useEffect(() => {
    if (!roundId || !roundActive) return;
    (paused ? api.pause(roundId) : api.resume(roundId)).catch(() => {});
  }, [paused, roundId, roundActive]);

  // Tempo de mostrar o resultado da resposta e o título da região (parado enquanto pausado)
  useEffect(() => {
    if (paused) return;
    if (state.phase === "feedback") {
      const ms = state.result?.isCorrect ? FEEDBACK_MS.correct : FEEDBACK_MS.wrong;
      const t = setTimeout(() => dispatch({ type: "feedback-done" }), ms);
      return () => clearTimeout(t);
    }
    if (state.phase === "scene") {
      const t = setTimeout(() => dispatch({ type: "scene-done" }), SCENE_MS);
      return () => clearTimeout(t);
    }
  }, [state.phase, state.result, paused]);

  const questionId = state.question?.question?.id;

  // answerId null = tempo esgotado
  const answer = useCallback(
    async (answerId) => {
      if (state.phase !== "answering" || paused || busy.current || !questionId) return;
      busy.current = true;
      dispatch({ type: "answer-sent", answerId });
      try {
        const result = await api.answer(roundId, questionId, answerId, state.ringArmed);
        dispatch({ type: "answer-result", result });
      } catch (err) {
        dispatch({ type: "error", message: err.message, retryPhase: "question-loading" });
      } finally {
        busy.current = false;
      }
    },
    [state.phase, paused, roundId, questionId, state.ringArmed]
  );

  // Ajuda temática. O Passolargo responde como uma resposta (pula para a próxima).
  const requestHelp = useCallback(
    async (code) => {
      if (state.phase !== "answering" || paused || busy.current || !roundId) return;
      busy.current = true;
      dispatch({ type: code === "passolargo" ? "answer-sent" : "help-sent", answerId: null });
      try {
        const result = await api.help(roundId, code);
        dispatch({ type: code === "passolargo" ? "answer-result" : "help-result", result });
      } catch (err) {
        if (code === "passolargo") dispatch({ type: "error", message: err.message, retryPhase: "question-loading" });
        else dispatch({ type: "help-failed" });
      } finally {
        busy.current = false;
      }
    },
    [state.phase, paused, roundId]
  );

  const restart = useCallback(async () => {
    try {
      if (roundId && state.round?.status === "active") await api.abandon(roundId);
      const round = await api.startRound(state.round?.mode || mode, state.round?.journey || journey, state.round?.persona || persona);
      storeRound(round.id);
      dispatch({ type: "round-loaded", round, fresh: true });
    } catch (err) {
      dispatch({ type: "error", message: err.message, retryPhase: "loading" });
    }
  }, [roundId, state.round, mode, journey, persona]);

  return {
    state,
    answer,
    timeout: useCallback(() => answer(null), [answer]),
    requestHelp,
    toggleRing: useCallback(() => dispatch({ type: "ring-toggle" }), []),
    startTravel: useCallback(() => dispatch({ type: "travel-start" }), []),
    arrived: useCallback(() => dispatch({ type: "arrived" }), []),
    achievementShown: useCallback((code) => dispatch({ type: "achievement-shown", code }), []),
    retry: useCallback(() => dispatch({ type: "retry" }), []),
    setCorruption: useCallback((value) => dispatch({ type: "corruption-set", value }), []),
    restart,
  };
}

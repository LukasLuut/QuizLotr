import { describe, expect, it } from "vitest";
import { gameReducer, initialState } from "./useGameSession";

const round = { id: 1, mode: "normal", status: "active", total: 6, answered: 0, score: 0, correctCount: 0, streak: 0, lives: null, regionPlan: [0, 0, 0, 1, 1, 1] };
const loaded = gameReducer(initialState, { type: "round-loaded", round, fresh: true });
const answering = gameReducer(gameReducer(loaded, { type: "scene-done" }), { type: "question-loaded", question: { question: { id: 10 } } });
const result = (over) => ({ isCorrect: true, points: 1300, score: 1300, streak: 1, lives: null, answered: 1, status: "active", summary: null, newAchievements: [], ...over });

describe("gameReducer", () => {
  it("começa pela cena da região da pergunta atual", () => {
    expect(loaded.phase).toBe("scene");
    expect(loaded.region).toBe(0);
    const resumed = gameReducer(initialState, { type: "round-loaded", round: { ...round, answered: 4 }, fresh: false });
    expect(resumed.region).toBe(1);
  });

  it("só aceita uma resposta por pergunta", () => {
    const sent = gameReducer(answering, { type: "answer-sent", answerId: 5 });
    expect(sent.phase).toBe("submitting");
    expect(gameReducer(sent, { type: "answer-sent", answerId: 6 }).selectedId).toBe(5);
  });

  it("usa a pontuação do servidor", () => {
    const s = gameReducer(gameReducer(answering, { type: "answer-sent", answerId: 5 }), { type: "answer-result", result: result() });
    expect(s.phase).toBe("feedback");
    expect(s.round.score).toBe(1300);
    expect(s.round.correctCount).toBe(1);
  });

  it("continua na mesma região ou pede para viajar", () => {
    const same = gameReducer({ ...answering, phase: "feedback", round: { ...round, answered: 1 } }, { type: "feedback-done" });
    expect(same.phase).toBe("question-loading");
    const travel = gameReducer({ ...answering, phase: "feedback", round: { ...round, answered: 3 } }, { type: "feedback-done" });
    expect(travel.phase).toBe("travel-ready");
    expect(travel.targetRegion).toBe(1);
    const moving = gameReducer(travel, { type: "travel-start" });
    const arrived = gameReducer(moving, { type: "arrived" });
    expect(arrived).toMatchObject({ phase: "scene", region: 1, targetRegion: null });
  });

  it("termina quando o servidor manda o resumo (inclusive na última região)", () => {
    const s = { ...answering, phase: "feedback", summary: { status: "finished" }, round: { ...round, answered: 6, status: "finished" } };
    expect(gameReducer(s, { type: "feedback-done" }).phase).toBe("finished");
  });

  it("enfileira e remove conquistas", () => {
    const s = gameReducer(answering, { type: "answer-result", result: result({ newAchievements: [{ code: "a", title: "A" }] }) });
    expect(s.achievements).toHaveLength(1);
    expect(gameReducer(s, { type: "achievement-shown", code: "a" }).achievements).toHaveLength(0);
  });
});

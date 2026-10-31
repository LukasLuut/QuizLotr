import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "../components/layout/Sidebar";
import { gameReducer, initialState } from "../hooks/useGameSession";
import { CORRUPTED_LINES, LINES, pickLine } from "./lines";
import { PERSONAS } from "./personas";
import { helpsLeft } from "./helps";

const round = {
  id: 1,
  mode: "normal",
  persona: "frodo",
  status: "active",
  total: 6,
  answered: 0,
  score: 0,
  correctCount: 0,
  streak: 0,
  lives: null,
  corruption: 0,
  helpsUsed: {},
  helpsAllowed: { conselho: 1, palantir: 1, lembas: 1, passolargo: 1 },
  regionPlan: [0, 0, 0, 1, 1, 1],
  regionRules: { 0: { name: "Paz do Condado", description: "Errar não quebra a sua sequência de acertos." } },
};
const loaded = gameReducer(initialState, { type: "round-loaded", round, fresh: true });
const answering = gameReducer(gameReducer(loaded, { type: "scene-done" }), {
  type: "question-loaded",
  question: { question: { id: 10 }, eliminated: [3], palantir: null },
});

describe("falas dos personagens", () => {
  it("cada personagem tem ao menos 10 falas de acerto e 10 de erro", () => {
    for (const p of PERSONAS) {
      expect(LINES[p.code].correct.length).toBeGreaterThanOrEqual(10);
      expect(LINES[p.code].wrong.length).toBeGreaterThanOrEqual(10);
    }
  });

  it("não repete a fala anterior e muda com a corrupção alta", () => {
    const first = pickLine("sam", { isCorrect: true });
    for (let i = 0; i < 20; i++) expect(pickLine("sam", { isCorrect: true }, first)).not.toBe(first);
    expect(CORRUPTED_LINES).toContain(pickLine("sam", { isCorrect: false, corruption: 90 }));
  });
});

describe("Anel e ajudas no estado do jogo", () => {
  it("a pergunta chega com as ajudas já usadas (F5) e o Anel desarmado", () => {
    expect(answering.assist.eliminated).toEqual([3]);
    expect(answering.ringArmed).toBe(false);
    expect(gameReducer(answering, { type: "ring-toggle" }).ringArmed).toBe(true);
  });

  it("resultado de ajuda atualiza contadores, vidas e corrupção", () => {
    const s = gameReducer(answering, { type: "help-result", result: { help: "lembas", helpsUsed: { lembas: 1 }, lives: 4, corruption: 0 } });
    expect(s.round.lives).toBe(4);
    expect(helpsLeft(s.round).lembas).toBe(0);
    expect(helpsLeft(s.round).conselho).toBe(1);
  });
});

describe("Sidebar 2.0", () => {
  it("mostra habilidades, regra da região, corrupção e a fala", () => {
    const outcome = { isCorrect: true, points: 1200, explanation: "Curiosidade.", line: "Bilbo ficaria orgulhoso." };
    render(<Sidebar player={{ name: "Frodo" }} round={{ ...round, corruption: 45 }} region={0} outcome={outcome} timerRunning={false} />);
    expect(screen.getByRole("list", { name: "Habilidades de Frodo" }).children).toHaveLength(2);
    expect(screen.getByText(/Paz do Condado/)).toBeInTheDocument();
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "45");
    expect(screen.getByText(/Bilbo ficaria orgulhoso/)).toBeInTheDocument();
  });
});

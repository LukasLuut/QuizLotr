import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "../components/layout/Sidebar";
import ToolsPanel from "../components/layout/ToolsPanel";
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

  it("40 falas de acerto e 40 de erro por personagem, sem repetir, curtas para a placa", () => {
    for (const p of PERSONAS) {
      for (const key of ["correct", "wrong"]) {
        const pool = LINES[p.code][key];
        expect(pool.length).toBeGreaterThanOrEqual(40);
        expect(new Set(pool).size).toBe(pool.length);
        for (const l of pool) expect(l.length).toBeLessThanOrEqual(70);
      }
    }
  });

  it("não repete fala dentro da partida", () => {
    const used = new Set();
    for (let i = 0; i < 40; i++) {
      const l = pickLine("gimli", { isCorrect: true }, used);
      expect(used.has(l)).toBe(false);
      used.add(l);
    }
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
  it("placa mostra o personagem e a fala; painel mostra a regra", () => {
    const outcome = { isCorrect: true, points: 1200, explanation: "Curiosidade.", line: "Bilbo ficaria orgulhoso." };
    render(<Sidebar player={{ name: "Lukas" }} round={{ ...round, corruption: 45 }} region={0} outcome={outcome} timerRunning={false} />);
    expect(screen.getByRole("heading", { name: "Frodo" })).toBeInTheDocument();
    expect(screen.queryByText("Lukas")).not.toBeInTheDocument();
    expect(screen.getByText(/Paz do Condado/)).toBeInTheDocument();
    expect(screen.queryByRole("meter")).not.toBeInTheDocument();
    expect(screen.getByText(/Bilbo ficaria orgulhoso/)).toBeInTheDocument();
  });

  it("painel da direita mostra a corrupção do Anel embaixo do botão", () => {
    render(<ToolsPanel round={{ ...round, corruption: 45 }} player={{ name: "Lukas" }} locked={false} ringArmed={false} />);
    expect(screen.getByRole("meter", { name: "Corrupção do Anel" })).toHaveAttribute("aria-valuenow", "45");
  });
});

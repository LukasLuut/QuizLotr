import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar";

const round = { answered: 3, total: 40, score: 2500, correctCount: 2, streak: 0, lives: null };

describe("Sidebar", () => {
  it("mostra a explicação da última resposta e o título do resultado", () => {
    const outcome = { isCorrect: false, timeExpired: false, streak: 0, answered: 3, points: 0, explanation: "Elrond é o senhor de Valfenda." };
    render(<Sidebar player={{ name: "Sam" }} round={round} region={2} outcome={outcome} timerRunning={false} />);
    expect(screen.getByText("Não foi dessa vez.")).toBeInTheDocument();
    expect(screen.getByText(/Elrond é o senhor de Valfenda/)).toBeInTheDocument();
  });

  it("acerto mostra os pontos ganhos", () => {
    const outcome = { isCorrect: true, timeExpired: false, streak: 1, answered: 1, points: 1300, explanation: "Curiosidade." };
    render(<Sidebar player={{ name: "Sam" }} round={round} region={0} outcome={outcome} timerRunning={false} />);
    expect(screen.getByText("Correto! +1300")).toBeInTheDocument();
  });
});

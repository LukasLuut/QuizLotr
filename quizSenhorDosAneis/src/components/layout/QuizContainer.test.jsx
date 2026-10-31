import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuizContainer from "./QuizContainer";

vi.mock("../Map", () => ({
  default: ({ showAdvance, onAdvance }) =>
    showAdvance ? (
      <button type="button" onClick={onAdvance}>
        Avançar
      </button>
    ) : null,
}));

const question = {
  index: 0,
  total: 40,
  timeLimitSeconds: null,
  question: {
    id: 9,
    question: "Quem é o senhor de Valfenda?",
    answers: [
      { id: 1, answer: "Elrond" },
      { id: 2, answer: "Gandalf" },
      { id: 3, answer: "Sauron" },
      { id: 4, answer: "Bilbo" },
    ],
  },
};
const base = { phase: "answering", question, result: null, selectedId: null, region: 2, targetRegion: null, fresh: false };

describe("QuizContainer", () => {
  it("mostra pergunta e alternativas e envia a escolhida", async () => {
    const onAnswer = vi.fn();
    render(<QuizContainer game={base} onAnswer={onAnswer} />);
    expect(screen.getByText(/senhor de Valfenda/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Elrond" }));
    expect(onAnswer).toHaveBeenCalledWith(1);
  });

  it("trava as alternativas enquanto a resposta é enviada", async () => {
    const onAnswer = vi.fn();
    render(<QuizContainer game={{ ...base, phase: "submitting", selectedId: 1 }} onAnswer={onAnswer} />);
    for (const btn of screen.getAllByRole("button")) expect(btn).toBeDisabled();
    await userEvent.click(screen.getAllByRole("button")[1]);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("no erro, marca a escolhida e revela a correta com a explicação", () => {
    const result = { isCorrect: false, correctAnswerId: 1, points: 0, explanation: "Elrond, o Meio-Elfo." };
    render(<QuizContainer game={{ ...base, phase: "feedback", selectedId: 2, result }} onAnswer={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Elrond.*correta/ })).toHaveClass("correct");
    expect(screen.getByRole("button", { name: /Gandalf.*incorreta/ })).toHaveClass("wrong");
    expect(screen.getByText(/Meio-Elfo/)).toBeInTheDocument();
  });

  it("entre regiões mostra o botão de avançar no lugar da pergunta", async () => {
    const onAdvance = vi.fn();
    render(<QuizContainer game={{ ...base, phase: "travel-ready", targetRegion: 3 }} onAnswer={vi.fn()} onAdvance={onAdvance} />);
    expect(screen.queryByText(/senhor de Valfenda/)).not.toBeInTheDocument();
    expect(screen.getByText(/Moria/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Avançar" }));
    expect(onAdvance).toHaveBeenCalled();
  });
});

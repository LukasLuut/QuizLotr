import { useEffect, useState } from "react";
import { presenter } from "@demo";
import "./PresenterPanel.css";

/**
 * Modo apresentador da demo (Shift + D abre e fecha): mostra a resposta certa, responde
 * certo ou errado com um clique e mexe na corrupção, para mostrar o jogo inteiro rápido.
 */
function PresenterPanel({ game }) {
  const [open, setOpen] = useState(false);
  const { phase, round, question } = game.state;
  const questionId = question?.question?.id;
  const correct = open && round && questionId ? presenter.correctAnswer(round.id) : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && e.code === "KeyD") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open || !round) return null;

  const answering = phase === "answering";
  const wrong = question?.question?.answers.find((a) => a.id !== correct?.id);

  const setCorruption = (e) => {
    const value = presenter.setCorruption(round.id, e.target.value);
    if (value !== null) game.setCorruption(value);
  };

  return (
    <aside className="presenter-panel" aria-label="Modo apresentador">
      <p className="presenter-title">Modo apresentador</p>
      <p className="presenter-answer">
        Resposta certa: <strong>{answering && correct ? correct.answer : "—"}</strong>
      </p>
      <div className="presenter-actions">
        <button type="button" disabled={!answering || !correct} onClick={() => game.answer(correct.id)}>
          Responder certo
        </button>
        <button type="button" disabled={!answering || !wrong} onClick={() => game.answer(wrong.id)}>
          Responder errado
        </button>
      </div>
      <label className="presenter-corruption">
        Corrupção: {Math.round(round.corruption)}%
        <input type="range" min="0" max="99" value={Math.round(round.corruption)} onChange={setCorruption} />
      </label>
      <p className="presenter-hint">Shift + D fecha</p>
    </aside>
  );
}

export default PresenterPanel;

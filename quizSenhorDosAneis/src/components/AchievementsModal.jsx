import { useEffect, useId, useState } from "react";
import Modal from "./Modal";
import Button from "./buttons/Button";
import { api } from "../services/api";
import "./AchievementsModal.css";

// Lista todas as conquistas do jogo, marcando as já desbloqueadas
function AchievementsModal({ isOpen, onClose }) {
  const titleId = useId();
  const [state, setState] = useState({ status: "idle", items: [], error: null });

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;
    setState((s) => ({ ...s, status: "loading", error: null }));
    api
      .achievements()
      .then((items) => alive && setState({ status: "ready", items, error: null }))
      .catch((err) => alive && setState({ status: "error", items: [], error: err.message }));
    return () => {
      alive = false;
    };
  }, [isOpen]);

  const unlocked = state.items.filter((a) => a.unlocked).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy={titleId} className="achievements-modal">
      <h2 id={titleId}>Conquistas</h2>
      {state.status === "loading" && <p className="achievements-status">Consultando os anais...</p>}
      {state.status === "error" && (
        <p className="achievements-status" role="alert">
          {state.error}
        </p>
      )}
      {state.status === "ready" && (
        <>
          <p className="achievements-status">
            {unlocked} de {state.items.length} desbloqueadas
          </p>
          <ul className="achievements-list">
            {state.items.map((a) => (
              <li key={a.code} className={a.unlocked ? "unlocked" : "locked"}>
                <span className="achievement-icon" aria-hidden="true">
                  {a.unlocked ? "★" : "☆"}
                </span>
                <div>
                  <p className="achievement-title">
                    {a.title}
                    <span className="visually-hidden">{a.unlocked ? " (desbloqueada)" : " (bloqueada)"}</span>
                  </p>
                  <p className="achievement-desc">{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Button variant="plain" onClick={onClose}>
        Fechar
      </Button>
    </Modal>
  );
}

export default AchievementsModal;

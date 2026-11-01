// Sidebar.jsx
import "./Sidebar.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Avatar from "../Avatar";
import AbilityDial from "../AbilityDial";
import Cronometro from "./Cronometro";
import { regionAt } from "../../config/regions";
import { personaAt } from "../../config/personas";

// Título da explicação: pontos ganhos, erro, pulo ou tempo esgotado
// nome do escudo de quem anula o 1º erro
const SHIELD_TITLE = { fili: "Irmão de Escudo!", eowyn: "Donzela-Escudeira!" };

function outcomeTitle(o, persona) {
  if (o.skipped) return "Passolargo!";
  if (o.timeExpired && !o.isCorrect) return "Tempo esgotado!";
  if (o.shielded) return SHIELD_TITLE[persona] ?? "Escudo!";
  if (o.isCorrect) return "Correto! +" + o.points;
  return o.points < 0 ? `Errou! ${o.points}` : "Não foi dessa vez.";
}

/**
 * Coluna do jogador em duas caixas:
 * 1) placa do personagem (foto, nome e fala após cada resposta; a foto abre as habilidades);
 * 2) painel da partida: região, regra e pontuação no topo; explicação da última
 *    resposta no meio; cronômetro e, embaixo, a barra de progresso.
 */
export default function Sidebar({ player, round, region, outcome, introLine = null, timerRunning }) {
  const answered = round?.answered ?? 0;
  const total = round?.total ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const persona = personaAt(round?.persona || player?.avatar);
  const rule = round?.regionRules?.[region];
  const baseLives = 3 + (persona.code === "sam" ? 1 : 0);
  const [dialOpen, setDialOpen] = useState(false);

  // Esc recolhe as habilidades
  useEffect(() => {
    if (!dialOpen) return;
    const onKey = (e) => e.key === "Escape" && setDialOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialOpen]);

  return (
    <aside className={`sidebar ${dialOpen ? "dial-active" : ""}`} aria-label="Jogador e partida">
      {/* véu leve sobre o resto da tela; clicar fora recolhe (no body: o filter da sidebar prenderia o fixed) */}
      {createPortal(<div className={`ability-veil ${dialOpen ? "open" : ""}`} onClick={() => setDialOpen(false)} aria-hidden="true" />, document.body)}
      <section className="player-card" aria-label="Jogador">
        {/* clicar na foto abre as habilidades como o "⋯" do Luut Automator (speed_dial.py):
            a foto desliza para o lado e as opções saem de trás dela, em coluna ao lado */}
        <button
          type="button"
          className={`player-avatar dial-host ${dialOpen ? "dial-open" : ""}`}
          aria-expanded={dialOpen}
          aria-controls="ability-dial"
          aria-label={`Habilidades de ${persona.name}`}
          onClick={() => setDialOpen((o) => !o)}
        >
          <Avatar persona={persona.code} name={player?.name} />
          <AbilityDial id="ability-dial" abilities={persona.abilities} open={dialOpen} />
        </button>
        {/* nome do personagem e a fala dele depois de cada resposta */}
        <div className="player-text">
          <h2 className="player-name">{persona.name}</h2>
          {/* antes da primeira resposta, a fala de abertura */}
          <p className="persona-line" key={outcome ? outcome.line : introLine} aria-live="polite">
            {outcome?.line ? `“${outcome.line}”` : !outcome && introLine ? `“${introLine}”` : ""}
          </p>
        </div>

      </section>

      <section className="match-card" aria-label="Partida">
        <div className="match-content">
          <div className="region-head">
            <p className="region-now">{regionAt(region).name}</p>
            {rule?.name && (
              <p className="region-rule">
                <strong>{rule.name}:</strong> {rule.description}
              </p>
            )}
          </div>

          <dl className="match-stats">
            <div className="match-stat">
              <dt>Pontuação</dt>
              <dd>{round?.score ?? 0}</dd>
            </div>
            {round?.lives !== null && round?.lives !== undefined && (
              <div className="match-stat">
                <dt>Vidas</dt>
                <dd className="lives" aria-label={`${round.lives} vidas`}>
                  <span aria-hidden="true">
                    {"♥".repeat(round.lives)}
                    <span className="lives-lost">{"♥".repeat(Math.max(0, baseLives - round.lives))}</span>
                  </span>
                </dd>
              </div>
            )}
          </dl>

          {/* Fala do personagem e explicação da última resposta: só mudam na próxima resposta */}
          <div className="answer-explanation" aria-live="polite">
            {outcome && (
              <p className={outcome.isCorrect || outcome.skipped || outcome.shielded ? "explanation-correct" : "explanation-wrong"}>
                <strong>{outcomeTitle(outcome, persona.code)}</strong> {outcome.explanation}
              </p>
            )}
          </div>

          <div className="cronometro-sidebar">
            <Cronometro running={timerRunning} />
          </div>

          <div className="progress">
            <p id="progress-label">
              Progresso <strong>{answered}/{total}</strong>
            </p>
            <div className="progress-bar" role="progressbar" aria-labelledby="progress-label" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

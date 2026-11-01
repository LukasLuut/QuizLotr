// ToolsPanel.jsx
import "./ToolsPanel.css";
import ringIcon from "../../assets/images/circleOneRing.webp";
import { HELPS, helpsLeft } from "../../config/helps";
import { personaAt } from "../../config/personas";

// Mesmas regras da API (game/rules.ts): +0,1x por acerto seguido, até 1,9x (Aragorn 2,5x)
const streakMultiplier = (streak, persona) => {
  const cap = persona === "aragorn" ? 2.5 : 1.9;
  return Math.min(cap, 1 + 0.1 * (Math.max(streak, 1) - 1));
};

const RING_FACTOR = { frodo: 2.5 };
const RING_CORRUPTION = { frodo: 9, galadriel: 8 }; // 15 com o fator de cada personagem

const fmt = (n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/**
 * Coluna da direita: o que o jogador pode USAR na partida.
 * Topo: o Anel; meio: as ajudas temáticas; base: sequência e recorde.
 */
export default function ToolsPanel({ round, player, locked, ringArmed, onToggleRing, onHelp }) {
  const persona = personaAt(round?.persona || player?.avatar);
  const left = helpsLeft(round);
  const streak = round?.streak ?? 0;
  const score = round?.score ?? 0;
  const best = player?.bestScore ?? 0;
  const ringFactor = RING_FACTOR[persona.code] ?? 2;
  const ringCost = RING_CORRUPTION[persona.code] ?? 15;
  const hobbit = round?.journey === "hobbit";

  return (
    <aside className="tools-panel" aria-label="Anel e ajudas">
      <div className="tools-content">
        {/* O Anel */}
        <section className="tools-ring" aria-labelledby="tools-ring-title">
          <h2 id="tools-ring-title" className="tools-title">
            O Um Anel
          </h2>
          <button
            type="button"
            className={`ring-toggle ${ringArmed ? "armed" : ""}`}
            aria-pressed={ringArmed}
            disabled={locked}
            onClick={onToggleRing}
          >
            <img src={ringIcon} alt="" />
            <span>{ringArmed ? "Anel no dedo" : "Usar o Anel"}</span>
          </button>
          <p className="tools-note">
            Acerto vale ×{fmt(ringFactor)}, mas corrompe +{ringCost}. Usado {round?.ringUses ?? 0}x.
          </p>
        </section>

        {/* Ajudas temáticas */}
        <section className="tools-helps" aria-labelledby="tools-helps-title">
          <h2 id="tools-helps-title" className="tools-title">
            Ajudas
          </h2>
          <ul className="help-list">
            {HELPS.map((h) => {
              const remaining = Math.max(0, left[h.code]);
              return (
                <li key={h.code}>
                  <button
                    type="button"
                    className="help-item"
                    disabled={locked || remaining <= 0}
                    onClick={() => onHelp?.(h.code)}
                    aria-label={`${h.name}: ${h.description} (${remaining} restante)`}
                  >
                    <span className="help-icon" aria-hidden="true">
                      {h.icon}
                    </span>
                    <span className="help-text">
                      <span className="help-name">{h.name}</span>
                      <span className="help-desc">{h.description}</span>
                    </span>
                    <span className="help-left" aria-hidden="true">
                      {remaining}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Sequência e recorde */}
        <dl className="tools-stats">
          <div className="tools-stat">
            <dt>Sequência</dt>
            <dd>
              {streak} <span className="tools-mult">×{fmt(streakMultiplier(streak, persona.code))}</span>
            </dd>
          </div>
          {!hobbit && (
            <div className="tools-stat">
              <dt>Recorde</dt>
              <dd>{score > best ? "Novo recorde!" : `faltam ${(best - score).toLocaleString("pt-BR")}`}</dd>
            </div>
          )}
        </dl>

        <p className="tools-persona">
          <strong>{persona.name}:</strong> {persona.abilities.map((a) => a.description).join(" ")}
        </p>
      </div>
    </aside>
  );
}

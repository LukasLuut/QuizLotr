// Sidebar.jsx
import "./Sidebar.css";
import Avatar from "../Avatar";
import Cronometro from "./Cronometro";
import { regionAt } from "../../config/regions";
import { personaAt } from "../../config/personas";

// Título da explicação: pontos ganhos, erro, pulo ou tempo esgotado
function outcomeTitle(o) {
  if (o.skipped) return "Passolargo!";
  if (o.timeExpired && !o.isCorrect) return "Tempo esgotado!";
  if (o.shielded) return "Escudo de Gondor!";
  if (o.isCorrect) return "Correto! +" + o.points;
  return o.points < 0 ? `Errou! ${o.points}` : "Não foi dessa vez.";
}

const corruptionLabel = (c) => (c >= 70 ? "O Anel te domina" : c >= 40 ? "O Anel sussurra" : c > 0 ? "O Anel pesa" : "Coração puro");

/**
 * Coluna do jogador em duas caixas:
 * 1) placa com a identidade (foto, nome, título, habilidades e a corrupção do Anel);
 * 2) painel da partida: região, regra e pontuação no topo; fala do personagem e
 *    explicação da última resposta no meio; cronômetro e, embaixo, a barra de progresso.
 */
export default function Sidebar({ player, round, region, outcome, timerRunning }) {
  const answered = round?.answered ?? 0;
  const total = round?.total ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const persona = personaAt(round?.persona || player?.avatar);
  const corruption = round?.corruption ?? 0;
  const rule = round?.regionRules?.[region];
  const baseLives = 3 + (persona.code === "sam" ? 1 : 0);

  return (
    <aside className="sidebar" aria-label="Jogador e partida">
      <section className="player-card" aria-label="Jogador">
        <Avatar persona={persona.code} name={player?.name} className="player-avatar" />
        <div className="player-text">
          <h2 className="player-name">{player?.name}</h2>
          {/* título escolhido no Editar Perfil (vem das conquistas) */}
          <p className="span-title">{player?.title || "Viajante do Condado"}</p>
          <ul className="player-abilities" aria-label={`Habilidades de ${persona.name}`}>
            {persona.abilities.map((a) => (
              <li key={a.code} className="ability" tabIndex={0} aria-label={`${a.name}: ${a.description}`}>
                <span aria-hidden="true">{a.icon}</span>
                <span className="ability-tip" role="tooltip">
                  <strong>{a.name}</strong>
                  {a.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* O Peso do Anel: em 100 a partida termina */}
        <div className="corruption">
          <p id="corruption-label" className="corruption-label">
            <span>{corruptionLabel(corruption)}</span>
            <span>{corruption}%</span>
          </p>
          <div className="corruption-bar" role="meter" aria-labelledby="corruption-label" aria-valuemin={0} aria-valuemax={100} aria-valuenow={corruption}>
            <div className="corruption-fill" style={{ width: `${corruption}%` }}></div>
          </div>
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
              <>
                {outcome.line && (
                  <p className="persona-line">
                    <span className="persona-line-name">{persona.name}:</span> “{outcome.line}”
                  </p>
                )}
                <p className={outcome.isCorrect || outcome.skipped || outcome.shielded ? "explanation-correct" : "explanation-wrong"}>
                  <strong>{outcomeTitle(outcome)}</strong> {outcome.explanation}
                </p>
              </>
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

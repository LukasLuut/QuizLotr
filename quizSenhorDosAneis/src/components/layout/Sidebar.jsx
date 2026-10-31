// Sidebar.jsx
import "./Sidebar.css";
import Avatar from "../Avatar";
import Cronometro from "./Cronometro";
import { regionAt } from "../../config/regions";

// Título da explicação: pontos ganhos, erro ou tempo esgotado
function outcomeTitle(o) {
  if (o.timeExpired && !o.isCorrect) return "Tempo esgotado!";
  return o.isCorrect ? "Correto! +" + o.points : "Não foi dessa vez.";
}

/**
 * Coluna do jogador em duas caixas:
 * 1) placa com a identidade (foto, nome e título);
 * 2) painel da partida: região e pontuação no topo; explicação da última resposta
 *    no meio; cronômetro e, embaixo, a barra de progresso.
 */
export default function Sidebar({ player, round, region, outcome, timerRunning }) {
  const answered = round?.answered ?? 0;
  const total = round?.total ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <aside className="sidebar" aria-label="Jogador e partida">
      <section className="player-card" aria-label="Jogador">
        <Avatar persona={player?.avatar} name={player?.name} className="player-avatar" />
        <div className="player-text">
          <h2 className="player-name">{player?.name}</h2>
          {/* título escolhido no Editar Perfil (vem das conquistas) */}
          <p className="span-title">{player?.title || "Viajante do Condado"}</p>
        </div>
      </section>

      <section className="match-card" aria-label="Partida">
        <div className="match-content">
          <p className="region-now">{regionAt(region).name}</p>

          <dl className="match-stats">
            <div className="match-stat">
              <dt>Pontuação</dt>
              <dd>{round?.score ?? 0}</dd>
            </div>
            {round?.lives !== null && round?.lives !== undefined && (
              <div className="match-stat">
                <dt>Vidas</dt>
                <dd className="lives" aria-label={`${round.lives} de 3`}>
                  <span aria-hidden="true">
                    {"♥".repeat(round.lives)}
                    <span className="lives-lost">{"♥".repeat(Math.max(0, 3 - round.lives))}</span>
                  </span>
                </dd>
              </div>
            )}
          </dl>

          {/* Explicação da última resposta: só muda quando outra pergunta é respondida */}
          <div className="answer-explanation" aria-live="polite">
            {outcome && (
              <p className={outcome.isCorrect ? "explanation-correct" : "explanation-wrong"}>
                <strong>{outcomeTitle(outcome)}</strong> {outcome.explanation}
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

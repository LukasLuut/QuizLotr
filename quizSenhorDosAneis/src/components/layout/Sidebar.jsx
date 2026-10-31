// Sidebar.jsx
import "./Sidebar.css";
import borderProfile from "../../assets/images/perfil-border.webp";
import Cronometro from "./Cronometro";
import { regionAt } from "../../config/regions";

// Título do jogador conforme o aproveitamento até agora
function playerTitle(correct, answered) {
  if (answered === 0) return "Viajante do Condado";
  const ratio = correct / answered;
  if (ratio >= 0.9) return "Sábio de Valfenda";
  if (ratio >= 0.7) return "Guardião de Gondor";
  if (ratio >= 0.5) return "Guarda de Bri";
  return "Hobbit perdido";
}

function message(streak, lastCorrect, answered) {
  if (answered === 0) return "A jornada começa com um passo.";
  if (streak >= 5) return `${streak} acertos seguidos!`;
  if (lastCorrect === false) return "Até os sábios erram. Siga em frente.";
  return "Você está mandando bem!";
}

export default function Sidebar({ playerName, round, region, lastCorrect, timerRunning }) {
  const answered = round?.answered ?? 0;
  const total = round?.total ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <aside className="sidebar" aria-label="Situação da jornada">
      <div className="player-info">
        <img className="border-profile-side" src={borderProfile} alt="" />
        <h2 className="player-name">
          {playerName}
          <span className="span-title">{playerTitle(round?.correctCount ?? 0, answered)}</span>
        </h2>
      </div>

      <div className="box-state-atual">
        <p className="region-now">{regionAt(region).name}</p>

        {/* Pontuação */}
        <p className="score">
          Pontuação: <strong>{round?.score ?? 0}</strong>
        </p>

        {round?.lives !== null && round?.lives !== undefined && (
          <p className="lives" aria-label={`${round.lives} vidas restantes`}>
            {"♥".repeat(round.lives)}
            <span className="lives-lost">{"♥".repeat(Math.max(0, 3 - round.lives))}</span>
          </p>
        )}

        {/* Progresso */}
        <div className="progress">
          <p id="progress-label">
            Progresso: {answered}/{total}
          </p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-labelledby="progress-label"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answered}
          >
            <div className="progress-fill" style={{ width: `${percent}%` }}></div>
          </div>
        </div>

        <p className="message" aria-live="polite">
          {message(round?.streak ?? 0, lastCorrect, answered)}
        </p>

        <div className="cronometro-sidebar">
          <Cronometro running={timerRunning} />
        </div>
      </div>
    </aside>
  );
}

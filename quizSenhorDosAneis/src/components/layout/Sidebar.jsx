// Sidebar.jsx
import "./Sidebar.css";
import Avatar from "../Avatar";
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

const ACERTOS = [
  "Muito bem! Gandalf ficaria orgulhoso.",
  "Resposta digna de um sábio de Valfenda.",
  "Certeiro como a flecha de Legolas!",
  "A Sociedade avança com você.",
  "Bilbo anotaria isso no Livro Vermelho.",
];
const ERROS = [
  "Até os sábios erram. Siga em frente.",
  "Nem todos os que vagueiam estão perdidos.",
  "Um tropeço no caminho. Levante-se, hobbit!",
  "A sombra passou. A próxima é sua.",
];

// Mensagem da última resposta: só muda quando outra pergunta é respondida
function message(outcome) {
  if (!outcome) return "A jornada começa com um passo.";
  if (outcome.timeExpired) return "O tempo acabou! Mais atenção na próxima.";
  if (outcome.isCorrect) {
    if (outcome.streak >= 5) return `${outcome.streak} acertos seguidos!`;
    return ACERTOS[outcome.answered % ACERTOS.length];
  }
  return ERROS[outcome.answered % ERROS.length];
}

// Título da explicação: pontos ganhos, erro ou tempo esgotado
function outcomeTitle(o) {
  if (o.timeExpired && !o.isCorrect) return "Tempo esgotado!";
  return o.isCorrect ? "Correto! +" + o.points : "Não foi dessa vez.";
}

/**
 * Coluna do jogador em duas caixas:
 * 1) placa com a identidade (foto, nome e título);
 * 2) painel da partida: região, pontuação e mensagem no topo; explicação da última
 *    resposta logo acima do cronômetro; embaixo, a barra de progresso.
 */
export default function Sidebar({ player, round, region, outcome, timerRunning }) {
  const answered = round?.answered ?? 0;
  const total = round?.total ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <aside className="sidebar" aria-label="Jogador e partida">
      <section className="player-card" aria-label="Jogador">
        <Avatar src={player?.avatar} name={player?.name} className="player-avatar" />
        <div className="player-text">
          <h2 className="player-name">{player?.name}</h2>
          <p className="span-title">{playerTitle(round?.correctCount ?? 0, answered)}</p>
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

          <p className={`message ${outcome ? (outcome.isCorrect ? "message-correct" : "message-wrong") : ""}`} aria-live="polite">
            {message(outcome)}
          </p>

          {/* Explicação da última resposta: logo acima do cronômetro */}
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

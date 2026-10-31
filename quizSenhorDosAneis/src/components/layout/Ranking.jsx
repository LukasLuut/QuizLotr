import { useRanking } from "../../hooks/useRanking";
import { GAME_MODES } from "../../config/regions";

// "Hall dos Heróis": melhor partida de cada jogador no modo atual
function Ranking({ mode = "normal", currentUserId, refreshKey }) {
  const { entries, status, error } = useRanking(mode, { refreshKey });

  return (
    <section className="box-leaderboard" aria-labelledby="ranking-title">
      <h2 id="ranking-title">Hall dos Heróis</h2>
      <p className="ranking-mode">{GAME_MODES[mode]?.label}</p>
      {status === "loading" && <p className="ranking-empty">Carregando...</p>}
      {status === "error" && <p className="ranking-empty">{error}</p>}
      {status === "ready" && entries.length === 0 && <p className="ranking-empty">Ninguém concluiu a jornada ainda. Seja o primeiro!</p>}
      {entries.length > 0 && (
        <ol className="listboard">
          {entries.map((e) => (
            <li key={e.userId} className={`nameRanking ${e.userId === currentUserId ? "me" : ""}`}>
              <span className="ranking-pos">{e.position}.</span>
              <span className="ranking-name">{e.name}</span>
              <span className="ranking-score">{e.score}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default Ranking;

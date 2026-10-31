import { useEffect, useRef, useState } from "react";
import "./Final.css";
import videoFinal from "../../assets/videos/finalLotr.mp4";
import finalPoster from "../../assets/images/posters/finalLotr.jpg";
import victoryPNG from "../../assets/images/victory.png";
import Button from "../buttons/Button";
import { formatarTempo } from "../../utils/format";
import { GAME_MODES } from "../../config/regions";
import { useAudio } from "../../context/AudioContext";

/**
 * Tela final. Vitória: botão "Destruir o Anel" toca o vídeo e mostra o resumo.
 * Derrota (sem vidas no modo Desafio): mostra o resumo direto.
 */
function Final({ summary, onRestart, onProfile }) {
  const won = summary.status === "finished";
  const [showFinal, setShowFinal] = useState(!won);
  const videoRef = useRef(null);
  const { playSfx } = useAudio();
  const headingRef = useRef(null);

  useEffect(() => {
    if (showFinal) headingRef.current?.focus();
  }, [showFinal]);

  const destroyRing = () => {
    setShowFinal(true);
    playSfx("win", { volume: 0.6 });
  };

  const accuracy = summary.answered > 0 ? Math.round((summary.correctCount / summary.answered) * 100) : 0;

  return (
    <div className="div-body-final">
      {!showFinal && (
        <button type="button" className="btn-final" onClick={destroyRing}>
          Destruir o Anel
        </button>
      )}

      {showFinal && (
        <div className="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="final-title">
          {won && <video ref={videoRef} src={videoFinal} className="video-final" poster={finalPoster} muted autoPlay loop playsInline aria-hidden="true" />}

          {won && <img className="victory-img" src={victoryPNG} alt="" />}
          <div className="victory-card">
            <h2 id="final-title" className="victory-title" tabIndex={-1} ref={headingRef}>
              {won ? "O Anel foi destruído!" : "A jornada terminou"}
            </h2>
            <p className="victory-sub">
              {won
                ? `Modo ${GAME_MODES[summary.mode]?.label ?? summary.mode}`
                : `Você chegou até a pergunta ${summary.answered} de ${summary.total}.`}
            </p>

            <dl className="victory-stats">
              <div className="victory-stat">
                <dt className="label">Pontuação</dt>
                <dd className="value">{summary.score}</dd>
              </div>
              <div className="victory-stat">
                <dt className="label">Acertos</dt>
                <dd className="value">
                  {summary.correctCount}/{summary.answered} ({accuracy}%)
                </dd>
              </div>
              <div className="victory-stat">
                <dt className="label">Maior sequência</dt>
                <dd className="value">{summary.maxStreak}</dd>
              </div>
              <div className="victory-stat">
                <dt className="label">Tempo de resposta</dt>
                <dd className="value">{formatarTempo(summary.activeSeconds)}</dd>
              </div>
              {summary.rank && (
                <div className="victory-stat">
                  <dt className="label">Posição no ranking</dt>
                  <dd className="value">{summary.rank}º</dd>
                </div>
              )}
              {summary.completionBonus > 0 && (
                <div className="victory-stat">
                  <dt className="label">Bônus de conclusão</dt>
                  <dd className="value">+{summary.completionBonus}</dd>
                </div>
              )}
            </dl>

            <table className="victory-regions">

              <caption>Acertos por região</caption>
              <tbody>
                {summary.perRegion.map((r) => (
                  <tr key={r.region}>
                    <th scope="row">{r.name}</th>
                    <td>
                      {r.correct}/{r.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="victory-actions">
            <Button onClick={onRestart}>Jogar novamente</Button>
            <Button onClick={onProfile}>Voltar ao perfil</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Final;

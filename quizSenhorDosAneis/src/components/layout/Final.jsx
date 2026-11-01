import { useEffect, useRef, useState } from "react";
import "./Final.css";
// vitória da Sociedade: a cena do Anel destruído (antes o fundo da Montanha da Perdição)
import videoFinal from "../../assets/videos/destroy-the-ring.mp4";
import finalPoster from "../../assets/images/posters/destroy-the-ring.jpg";
import videoHobbitFinal from "../../assets/videos/hobbit-final.mp4";
import hobbitFinalPoster from "../../assets/images/posters/hobbit-final.jpg";
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
  const hobbit = summary.journey === "hobbit";
  const corrupted = summary.failReason === "corrupted";
  // só a jornada principal termina destruindo o Anel
  const [showFinal, setShowFinal] = useState(!won || hobbit);
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
        <div className={`victory-overlay ${won ? "" : "defeat"}`} role="dialog" aria-modal="true" aria-labelledby="final-title">
          {won && <video ref={videoRef} src={hobbit ? videoHobbitFinal : videoFinal} className="video-final" poster={hobbit ? hobbitFinalPoster : finalPoster} muted autoPlay loop playsInline aria-hidden="true" />}

          <div className="victory-card">
            <h2 id="final-title" className="victory-title" tabIndex={-1} ref={headingRef}>
              {won ? (hobbit ? "Lá e de volta outra vez!" : "O Anel foi destruído!") : corrupted ? "O Anel tomou você" : "A jornada terminou"}
            </h2>
            <div className="victory-card-body">
            <p className="victory-sub">
              {won
                ? `${hobbit ? "O Hobbit · " : ""}Modo ${GAME_MODES[summary.mode]?.label ?? summary.mode}`
                : corrupted
                  ? `A corrupção chegou a 100% na pergunta ${summary.answered} de ${summary.total}. Use o Anel com cautela.`
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
                <dt className="label">Usos do Anel</dt>
                <dd className="value">
                  {summary.ringUses} ({summary.corruption}% de corrupção)
                </dd>
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

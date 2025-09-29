import { useState, useRef } from "react";
import imgFinal from "../../assets/images/box/map-box.png";
import "./Final.css";
import videoFinal from "../../assets/videos/finalLotr.mp4";
import { useNavigate } from "react-router-dom";
import victoryPNG from "../../assets/images/victory.png"
import imgBoxVictory from "../../assets/images/box/box-conquista.png";

function Final({ time = null, score = 0 }) {
  const [showFinal, setShowFinal] = useState(false);
  const [buttonText, setButtonText] = useState("Destruir o Anel");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Função utilitária para formatar o tempo em mm:ss
  function formatTime(time) {
    if (time === undefined || time === null) return "--:--";
    if (typeof time === "string") return time;
    const totalSeconds = Math.max(0, Math.floor(Number(time) || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  const handleClick = () => {
    if (!showFinal) {
      // primeira vez: mostra o final e toca o vídeo
      setShowFinal(true);
      setButtonText("Jogar novamente");
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      // segunda vez: redireciona para /quiz
      navigate("/quiz");
    }
  };

  return (
    <div className="div-body-final">
      {/* Botão principal */}
      <button className="btn-final" onClick={handleClick}>
        {buttonText}
      </button>

      {/* Quando showFinal = true, mostra vídeo + tela de vitória */}
      {showFinal && (
        <div className="victory-overlay">
          <video ref={videoRef} src={videoFinal} className="video-final" muted autoPlay loop/>

          <div className="victory-card">
            <img className="victory-img" src={victoryPNG} alt="" />
            <img className="victory-img img-box-conquista-final" src={imgBoxVictory} alt="" />
            <h2 className="victory-title">Parabéns <br></br> Quiz Concluído!</h2>

            <div className="victory-stats">
              <div className="victory-stat">
                <span className="label">Tempo</span>
                <span className="value">{formatTime(time)}</span>
              </div>

              <div className="victory-stat">
                <span className="label">Pontuação</span>
                <span className="value">{score}</span>
              </div>
              
            </div>

            <p className="victory-note">
              Toque em "{buttonText}" para reiniciar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Final;

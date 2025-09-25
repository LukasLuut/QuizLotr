import { useState, useRef } from "react";
import imgFinal from '../../assets/images/box/map-box.png'
import './Final.css'
import videoFinal from '../../assets/videos/destroy-the-ring.mp4'
import { useNavigate } from "react-router-dom";

function Final() {
  const [showFinal, setShowFinal] = useState(false);
  const [buttonText, setButtonText] = useState("Destruir o Anel");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!showFinal) {
      // primeira vez: mostra o final e toca o vídeo
      setShowFinal(true);
      setButtonText("Jogar novamente");
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      // segunda vez: redireciona para /profile
      navigate("/login");
    }
  };

  return (
    <div>
      <button className="btn-final" onClick={handleClick}>
        {buttonText}
      </button>

      {showFinal && (
        <div className="quadro-final">
          <img src={imgFinal} alt="Final" />
          <video
            className="video-final"
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoFinal} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}

export default Final;
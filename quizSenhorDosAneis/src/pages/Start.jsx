import { useEffect, useRef, useState } from "react";
import "./Start.css";
import { useNavigate } from "react-router-dom";
import { useAudio } from "../context/AudioContext";
import circleOneRing from "../assets/images/circleOneRing.webp";
import circleOneRing2 from "../assets/images/circleOneRing2.webp";
import lordOfTheRings from "../assets/images/LordOfTheRings.png";
import MusicaArgonath from "../assets/audio/the-argonath-song.mp3";

function Start() {
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();
  const { playMusic } = useAudio();
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleStart = () => {
    if (fade) return;
    // Ativa o fade e navega quando ele termina (mesma duração do CSS)
    setFade(true);
    playMusic(MusicaArgonath);
    timer.current = setTimeout(() => navigate("/login"), 3000);

    // Tela cheia é opcional: alguns navegadores recusam
    const elem = document.documentElement;
    const request = elem.requestFullscreen || elem.webkitRequestFullscreen;
    if (request) Promise.resolve(request.call(elem)).catch(() => {});
  };

  return (
    <main className="bg">
      <div className="loader__container">
        <img className="img-logo" src={lordOfTheRings} alt="O Senhor dos Anéis" />

        <div className="rings">
          <button type="button" className="loader__ring" onClick={handleStart} aria-label="Iniciar a jornada">
            {/* Inscrição élfica do Um Anel (decorativa) */}
            <img className="loader__inscription" src={circleOneRing} alt="" />
            <img className="loader__inscription loader__inscription2" src={circleOneRing2} alt="" />
          </button>

          <svg viewBox="0 0 300 300" aria-hidden="true">
            <defs>
              <path id="circlePath" d="M 150, 150 m -120,0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0" />
            </defs>
            <text className="circle-text">
              <textPath href="#circlePath" startOffset="50%" textAnchor="middle" textLength="750" lengthAdjust="spacingAndGlyphs">
                &quot;One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them.&quot;
              </textPath>
            </text>
          </svg>
          <button type="button" className="btn-start" onClick={handleStart}>
            START
          </button>
        </div>
      </div>

      {/* Overlay branco */}
      <div className={`fade-overlay ${fade ? "active" : ""}`} aria-hidden="true"></div>
    </main>
  );
}

export default Start;

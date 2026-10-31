import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import flag from "../assets/images/scroll.webp";
import prologue from "../assets/videos/Prologue.mp4";
import bgVideo from "../assets/videos/boromir.mp4";
import bgPoster from "../assets/images/posters/boromir.jpg";
import Button from "../components/buttons/Button";
import Modal from "../components/Modal";
import OptionProfile from "../components/layout/OptionProfile";
import AchievementsModal from "../components/AchievementsModal";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import { api } from "../services/api";
import { GAME_MODES, HOBBIT_UNLOCK_LEVEL, JOURNEYS, REGIONS } from "../config/regions";
import { clearStoredRound } from "../hooks/useGameSession";

const shireMusic = REGIONS[0].ambience;
// música de abertura de cada jornada
const JOURNEY_MUSIC = { main: shireMusic, hobbit: REGIONS[8].ambience };

function Profile() {
  const { user, logout } = useAuth();
  const { playMusic } = useAudio();
  const navigate = useNavigate();
  const modeTitleId = useId();

  const [fadeIn, setFadeIn] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [playTransitionVideo, setPlayTransitionVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [modal, setModal] = useState(null); // null | "edit" | "achievements" | "mode"
  const [currentRound, setCurrentRound] = useState(null);
  const [journey, setJourney] = useState("main");
  const level = user?.level ?? 0;
  const hobbitLocked = level < HOBBIT_UNLOCK_LEVEL;
  const pendingNav = useRef(null);
  const videoRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    setFadeIn(true);
    let alive = true;
    // Partida em andamento: oferece "Continuar"
    api
      .currentRound()
      .then((round) => alive && setCurrentRound(round))
      .catch(() => {});
    const list = timers.current;
    return () => {
      alive = false;
      list.forEach(clearTimeout);
    };
  }, []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const goToQuiz = () => {
    playMusic(JOURNEY_MUSIC[pendingNav.current?.journey] || shireMusic);
    navigate("/playquiz", { state: pendingNav.current });
  };

  // Novo jogo: escolhe o modo, escurece a tela e toca o prólogo
  const startNewGame = (mode) => {
    setModal(null);
    clearStoredRound();
    pendingNav.current = { mode, journey, resume: false };
    setFadeToBlack(true);
    playMusic(null);
    later(() => setPlayTransitionVideo(true), 3000);
  };

  const continueGame = () => {
    pendingNav.current = { resume: true };
    setFadeToBlack(true);
    later(goToQuiz, 1500);
  };

  const skipIntro = () => {
    setFadeOut(true);
    playMusic(JOURNEY_MUSIC[pendingNav.current?.journey] || shireMusic);
    later(() => {
      videoRef.current?.pause();
      goToQuiz();
    }, 1500);
  };

  // A música do Condado começa 15 s antes de o prólogo acabar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration && video.duration - video.currentTime <= 15) {
        playMusic(JOURNEY_MUSIC[pendingNav.current?.journey] || shireMusic);
        video.removeEventListener("timeupdate", onTime);
      }
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [playTransitionVideo, playMusic]);

  const handleSair = () => {
    clearStoredRound();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-black-profile">
      <div className={`body-container-profile ${fadeIn ? "fade-in-profile" : ""}`}>
        <main className="profile-container">
          <div className="flag-profile">
            <img className="flagg" src={flag} alt="" />
            <div className="profile-content">
            {/* a foto só é trocada no Editar Perfil */}
            <div className="profile-avatar">
              <Avatar persona={user?.avatar} name={user?.name} />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user?.name}</h1>
              {/* nível do viajante = conquistas desbloqueadas */}
              <p className="profile-level">Nível do viajante: {level}</p>
              <p className="profile-best">Melhor pontuação: {user?.bestScore ?? 0}</p>
            </div>
            <nav className="btn-box" aria-label="Opções do jogador">
              {currentRound && (
                <Button onClick={continueGame}>Continuar</Button>
              )}
              <Button onClick={() => setModal("mode")}>Novo Jogo</Button>
              <Button onClick={() => setModal("achievements")}>Conquistas</Button>
              <Button onClick={() => setModal("edit")}>Editar Perfil</Button>
              <Button onClick={handleSair}>Sair</Button>
            </nav>
            </div>
          </div>
        </main>

        <OptionProfile isOpen={modal === "edit"} onClose={() => setModal(null)} />
        <AchievementsModal isOpen={modal === "achievements"} onClose={() => setModal(null)} />

        <Modal isOpen={modal === "mode"} onClose={() => setModal(null)} labelledBy={modeTitleId} className="mode-modal">
          <h2 id={modeTitleId}>Escolha sua jornada</h2>
          {currentRound && <p className="mode-warning">Começar de novo encerra a partida em andamento.</p>}
          <div className="journey-options" role="radiogroup" aria-label="Jornada">
            {Object.entries(JOURNEYS).map(([key, j]) => {
              const locked = key === "hobbit" && hobbitLocked;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={journey === key}
                  disabled={locked}
                  className={`journey-option ${journey === key ? "selected" : ""}`}
                  onClick={() => setJourney(key)}
                >
                  <span className="mode-option-title">{j.label}</span>
                  <span className="mode-option-desc">{locked ? `🔒 Abre no nível ${HOBBIT_UNLOCK_LEVEL} do viajante (você está no ${level}).` : j.description}</span>
                </button>
              );
            })}
          </div>
          <div className="mode-options">
            {Object.entries(GAME_MODES).map(([key, m]) => (
              <button key={key} type="button" className="mode-option" onClick={() => startNewGame(key)}>
                <span className="mode-option-title">{m.label}</span>
                <span className="mode-option-desc">{m.description}</span>
              </button>
            ))}
          </div>
          <Button variant="plain" onClick={() => setModal(null)}>
            Voltar
          </Button>
        </Modal>

        <div className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`} aria-hidden="true"></div>

        {/* Vídeo de transição (prólogo) */}
        {playTransitionVideo && (
          <video
            ref={videoRef}
            onPlay={() => setShowSkip(true)}
            className={`transition-video ${fadeOut ? "fade-out-profile" : ""}`}
            autoPlay
            playsInline
            onEnded={goToQuiz}
            onError={goToQuiz}
          >
            <source src={prologue} type="video/mp4" />
          </video>
        )}

        {showSkip && (
          <div className={`pular-intro ${fadeOut ? "fade-out-profile" : ""}`}>
            <Button variant="plain" onClick={skipIntro}>
              Pular intro
            </Button>
          </div>
        )}

        <video className="bg-video-profile" autoPlay muted loop playsInline poster={bgPoster} aria-hidden="true">
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default Profile;

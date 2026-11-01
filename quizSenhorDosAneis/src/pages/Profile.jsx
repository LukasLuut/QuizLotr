import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import flag from "../assets/images/scroll.webp";
import prologue from "../assets/videos/Prologue.mp4";
import bgVideo from "../assets/videos/boromir.mp4";
import bgPoster from "../assets/images/posters/boromir.jpg";
import Button from "../components/buttons/Button";
import BtnQuestion from "../components/buttons/BtnQuestion";
import PersonaGrid from "../components/PersonaGrid";
import Modal from "../components/Modal";
import OptionProfile from "../components/layout/OptionProfile";
import AchievementsModal from "../components/AchievementsModal";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import { api } from "../services/api";
import { GAME_MODES, HOBBIT_UNLOCK_LEVEL, JOURNEYS, REGIONS } from "../config/regions";
import { clearStoredRound } from "../hooks/useGameSession";
import { JOURNEY_DEFAULT_PERSONA, isUnlocked, personaAt, personasOf } from "../config/personas";
import { IS_DEMO } from "../config/demo";
import { demoSettings } from "@demo";

const shireMusic = REGIONS[0].ambience;
// música de abertura de cada jornada
const JOURNEY_MUSIC = { main: shireMusic, hobbit: REGIONS[11].ambience };

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
  const [modal, setModal] = useState(null); // null | "edit" | "achievements" | "mode" | "persona"
  const [currentRound, setCurrentRound] = useState(null);
  const [journey, setJourney] = useState("main");
  const [chosenMode, setChosenMode] = useState(null); // modo escolhido, à espera do personagem
  const [pickedPersona, setPickedPersona] = useState(null); // personagem marcado (Confirmar começa)
  const [dialFor, setDialFor] = useState(null); // habilidades abertas ao lado da foto
  const [short, setShort] = useState(() => IS_DEMO && demoSettings.short); // demo: partida curta
  const personaTitleId = useId();
  const level = user?.level ?? 0;
  const hobbitLocked = level < HOBBIT_UNLOCK_LEVEL;
  const profilePersona = personaAt(user?.avatar);
  const suggestedPersona =
    profilePersona.journey === journey && isUnlocked(profilePersona, level) ? profilePersona.code : JOURNEY_DEFAULT_PERSONA[journey];
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

  // Novo jogo: jornada e modo → personagem da jornada → escurece a tela e toca o prólogo
  const chooseMode = (mode) => {
    setChosenMode(mode);
    setPickedPersona(suggestedPersona);
    setDialFor(null);
    setModal("persona");
  };

  // habilidades abertas: clicar fora do personagem recolhe
  useEffect(() => {
    if (!dialFor) return;
    const onDown = (e) => {
      if (!e.target.closest(".persona-option.dial-shown")) setDialFor(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [dialFor]);

  // clicar marca o personagem e abre as habilidades; clicar de novo nele recolhe
  const pickPersona = (code) => {
    if (code === pickedPersona) setDialFor((open) => (open ? null : code));
    else {
      setPickedPersona(code);
      setDialFor(code);
    }
  };

  const startNewGame = (persona) => {
    setModal(null);
    clearStoredRound();
    pendingNav.current = { mode: chosenMode, journey, persona, resume: false };
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
    // demo: recomeça do zero e volta para a tela inicial
    navigate(IS_DEMO ? "/" : "/login", { replace: true });
  };

  const toggleShort = (e) => {
    demoSettings.short = e.target.checked;
    setShort(e.target.checked);
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
              {/* título escolhido entre as conquistas (Editar Perfil) */}
              {user?.title && <p className="profile-title">{user.title}</p>}
              {/* nível do viajante = conquistas desbloqueadas */}
              {!IS_DEMO && <p className="profile-level">Nível: {level}</p>}
            </div>
            <nav className="btn-box" aria-label="Opções do jogador">
              {currentRound && (
                <Button onClick={continueGame}>Continuar</Button>
              )}
              <Button onClick={() => setModal("mode")}>Novo Jogo</Button>
              <Button onClick={() => setModal("achievements")}>Conquistas</Button>
              <Button onClick={() => setModal("edit")}>Editar Perfil</Button>
              <Button onClick={handleSair}>{IS_DEMO ? "Recomeçar" : "Sair"}</Button>
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
                  className={`mode-option journey-option ${journey === key ? "selected" : ""}`}
                  onClick={() => setJourney(key)}
                >
                  <span className="mode-option-title">{j.label}</span>
                  <span className="mode-option-desc">{locked ? `🔒 Abre no nível ${HOBBIT_UNLOCK_LEVEL} do viajante (você está no ${level}).` : j.description}</span>
                </button>
              );
            })}
          </div>
          {/* modo de jogo: mesmo botão das alternativas do quiz; a descrição fica embaixo */}
          <div className="mode-options">
            {Object.entries(GAME_MODES).map(([key, m]) => (
              <div key={key} className="mode-choice">
                <BtnQuestion texto={m.label} onClick={() => chooseMode(key)} aria-describedby={`${modeTitleId}-${key}`} />
                <p id={`${modeTitleId}-${key}`} className="mode-option-desc">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
          {IS_DEMO && (
            <label className="demo-short">
              <input type="checkbox" checked={short} onChange={toggleShort} />
              Partida curta: 2 perguntas por região
            </label>
          )}
          <Button className="mode-back" onClick={() => setModal(null)}>
            Voltar
          </Button>
        </Modal>

        {/* Personagem da partida: só os da jornada escolhida */}
        <Modal isOpen={modal === "persona"} onClose={() => setModal("mode")} labelledBy={personaTitleId} className="persona-modal">
          <h2 id={personaTitleId}>Escolha seu personagem</h2>
          <p className="persona-hint">
            {JOURNEYS[journey]?.label} · {GAME_MODES[chosenMode]?.label}. {IS_DEMO ? "Cada" : `Nível do viajante ${level}: cada`} personagem traz duas habilidades.
          </p>
          <PersonaGrid
            personas={personasOf(journey)}
            level={level}
            selected={pickedPersona}
            onPick={pickPersona}
            dialFor={dialFor}
            labelledBy={personaTitleId}
          />
          <div className="persona-actions">
            <Button className="mode-back" onClick={() => setModal("mode")}>
              Voltar
            </Button>
            <Button className="mode-back" onClick={() => startNewGame(pickedPersona)} disabled={!pickedPersona}>
              Confirmar
            </Button>
          </div>
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

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PlayQuiz.css";
import BoxWoodenR from "../assets/images/box/box-aviso-gg.webp";
import VideoTransition from "../components/videoTransition/VideoTransition";
import Menu from "../components/layout/Menu";
import QuizContainer from "../components/layout/QuizContainer";
import Sidebar from "../components/layout/Sidebar";
import Ranking from "../components/layout/Ranking";
import Final from "../components/layout/Final";
import Narrator from "../components/narrador/Narrador";
import Archivement from "../components/Archivement";
import Button from "../components/buttons/Button";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import { clearStoredRound, useGameSession } from "../hooks/useGameSession";
import { regionAt } from "../config/regions";

const isTyping = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { playMusic, playSfx } = useAudio();
  const { mode = "normal", resume = false } = location.state || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const game = useGameSession({ mode, resume, paused: menuOpen });
  const { state } = game;
  const { phase, round, region, result } = state;

  const [peek, setPeek] = useState(false); // esconde a UI para ver a paisagem
  const peekTimer = useRef(null);

  // Ambiência da região atual
  useEffect(() => {
    if (round) playMusic(regionAt(region).ambience);
  }, [region, round, playMusic]);

  // Som de acerto/erro quando o servidor responde
  useEffect(() => {
    if (phase === "feedback" && result) playSfx(result.isCorrect ? "correct" : "wrong", { volume: 0.7, offset: 0.03 });
    if (phase === "travelling") playSfx("whoosh", { volume: 0.5 });
  }, [phase, result, playSfx]);

  // Fim de partida: atualiza a melhor pontuação do jogador
  useEffect(() => {
    if (phase === "finished") {
      clearStoredRound();
      refreshUser().catch(() => {});
    }
  }, [phase, refreshUser]);

  useEffect(() => () => clearTimeout(peekTimer.current), []);

  // Teclado: Esc abre/fecha o menu; 1-4 escolhem a alternativa
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(document.activeElement)) return;
      if (e.key === "Escape" && phase !== "finished") {
        setMenuOpen((open) => !open);
        return;
      }
      if (!menuOpen && phase === "answering" && /^[1-4]$/.test(e.key)) {
        const option = state.question?.question?.answers[Number(e.key) - 1];
        if (option) game.answer(option.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, menuOpen, state.question, game]);

  const handlePeek = () => {
    setPeek(true);
    clearTimeout(peekTimer.current);
    peekTimer.current = setTimeout(() => setPeek(false), 3500);
  };

  const handleRestart = useCallback(() => {
    setMenuOpen(false);
    game.restart();
  }, [game]);

  const goProfile = useCallback(() => {
    playMusic(null);
    navigate("/profile");
  }, [navigate, playMusic]);

  if (phase === "loading") return <LoadingScreen message="Preparando a jornada..." />;

  if (phase === "error") {
    return (
      <div className="loading-screen" role="alert">
        <p>{state.error}</p>
        <div className="error-actions">
          <Button onClick={game.retry}>Tentar de novo</Button>
          <Button onClick={goProfile}>Voltar ao perfil</Button>
        </div>
      </div>
    );
  }

  const inScene = phase === "scene";
  const uiHidden = inScene || peek;

  return (
    <div className="bg-black-quiz">
      {/* Título da região (narrador) */}
      {inScene && (
        <div className="title-scene">
          <Narrator text={regionAt(region).title} active />
        </div>
      )}

      <button type="button" className={`toggle-overlay-btn ${uiHidden ? "hidden-ui" : "visible-ui"}`} onClick={handlePeek} disabled={uiHidden}>
        <span aria-hidden="true">👁</span> Ver paisagem
      </button>

      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRestart={handleRestart}
        onLeave={goProfile}
      />

      <div className={`quiz-page ${uiHidden ? "hidden-ui" : "visible-ui"}`} aria-hidden={uiHidden}>
        <div className="box-lateral">
          <Sidebar
            player={user}
            round={round}
            region={region}
            lastCorrect={result ? result.isCorrect : null}
            timerRunning={!menuOpen && phase !== "finished"}
          />
        </div>

        <div className="box-question-center">
          <QuizContainer game={state} paused={menuOpen} onAnswer={game.answer} onTimeout={game.timeout} onAdvance={game.startTravel} onArrive={game.arrived} />
        </div>

        <div className="box-lateral-r">
          <img className="box-lateral-img" src={BoxWoodenR} alt="" />
          <Ranking mode={round?.mode} currentUserId={user?.id} refreshKey={phase === "finished" ? round?.id : 0} />
        </div>
      </div>

      <div className="bg-video2-play-quiz">
        <VideoTransition index={region} fadeDuration={1500} />
      </div>

      <Archivement queue={state.achievements} onShown={game.achievementShown} />

      {phase === "finished" && state.summary && <Final summary={state.summary} onRestart={handleRestart} onProfile={goProfile} />}
    </div>
  );
}

export default PlayQuiz;

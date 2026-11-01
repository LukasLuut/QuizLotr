import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PlayQuiz.css";
import VideoTransition from "../components/videoTransition/VideoTransition";
import corruptionVideo from "../assets/videos/overlay-corruption.mp4";
import Menu from "../components/layout/Menu";
import QuizContainer from "../components/layout/QuizContainer";
import Sidebar from "../components/layout/Sidebar";
import ToolsPanel from "../components/layout/ToolsPanel";
import Final from "../components/layout/Final";
import Narrator from "../components/narrador/Narrador";
import Archivement from "../components/Archivement";
import Button from "../components/buttons/Button";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import { clearStoredRound, useGameSession } from "../hooks/useGameSession";
import { regionAt } from "../config/regions";
import { pickIntro, pickLine } from "../config/lines";

const isTyping = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { playMusic, playSfx } = useAudio();
  const { mode = "normal", journey = "main", persona: chosenPersona, resume = false } = location.state || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const game = useGameSession({ mode, journey, persona: chosenPersona, resume, paused: menuOpen });
  const { state } = game;
  const { phase, round, region, result } = state;

  // "Ver paisagem": esconde a UI e mostra o nome do lugar (null | "title" | "fading")
  const [peek, setPeek] = useState(null);
  const peekTimers = useRef([]);
  // Resultado da última resposta (mensagem da caixa da partida): só muda na próxima resposta
  const [outcome, setOutcome] = useState(null);
  const roundId = round?.id;

  // fala do personagem: sorteada a cada resposta, sem repetir nenhuma já dita na partida
  const lastLine = useRef(null);
  const usedLines = useRef(new Set());
  const persona = round?.persona;
  // fala de abertura: uma por partida, até a primeira resposta
  const introLine = useMemo(() => (roundId ? pickIntro(persona) : null), [roundId, persona]);

  // partida nova: nenhuma fala dita ainda
  useEffect(() => {
    usedLines.current = new Set();
    lastLine.current = null;
  }, [roundId]);

  useEffect(() => {
    if (phase === "feedback" && result) {
      const line = result.skipped ? null : pickLine(persona, result, usedLines.current, lastLine.current);
      if (line) {
        lastLine.current = line;
        usedLines.current.add(line);
      }
      setOutcome({
        isCorrect: result.isCorrect,
        timeExpired: result.timeExpired,
        skipped: result.skipped,
        shielded: result.shielded,
        streak: result.streak,
        answered: result.answered,
        points: result.points,
        explanation: result.explanation,
        line,
      });
    }
  }, [phase, result, persona]);

  // Partida nova (Reiniciar / Jogar novamente) começa sem mensagem
  useEffect(() => {
    setOutcome(null);
  }, [roundId]);

  // Ambiência: na viagem, a música do destino já começa a entrar (fade antes da chegada)
  const musicRegion = phase === "travelling" && state.targetRegion !== null ? state.targetRegion : region;
  useEffect(() => {
    if (round) playMusic(regionAt(musicRegion).ambience);
  }, [musicRegion, round, playMusic]);

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

  useEffect(() => () => peekTimers.current.forEach(clearTimeout), []);

  // Teclado: Espaço abre/fecha o menu de pausa; 1-4 escolhem a alternativa
  useEffect(() => {
    const onKey = (e) => {
      if (isTyping(document.activeElement)) return;
      if (e.code === "Space" && phase !== "finished") {
        // com outro quadro aberto por cima (ex.: confirmação de Reiniciar), o Espaço não faz nada:
        // nem fecha o menu, nem aperta o botão em foco (evita reiniciar sem querer)
        const dialog = e.target.closest?.('[role="dialog"]');
        if (dialog && !dialog.classList.contains("box-menu-dialog")) {
          e.preventDefault();
          return;
        }
        e.preventDefault(); // não aciona o botão em foco
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

  // Mesma sequência da versão original: some a UI, o nome do lugar aparece letra a letra,
  // desaparece e a UI volta
  const handlePeek = () => {
    peekTimers.current.forEach(clearTimeout);
    setPeek("hidden");
    peekTimers.current = [
      setTimeout(() => setPeek("title"), 600),
      setTimeout(() => setPeek("fading"), 2100),
      setTimeout(() => setPeek(null), 2800),
    ];
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
  // no fim, o quadro some e o botão "Destruir o Anel" fica sozinho sobre o vídeo
  const uiHidden = inScene || !!peek || phase === "finished";
  const showTitle = inScene || peek === "title" || peek === "fading";
  // Overlay do Anel: invisível até 40% de corrupção, sobe até opacidade total aos 90%
  const corruptionPct = round?.corruption ?? 0;
  const overlayOpacity = Math.min(1, Math.max(0, (corruptionPct - 40) / 50));

  return (
    <div className="bg-black-quiz">
      {/* Título da região (narrador) */}
      {showTitle && (
        <div className="title-scene">
          <Narrator text={regionAt(region).title} active={peek !== "fading"} />
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
            outcome={outcome}
            introLine={introLine}
            timerRunning={!menuOpen && phase !== "finished"}
          />
        </div>

        <div className="box-question-center">
          <QuizContainer
            game={state}
            paused={menuOpen}
            onAnswer={game.answer}
            onTimeout={game.timeout}
            onAdvance={game.startTravel}
            onArrive={game.arrived}
          />
        </div>

        {/* Anel, ajudas, sequência e recorde (no lugar do Hall dos Heróis) */}
        <div className="box-lateral-r">
          <ToolsPanel
            round={round}
            player={user}
            locked={phase !== "answering" || menuOpen || state.helpBusy}
            ringArmed={state.ringArmed}
            onToggleRing={game.toggleRing}
            onHelp={game.requestHelp}
          />
        </div>
      </div>

      <div className="bg-video2-play-quiz">
        <VideoTransition index={region} fadeDuration={1500} />
      </div>


      <Archivement queue={state.achievements} onShown={game.achievementShown} />

      {/* Overlay da corrupção, na frente de tudo (menos o menu de pausa). Só existe
          acima de 40%, para não gastar decodificando vídeo invisível */}
      {corruptionPct > 40 && (
        <video
          className="corruption-overlay"
          src={corruptionVideo}
          style={{ opacity: overlayOpacity }}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}

      {phase === "finished" && state.summary && <Final summary={state.summary} onRestart={handleRestart} onProfile={goProfile} />}
    </div>
  );
}

export default PlayQuiz;

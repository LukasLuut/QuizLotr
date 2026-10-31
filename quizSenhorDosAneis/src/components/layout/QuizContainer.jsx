import "./QuizContainer.css";
import boxQuestion from "../../assets/images/box-question.webp";
import BtnQuestion from "../buttons/BtnQuestion";
import Map from "../Map";
import QuestionTimer from "./QuestionTimer";
import { regionAt } from "../../config/regions";
import { HELPS, helpsLeft } from "../../config/helps";
import ringIcon from "../../assets/images/circleOneRing.webp";

const SHOWS_QUESTION = new Set(["answering", "submitting", "feedback"]);

// Estado visual de cada alternativa, a partir do que o servidor respondeu
function answerStatus(answerId, { phase, selectedId, result }) {
  if (phase === "submitting") return answerId === selectedId ? "selected" : "default";
  if (phase !== "feedback" || !result) return "default";
  if (answerId === result.correctAnswerId) return "correct";
  if (answerId === selectedId) return "wrong";
  return "default";
}

/**
 * Quadro central: mapa da jornada, pergunta e alternativas.
 * Não guarda estado do jogo; tudo vem do useGameSession.
 */
function QuizContainer({ game, paused = false, onAnswer, onTimeout, onAdvance, onArrive, onDebugSkip, onHelp, onToggleRing }) {
  const { phase, question, region, targetRegion, fresh, round, ringArmed, assist, helpBusy } = game;
  const payload = question?.question;
  const showQuestion = SHOWS_QUESTION.has(phase) && payload;
  const locked = phase !== "answering";
  const toolsLocked = locked || paused || helpBusy;
  const left = helpsLeft(round);
  const eliminated = new Set(assist?.eliminated || []);
  const vision = Object.fromEntries((assist?.palantir || []).map((p) => [p.answerId, p.percent]));

  return (
    <section className="quiz-container" aria-labelledby="quiz-title">
      <img className="box-question" src={boxQuestion} alt="" />
      <h1 id="quiz-title" className="title-responda">
        RespondA
      </h1>

      {/* Mapa da jornada */}
      <div className={`quiz-image ${showQuestion ? "" : "quiz-image--full"}`}>
        <Map
          region={region}
          targetRegion={targetRegion}
          travelling={phase === "travelling"}
          showAdvance={phase === "travel-ready"}
          intro={fresh}
          onAdvance={onAdvance}
          onArrive={onArrive}
        />
      </div>

      <div className={`quiz-body ${showQuestion ? "" : "quiz-body--compact"}`}>
        {phase === "question-loading" && <p className="quiz-status">Consultando os sábios...</p>}
        {phase === "travel-ready" && (
          <p className="quiz-status">
            Região concluída! Avance para {regionAt(targetRegion).name}.
          </p>
        )}
        {phase === "travelling" && <p className="quiz-status">A Sociedade segue viagem...</p>}

        {showQuestion && (
          <>
            <div className="quiz-question-row">
              {/* Moria: a pergunta surge do escuro */}
              <h2 className={`quiz-question ${region === 3 ? "quiz-question--dark" : ""}`} key={payload.id} id="pergunta-atual">
                {payload.question}
              </h2>
              {question.timeLimitSeconds && (
                <QuestionTimer
                  key={payload.id}
                  seconds={question.remainingSeconds ?? question.timeLimitSeconds}
                  running={phase === "answering" && !paused}
                  onExpire={onTimeout}
                />
              )}
            </div>

            {/* O Peso do Anel e as ajudas temáticas */}
            <div className="quiz-tools" role="toolbar" aria-label="Anel e ajudas">
              <button
                type="button"
                className={`ring-toggle ${ringArmed ? "armed" : ""}`}
                aria-pressed={ringArmed}
                disabled={toolsLocked}
                onClick={onToggleRing}
                title="O Peso do Anel: a próxima resposta vale o dobro, mas o Anel corrompe."
              >
                <img src={ringIcon} alt="" />
                <span>{ringArmed ? "Anel no dedo" : "Usar o Anel"}</span>
              </button>
              <div className="help-buttons">
                {HELPS.map((h) => (
                  <button
                    key={h.code}
                    type="button"
                    className="help-btn"
                    disabled={toolsLocked || left[h.code] <= 0}
                    onClick={() => onHelp?.(h.code)}
                    aria-label={`${h.name}: ${h.description} (${Math.max(0, left[h.code])} restante)`}
                    title={`${h.name}: ${h.description}`}
                  >
                    <span aria-hidden="true">{h.icon}</span>
                    {left[h.code] > 1 && <span className="help-count" aria-hidden="true">{left[h.code]}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-options" role="group" aria-labelledby="pergunta-atual">
              {payload.answers.map((a, i) => {
                const status = answerStatus(a.id, game);
                const out = eliminated.has(a.id) && status === "default";
                return (
                  <BtnQuestion
                    key={`${payload.id}-${a.id}`}
                    texto={a.answer}
                    status={status}
                    disabled={locked || out}
                    badge={a.id in vision ? `${vision[a.id]}%` : null}
                    className={out ? "eliminated" : phase === "feedback" && status === "default" ? "dim" : ""}
                    onClick={() => onAnswer(a.id)}
                    aria-keyshortcuts={String(i + 1)}
                  />
                );
              })}
            </div>

            {/* SÓ PARA TESTES: aparece apenas no npm run dev, não vai para o build de produção */}
            {import.meta.env.DEV && onDebugSkip && phase === "answering" && (
              <button type="button" className="debug-skip" onClick={onDebugSkip}>
                Avançar (teste)
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default QuizContainer;

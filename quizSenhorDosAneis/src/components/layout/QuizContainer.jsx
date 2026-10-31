import "./QuizContainer.css";
import boxQuestion from "../../assets/images/box-question.webp";
import BtnQuestion from "../buttons/BtnQuestion";
import Map from "../Map";
import QuestionTimer from "./QuestionTimer";
import { regionAt } from "../../config/regions";

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
function QuizContainer({ game, paused = false, onAnswer, onTimeout, onAdvance, onArrive }) {
  const { phase, question, result, region, targetRegion, fresh } = game;
  const payload = question?.question;
  const showQuestion = SHOWS_QUESTION.has(phase) && payload;
  const locked = phase !== "answering";

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
              <h2 className="quiz-question" id="pergunta-atual">
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

            <div className="quiz-options" role="group" aria-labelledby="pergunta-atual">
              {payload.answers.map((a, i) => {
                const status = answerStatus(a.id, game);
                return (
                  <BtnQuestion
                    key={`${payload.id}-${a.id}`}
                    texto={a.answer}
                    status={status}
                    disabled={locked}
                    className={phase === "feedback" && status === "default" ? "dim" : ""}
                    onClick={() => onAnswer(a.id)}
                    aria-keyshortcuts={String(i + 1)}
                  />
                );
              })}
            </div>

            <div className="quiz-feedback" aria-live="polite">
              {phase === "feedback" && result && (
                <p className={result.isCorrect ? "feedback-correct" : "feedback-wrong"}>
                  <strong>
                    {result.timeExpired && !result.isCorrect
                      ? "Tempo esgotado!"
                      : result.isCorrect
                        ? `Correto! +${result.points}`
                        : "Não foi dessa vez."}
                  </strong>{" "}
                  {result.explanation}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default QuizContainer;

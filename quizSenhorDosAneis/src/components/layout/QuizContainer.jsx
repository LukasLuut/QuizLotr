import "./QuizContainer.css";
import boxQuestion from "../../assets/images/box-question.webp";
import BtnQuestion from "../buttons/BtnQuestion";
import Map from "../Map";
import QuestionTimer from "./QuestionTimer";
import { regionAt } from "../../config/regions";

// "question-loading" também mostra a pergunta (a anterior, travada, até a próxima chegar):
// sem isso o quadro sumia e o mapa expandia por um instante entre as perguntas (piscada)
const SHOWS_QUESTION = new Set(["answering", "submitting", "feedback", "question-loading"]);
const SHOWS_RESULT = new Set(["feedback", "question-loading"]);

// Estado visual de cada alternativa, a partir do que o servidor respondeu
function answerStatus(answerId, { phase, selectedId, result }) {
  if (phase === "submitting") return answerId === selectedId ? "selected" : "default";
  if (!SHOWS_RESULT.has(phase) || !result) return "default";
  if (answerId === result.correctAnswerId) return "correct";
  if (answerId === selectedId) return "wrong";
  return "default";
}

/**
 * Quadro central: mapa da jornada, pergunta e alternativas.
 * Não guarda estado do jogo; tudo vem do useGameSession.
 */
function QuizContainer({ game, paused = false, onAnswer, onTimeout, onAdvance, onArrive }) {
  const { phase, question, region, targetRegion, fresh, assist } = game;
  const payload = question?.question;
  const showQuestion = SHOWS_QUESTION.has(phase) && payload;
  const locked = phase !== "answering";
  const eliminated = new Set(assist?.eliminated || []);
  const placeName = regionAt(phase === "travelling" && targetRegion !== null ? targetRegion : region).name;
  const vision = Object.fromEntries((assist?.palantir || []).map((p) => [p.answerId, p.percent]));

  return (
    <section className="quiz-container" aria-labelledby="quiz-title">
      <img className="box-question" src={boxQuestion} alt="" />
      {/* nome do lugar atual na plaqueta do topo (durante a viagem, o destino) */}
      <h1 id="quiz-title" className={`title-responda ${placeName.length > 14 ? "title-long" : ""}`}>
        {placeName}
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
        {phase === "question-loading" && !showQuestion && <p className="quiz-status">Consultando os sábios...</p>}
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
                    className={out ? "eliminated" : SHOWS_RESULT.has(phase) && status === "default" ? "dim" : ""}
                    onClick={() => onAnswer(a.id)}
                    aria-keyshortcuts={String(i + 1)}
                  />
                );
              })}
            </div>

          </>
        )}
      </div>
    </section>
  );
}

export default QuizContainer;

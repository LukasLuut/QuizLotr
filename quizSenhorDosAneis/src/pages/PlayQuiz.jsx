import "./PlayQuiz.css";
import exampleImg from "../assets/images/rivendell.webp";

function Quiz() {
  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Imagem ilustrativa */}
        <div className="quiz-image">
          <img src={exampleImg} alt="Cenário da Terra-média" />
        </div>

        {/* Pergunta */}
        <h2 className="quiz-question">
          Quem foi o portador do Um Anel até o Monte da Perdição?
        </h2>

        {/* Opções */}
        <div className="quiz-options">
          <button className="option">Frodo Bolseiro</button>
          <button className="option">Aragorn</button>
          <button className="option">Gandalf</button>
          <button className="option">Samwise Gamgee</button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
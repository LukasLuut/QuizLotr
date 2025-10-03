import React, { useEffect, useState } from "react";
import "./QuizContainer.css";
import boxQuestion from "../../assets/images/box-question.png";
import BtnQuestion from "../buttons/btnQuestion";
import Map from "../Map";
import Final from "./Final";


function QuizContainer({ handleUpdateScore, isMovingChange, isStartedChange, handleSetRound, time, score, data}) {
  const w = "360px";
  const h = "100px";
  const [question, setQuestion] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [scoreToSave, setScoreToSave] = useState(0);
  const [timeToSave, setTimeToSave] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:3000/questions/${question}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setQuestions(data))
        .catch((err) => console.error("Erro:", err));
    };
    fetchData();
  }, [question]);

 
  let pergunta = questions.question;
  let opcao1, opcao2, opcao3, opcao4, opcao1R, opcao2R, opcao3R, opcao4R;

  if (questions.answers && questions.answers.length > 0) {
    opcao1 = questions.answers[0].answer;
    opcao2 = questions.answers[1]?.answer; // Usando o optional chaining (?.) para evitar erro se answers[1] não existir
    opcao3 = questions.answers[2]?.answer;
    opcao4 = questions.answers[3]?.answer;
    
    opcao1R = questions.answers[0].correct;
    opcao2R = questions.answers[1]?.correct; // Usando o optional chaining (?.) para evitar erro se answers[1] não existir
    opcao3R = questions.answers[2]?.correct;
    opcao4R = questions.answers[3]?.correct;
  }

  function handleAnswer(isCorrect) {
    console.log("Resposta correta?", isCorrect);

    // Avança para a próxima pergunta depois de 1s
    setTimeout(() => {
      setQuestion(question + 1);

      if (isCorrect) {
        handleUpdateScore(1000);
      } else {
        handleUpdateScore(300);
      }
    }, 500);
  }
    
  const [ativo,setAtivo]= useState(false)
  const [perguntaAtivo,setPerguntaAtivo]=useState(true)
  
  //pega o status true ou false  
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
  setIsMoving(status);
  isMovingChange(status);  
};

// ativa de 2 em 2 perguntas
useEffect(() => {
  if (question > 0 && question % 1 === 0) {
    setAtivo(true);        
    setPerguntaAtivo(true);
  }
}, [question]);

// desativa quando o bonequinho para
useEffect(() => {
  if (!isMoving)
  setTimeout(() => {
    if (isFinished) {
      setAtivo(false);        
      setPerguntaAtivo(true);
    }else{  //tempo para que as respostas não apareçam até o vídeo de transição
      setPerguntaAtivo(false);
      setAtivo(false);
    }
    
    }, 2000); 
   
}, [isMoving]);


//variável que muda o status quando o boneco inicia caminhada
const[isStarted,setIsStarted]=useState(false)
const handleStarted=(status)=>{
  setIsStarted(status);
  isStartedChange(status);
}

//variável que recebe o valor true quando o personagem chega no ultimo mapa
 const [isFinished, setIsFinished] = useState(false);

const handleFinish = (status) => {
  setIsFinished(status);
  console.log("Mapa terminou todas as rotas?", status);
};

//efeito que inicia finalização do jogo
useEffect(() => {
  if (isFinished) {
    const currentScore = handleSetRound();
    setTimeToSave(time)
    setScoreToSave(currentScore)
    handleUpdateScore(-999, true);
    setAtivo(false);        
    setPerguntaAtivo(true);
  }
}, [isFinished]);
  

// No JSX


  return (
    <div>
      <div className="quiz-container">
        <h1 className="title-responda">RespondA</h1>
        <img className="box-question" src={boxQuestion} alt="" />
        {/* Imagem do mapa */}
        <div className="quiz-image">
          <Map ativo={ativo} onMoving={handleMoving} onFinish={handleFinish} onStart={handleStarted} />
        </div>
        {/* Pergunta */}
        <h2 className={`quiz-question ${perguntaAtivo ? "pergunta-off" : ""}`}>
          {pergunta}
        </h2>

        {/* Opções */}
        <div className={`quiz-options ${perguntaAtivo ? "pergunta-off" : ""}`}>
          <BtnQuestion
            w={w}
            h={h}
            texto={opcao1}
            onClick={(isCorrect) => handleAnswer(isCorrect)}
            resposta={opcao1R}
          />
          <BtnQuestion
            w={w}
            h={h}
            texto={opcao2}
            onClick={(isCorrect) => handleAnswer(isCorrect)}
            resposta={opcao2R}
          />
          <BtnQuestion
            w={w}
            h={h}
            texto={opcao3}
            onClick={(isCorrect) => handleAnswer(isCorrect)}
            resposta={opcao3R}
          />
          <BtnQuestion
            w={w}
            h={h}
            texto={opcao4}
            onClick={(isCorrect) => handleAnswer(isCorrect)}
            resposta={opcao4R}
          />
        </div>
      </div>
      {isFinished && <Final time={timeToSave} score={scoreToSave} data={data} setIsFinished={setIsFinished}/>}
    </div>
  );
}

export default QuizContainer;

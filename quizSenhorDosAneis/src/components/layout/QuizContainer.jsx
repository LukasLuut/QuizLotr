import React, { useEffect, useState } from "react";
import "./QuizContainer.css";
import exampleImg from "../../assets/images/rivendell.webp";
import boxQuestion from "../../assets/images/box-question.png";
import BtnQuestion from "../buttons/btnQuestion";
import Map from "../Map";
import Final from "./Final";
import Narrator from "../narrador/Narrador";

function QuizContainer({ handleUpdateUser, handleUpdateScore, isMovingChange }) {
  const w = "400px";
  const h = "90px";
  const [question, setQuestion] = useState(1);
  const [questions, setQuestions] = useState([]);

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

  // Verifique se 'questions' tem dados antes de tentar acessar a resposta
  let pergunta = questions.question;
  let opcao1, opcao2, opcao3, opcao4, opcao1R, opcao2R, opcao3R, opcao4R;

  if (questions.answers && questions.answers.length > 0) {
    opcao1 = questions.answers[0].answer;
    opcao2 = questions.answers[1]?.answer; // Usando o optional chaining (?.) para evitar erro se answers[1] não existir
    opcao3 = questions.answers[2]?.answer;
    opcao4 = questions.answers[3]?.answer;
    console.log(questions.answers[0].correct);
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
    }, 1000);
  }
    
  const [ativo,setAtivo]= useState(false)
  const [perguntaAtivo,setPerguntaAtivo]=useState(true)
  //pega o o status true ou false  
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
  setIsMoving(status);
  isMovingChange(status);
  console.log("Bonequinho está andando? no CONTAINER", status);
};

// ativa de 2 em 2 perguntas
useEffect(() => {
  if (question > 0 && question % 3 === 0) {
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
    }else{
      setPerguntaAtivo(false);
      setAtivo(false);
    }
    
    }, 2000); 
   
}, [isMoving]);

 const [isFinished, setIsFinished] = useState(false);

const handleFinish = (status) => {
  setIsFinished(status);
  console.log("Mapa terminou todas as rotas?", status);
};

useEffect(() => {
  if (isFinished) {
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
          <Map ativo={ativo} onMoving={handleMoving} onFinish={handleFinish} />
        </div>
          {/* <Narrator index={1} active={true} typingSpeed={90}></Narrator> */}
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
      {isFinished && <Final />}
    </div>
  );
}

export default QuizContainer;

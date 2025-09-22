import "./PlayQuiz.css";
import Map from '../components/Map'
import BoxMap from '../assets/images/map-box.png'
import MapBox from "../components/MapBox";
import bgShire from "../assets/videos/Hobbington.mp4";
import QuizContainer from "../components/layout/QuizContainer";
import React, { useEffect, useState } from "react";
import MovingCharacter from '../components/Map'
import Sidebar from '../components/layout/Sidebar'
import BoxWoodenR from '../assets/images/box/box-aviso-gg.png'



function Quiz({ setMusicaAtual }) {
  const [fadeIn, setFadeIn] = useState(false); // para o efeito de fadeIN quando a página abre
    /*Essas variáveis servem para o quadro lateral Sidebar*/
  const [playerName] = useState("Leandra");
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(1);
  const total = 10;
  const [questions, setQuestions] = useState([]);

  let questionNumber = 3;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetch(`http://localhost:3000/questions/${questionNumber}`, {
  //       method: "GET"
  //     })
  //       .then(res => res.json())
  //       .then(data => setQuestions(data))
  //       .catch(err => console.error("Erro:", err));
  //   }
  //   fetchData()
  // }, []);

  // // Verifique se 'questions' tem dados antes de tentar acessar a resposta
  // let pergunta = questions.question;
  // let opcao1, opcao2, opcao3, opcao4;


  // if (questions.answers && questions.answers.length > 0) {
  //   opcao1 = questions.answers[0].answer;
  //   opcao2 = questions.answers[1]?.answer; // Usando o optional chaining (?.) para evitar erro se answers[1] não existir
  //   opcao3 = questions.answers[2]?.answer;
  //   opcao4 = questions.answers[3]?.answer;
  // }
  
  
  // let teste = paths.bri

  const [caminho, setCaminho] = React.useState("mordor");

 
  useEffect(() => {
      if(1 > 0) setCaminho("bri")
  }, []);


  useEffect(() => {
        setFadeIn(true); // ativa fade in ao entrar
        
      }, []);

 

  return (
    <div className='bg-black-quiz'>
      <div className={`quiz-page ${fadeIn ? 'fade-in' : ''} `}>
        <div className='box-lateral'>
          {/* Quadro lateral */}
        <Sidebar
          playerName={playerName}
          score={score}
          current={current}
          total={total}
        />
        </div>
        <QuizContainer
          path={caminho}
          pergunta='{pergunta}'
          opcao1='{opcao1}  '
          opcao2='{opcao2}'
          opcao3='{opcao3}'
          opcao4='{opcao4}'
        ></QuizContainer>

        <div className='box-lateral-r '>
        <img className='box-lateral-img ' src={BoxWoodenR} alt="" />
          
          <div className="box-leaderboard">
            <h1>Hall dos heroiS</h1>
            <div className="leaderboard">
              <h1>Nome:</h1>
              <h1>Pontuação:</h1>
              {/*Aqui deve ir a implementação do Ranking*/}
              
            </div>
          
          </div>
        </div>
        

        <video className="bg-video2" autoPlay muted loop playsInline>
          <source src={bgShire} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default Quiz;

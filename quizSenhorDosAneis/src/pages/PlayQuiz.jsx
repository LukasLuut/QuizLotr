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
        <QuizContainer></QuizContainer>

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

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import VideoTransition from "../components/videoTransition/VideoTransition"; // importa o novo componente

import QuizContainer from "../components/layout/QuizContainer";
import Sidebar from "../components/layout/Sidebar";
import BoxWoodenR from "../assets/images/box/box-aviso-gg.png";

import bgShire from "../assets/videos/Hobbington.mp4";
import bgBri from "../assets/videos/bri.mp4";
import bgRivendel from "../assets/videos/lorien.mp4";
import bgLorien from "../assets/videos/lorien.mp4";
import bgMordor from "../assets/videos/mordor.mp4";
import bgMoria from "../assets/videos/moria.mp4";
import bgArgonath from "../assets/videos/argonath.mp4";

import "./PlayQuiz.css";
import Narrator from "../components/narrador/Narrador";

function Quiz({ setMusicaAtual }) {
  const location = useLocation();
  const data = location.state; // user info
  const token = localStorage.getItem("token");

  // --------------------------- Estados principais ---------------------------
  const [playerName] = useState(data.user.name);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(1);
  const total = 7;
  const [segundos, setSegundos] = useState(1);
  const videoRef = useRef();//deve controlar a mudança de background

  const videoBackgrounds = [
    bgShire,
    bgBri,
    bgRivendel,
    bgMoria,
    bgLorien,
    bgArgonath,
    bgMordor,
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  // Controle do botão de transparência da UI
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [titleFadeOut, setTitleFadeOut]=useState(true)
  const [overlayHovered, setOverlayHovered] = useState(false);
  const toggleOverlay = () => setOverlayVisible((prev) => !prev);

  const [fundoFrente, setFundoFrente] = useState(false);
  const [titleScene, setTitleScene] = useState(false)

  // Controle do bonequinho / isMoving vindo do QuizContainer
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
    setIsMoving(status);
    console.log("Bonequinho está andando?", status);
  };

//--------------------------Transição de áreas do mapa-------------------------------
  const handleFundo = () => {
    setFundoFrente(true);
    setTitleScene(true)
    setTitleFadeOut(true)

    //esse timer envia false para o narrador 
    //antes para gerar animação de fade-out
    setTimeout(() => {
        setTitleFadeOut(false);
       },2100)
    setTimeout(() => {
      setFundoFrente(false)
      setTitleScene(false)
    }, 2800)
  }

  
  //titulo da área aparece e desaparece depois de 3s
  const handleTitleScene = () => {
    setTitleScene(true)

    setTimeout(() => {
      setTitleScene(false)
    }, 3000)
  }

  // --------------------------- Ranking ---------------------------
  const handleRanking = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/ranking`);
      const rankingList = await res.json();

      const container = document.getElementById("listboard");
      container.innerHTML = "";

      rankingList.forEach((user) => {
        const div = document.createElement("div");
        div.className = "nameRanking";

        const nameUser = document.createElement("h1");
        const scoreUser = document.createElement("h1");

        nameUser.textContent = user.name;
        scoreUser.textContent = user.score;

        div.appendChild(nameUser);
        div.appendChild(scoreUser);
        container.appendChild(div);
      });
    } catch (err) {
      console.error("Erro:", err);
    }
  };
// --------------------------- Toca ao abrir a página ---------------------------
  useEffect(() => {
    
    
    handleRanking();
    //desliga a opacidade para aparecer o título primeiro
    setFadeIn(false);
    //roda o título
    handleFundo();
    //depois de 3s liga a opacidade para aparecer UI
    setTimeout(()=>{
      setFadeIn(true);
    },2900)
    
    videoRef.current.setBg(0)
    const interval = setInterval(handleRanking, 10000);
    return () => clearInterval(interval);
  }, []);

  setInterval(() => {
    handleRanking();
  }, 10000)

  
// ----------------------------------------------------------------------------------------
  const handleUpdateUser = () => { };

  const handleUpdateScore = async (score = 300) => {
    const scoreByTime = Math.round(score / segundos);

    try {
      const res = await fetch(`http://localhost:3000/users/me/score`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: data.user.id,
          score: scoreByTime,
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar pontuação");
      const resData = await res.json();
      setScore(resData.score);
      setCurrent((prev) => prev + 1);
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const handleGetHour = (timer) => setSegundos(timer);

  // --------------------------- Troca de vídeos ---------------------------
  useEffect(() => {
    if (!isMoving) {
      const timeout = setTimeout(() => {
        videoRef.current.nextBg()
        setCurrentVideoIndex((prev) => (prev + 1) % videoBackgrounds.length);
        setFadeIn(true); // Fade-in do novo vídeo
        setTimeout(() => {
          
          handleTitleScene();
        }, 200)
        handleFundo();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);

  
  


  // --------------------------- JSX ---------------------------
return (
  <div className="bg-black-quiz">
    {/* Narrador / título */}
    {titleScene && (
      <div className={`title-scene ${titleScene ? "visible-ui" : "hidden-ui"}`}>
        <Narrator
          index={currentVideoIndex}
          active={titleFadeOut}
          typingSpeed={125}
        />
      </div>
    )}

    {/* Botão de controle */}
    <button
      className={`${
        fundoFrente ? "hidden-ui disable-btn" : "visible-ui"
      } toggle-overlay-btn`}
      id="btn-hidden"
      onClick={handleFundo}
      disabled={fundoFrente}
    >
      {overlayVisible ? "👁 Mostrar fundo" : "🔒 UI visível"}
    </button>

    <div className={`quiz-page ${fadeIn ? "fade-in" : ""}`}>
      {/* Sidebar esquerda */}
      <div className={`${fundoFrente ? "hidden-ui" : "visible-ui"} box-lateral`}>
        <Sidebar
          playerName={playerName}
          score={score}
          current={current}
          total={total}
          handleGetHour={handleGetHour}
        />
      </div>

      {/* Container principal */}
      <div className={`${fundoFrente ? "hidden-ui" : "visible-ui"}`}>
        <QuizContainer
          handleUpdateUser={handleUpdateUser}
          handleUpdateScore={handleUpdateScore}
          isMovingChange={handleMoving}
        />
      </div>

      {/* Sidebar direita */}
      <div
        className={`${
          fundoFrente ? "hidden-ui" : "visible-ui"
        } box-lateral-r`}
      >
        <img className="box-lateral-img " src={BoxWoodenR} alt="" />
        <div className="box-leaderboard">
          <h1>Hall dos heroiS</h1>
          <div className="leaderboard">
            <h1>Nome:</h1>
            <h1>Pontuação:</h1>
          </div>
          <div className="listboard" id="listboard"></div>
        </div>
      </div>

      
    </div>
    {/* Transição de vídeos (novo componente) */}
       <VideoTransition ref={videoRef} fadeDuration={500} />
  </div>
);
}


export default Quiz;

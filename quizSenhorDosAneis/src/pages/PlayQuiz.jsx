import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const [overlayHovered, setOverlayHovered] = useState(false);
  const toggleOverlay = () => setOverlayVisible((prev) => !prev);

  const [fundoFrente, setFundoFrente] = useState(false);

  // Controle do bonequinho / isMoving vindo do QuizContainer
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
    setIsMoving(status);
    console.log("Bonequinho está andando?", status);
  };

  const handleFundo = () => {
    console.log("ESTOU NO HANDLE DE FUNDO")
    setFundoFrente(true);

    setTimeout(() => {
      setFundoFrente(false)
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

  useEffect(() => {
    handleRanking();
    setFadeIn(true);
    const interval = setInterval(handleRanking, 10000);
    return () => clearInterval(interval);
  }, []);

  setInterval(() => {
    handleRanking();
  }, 10000)

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
        setCurrentVideoIndex((prev) => (prev + 1) % videoBackgrounds.length);
        setFadeIn(true); // Fade-in do novo vídeo
        setTimeout(() => {
          handleFundo();
        }, 200)
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);

  // --------------------------- JSX ---------------------------
return (
    <div
      className={`bg-black-quiz`}
    >
      {/* BOTÃO FIXO: fica acima de tudo e controla a transparência */}
      <button
        className="toggle-overlay-btn"
        onClick={handleFundo}
        // aria-pressed={!overlayVisible}
        
      >
        {overlayVisible ? "👁 Mostrar fundo" : "🔒 UI visível"}
      </button>

      <div className={`quiz-page ${fadeIn ? "fade-in" : ""} `}>
        <div className={`${fundoFrente ? "hidden-ui" : "visible-ui"} box-lateral`}>
          {/* Quadro lateral */}
          <Sidebar
            playerName={playerName}
            score={score}
            current={current}
            total={total}
            handleGetHour={handleGetHour}
          />
        </div>

        <div className={`${fundoFrente ? "hidden-ui" : "visible-ui"}`}>
        <QuizContainer
          handleUpdateUser={handleUpdateUser}
          handleUpdateScore={handleUpdateScore}
          isMovingChange={handleMoving}
        />
        </div>

        <div className={`${fundoFrente ? "hidden-ui" : "visible-ui"} box-lateral-r`}>
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
         {/* Vídeos sobrepostos */}
        <div className={` ${fundoFrente ? "video-front" : "video-wrapper"} `}>
          {videoBackgrounds.map((video, index) => (
            <video
              key={index}
              className={`bg-video2 ${
                index === currentVideoIndex ? "visible-video" : "hidden-video"
              }`}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video} type="video/mp4" />
            </video>
          ))}
        </div>
       
      </div>
     
    </div>
  );
}


export default Quiz;

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import VideoTransition from "../components/videoTransition/VideoTransition"; // importa o novo componente
import Menu from '../components/layout/Menu'

import QuizContainer from "../components/layout/QuizContainer";
import Sidebar from "../components/layout/Sidebar";
import BoxWoodenR from "../assets/images/box/box-aviso-gg.png";

import shireAmbience from "../assets/audio/ambience/shire-ambience.mp3"
import briAmbience from "../assets/audio/ambience/bri-ambience.mp3"
import rivendellAmbience from "../assets/audio/ambience/rivendell-ambience.mp3"
import moriaAmbience from "../assets/audio/ambience/moria-ambience.mp3"
import lorienAmbience from "../assets/audio/ambience/lorien-ambience.mp3"
import argonathAmbience from "../assets/audio/ambience/argonath-ambience.mp3"
import mordorAmbience from "../assets/audio/ambience/mordor-ambience.mp3"

import bgShire from "../assets/videos/Hobbington.mp4";
import bgBri from "../assets/videos/bri.mp4";
import bgRivendel from "../assets/videos/lorien.mp4";
import bgLorien from "../assets/videos/lorien.mp4";
import bgMordor from "../assets/videos/mordor.mp4";
import bgMoria from "../assets/videos/moria.mp4";
import bgArgonath from "../assets/videos/argonath.mp4";

import "./PlayQuiz.css";
import Narrator from "../components/narrador/Narrador";

function PlayQuiz({ setMusicaAtual }) {
  const location = useLocation();
  const data = location.state; // user info
  const token = localStorage.getItem("token");

  // --------------------------- Estados principais ---------------------------
  const [playerName] = useState(data.user.name);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(1);
  const total = 21;
  const [segundos, setSegundos] = useState(1);
  const videoRef = useRef(); //deve controlar a mudança de background
  let scoreTotal = 0;

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
  

  // Controle do botão de transparência da UI
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [titleFadeOut, setTitleFadeOut] = useState(true);
  const [overlayHovered, setOverlayHovered] = useState(false);
  const toggleOverlay = () => setOverlayVisible((prev) => !prev);

  const [fundoFrente, setFundoFrente] = useState(true);
  const [titleScene, setTitleScene] = useState(false)

  // Controle do bonequinho / isMoving vindo do QuizContainer
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
    setIsMoving(status);
    console.log("Bonequinho está andando?", status);
  };



// --------------------------- Toca ao abrir a página ---------------------------

  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {

    
    //desliga a opacidade para aparecer o título primeiro    
    setFadeIn(false)
    //roda o título
    handleFundo();
    handleRanking();

    
    
    
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

  
 
//--------------------------Transição de musicas do mapa-------------------------------
// Cuidado, se p State da música mudar muito rápido, instancia 2x o player de música
// quando isso acontece, 2 músicas tocam ao mesmo tempo 

 const musicas = [
    briAmbience, rivendellAmbience, moriaAmbience,
   lorienAmbience, argonathAmbience, mordorAmbience, mordorAmbience
];
 const [tocarMusica,setTocarMusica]=useState(false)
  // Estado para índice da música atual
  const [indice, setIndice] = useState(0);

  // Música atual é derivada do índice
  const musicaAtual = musicas[indice];

  // Troca de música quando condição for satisfeita
  const proximaMusica = () => {
    setIndice((prev) => (prev + 1) % musicas.length); 
    setMusicaAtual(musicaAtual);
    // o % faz voltar para a primeira quando acabar
  };

  const handleStarted = (status)=>{
    setTocarMusica(status);    
  }

  useEffect(()=>{   
    if(tocarMusica){
        proximaMusica()
        console.log("trocando de música"+musicaAtual)
        setTimeout(()=>{          
          setTocarMusica(false) 
      },500)}
      
  },[tocarMusica])

//--------------------------Transição de áreas do mapa-------------------------------
  const handleFundo = () => {
    
    
    setFundoFrente(true);
   
    setTitleFadeOut(true);

    setTimeout(() => {
         setTitleScene(true)
       },600);
    //esse timer envia false para o narrador 
    //antes para gerar animação de fade-out
    setTimeout(() => {
        setTitleFadeOut(false);
       },2100);
    setTimeout(() => {
      setFundoFrente(false);
      setTitleScene(false);
    }, 2800);
  }

  
  //titulo da área aparece e desaparece depois de 3s
  const handleTitleScene = () => {
    setTitleScene(true);

    setTimeout(() => {
      setTitleScene(false);
    }, 3000);
  };

  // --------------------------- Ranking ---------------------------
  const handleRanking = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/ranking`);
      const rankingList = await res.json();

      const container = document.getElementById("listboard");
      container.innerHTML = "";

      rankingList.forEach((u) => {
        const div = document.createElement("div");
        div.className = "nameRanking";

        const nameUser = document.createElement("h1");
        const scoreUser = document.createElement("h1");

        nameUser.textContent = u.user.name;
        scoreUser.textContent = u.scoreRound;

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
    setTimeout(() => {
      setFadeIn(true);
    }, 2900);

    videoRef.current.setBg(0);
    const interval = setInterval(handleRanking, 10000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------------------------------------------
 

  const handleUpdateScore = async (score = 300, isFinished) => {
    if (score == -999) {
      try {
        const res = await fetch(`http://localhost:3000/users/me/score/zero`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            id: data.user.id,
          }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar pontuação");
        const resData = await res.json();
        setScore(resData.score);
      } catch (err) {
        console.error("Erro:", err);
      }

      return;
    }

    scoreTotal += score;

    if(isFinished) {
      scoreTotal += Math.round(scoreTotal / segundos);
    }

    try {
      const res = await fetch(`http://localhost:3000/users/me/score`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: data.user.id,
          score: isFinished ? scoreTotal : score,
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

  const handleSetRound = async () => {
    try {
      const round = await fetch(`http://localhost:3000/users/me/round`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: data.user.id,
          score: score,
        }),
      });
    } catch (err) {
      console.error("Erro:", err)
    }
  }

  const handleGetHour = (timer) => setSegundos(timer);

  // --------------------------- Troca de vídeos ---------------------------
  useEffect(() => {
    if (!isMoving) {
      const timeout = setTimeout(() => {
        videoRef.current.nextBg();
        setCurrentVideoIndex((prev) => (prev + 1) % videoBackgrounds.length);
        setFadeIn(true); // Fade-in do novo vídeo
        setTimeout(() => {
          handleTitleScene();
        }, 500)
        handleFundo();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);




// --------------------------- Abertura do modal MENU ---------------------------
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault(); // evita scroll
        setIsMenuOpen((prev) => !prev); // alterna abrir/fechar
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown, false);
  }, []);

  
  


  // --------------------------- JSX ---------------------------
  return (
    <div className="bg-black-quiz">
      {/* Narrador / título */}
      {titleScene && (
        <div
          className={`title-scene ${titleScene ? "visible-ui" : "hidden-ui"}`}
        >
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
      
      {/* Renderiza o Menu só se estiver aberto */}
      {isMenuOpen && <Menu />}

      <div className={`quiz-page ${fadeIn ? "fade-in" : ""}`}>
        {/* Sidebar esquerda */}
        <div
          className={`${fundoFrente ? "hidden-ui" : "visible-ui"} box-lateral`}
        >
          <Sidebar
            playerName={playerName}
            score={score}
            current={current}
            total={total}
            handleGetHour={handleGetHour}
          />
        </div>

      {/* Container principal */}
      <div className={`box-question-center ${fundoFrente ? "hidden-ui" : "visible-ui"}`}>
        <QuizContainer
          handleUpdateScore={handleUpdateScore}
          isMovingChange={handleMoving}
          isStartedChange={handleStarted}
          handleSetRound={handleSetRound}
        />
      </div>
     
      {/* Sidebar direita */}
      <div className={`${ fundoFrente ? "hidden-ui" : "visible-ui"} box-lateral-r`}
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
      <div className="bg-video2-play-quiz ">
        {/* Transição de vídeos (novo componente) */}
         <VideoTransition ref={videoRef} fadeDuration={500} />
      </div>
       
  </div>
);
}


export default PlayQuiz;

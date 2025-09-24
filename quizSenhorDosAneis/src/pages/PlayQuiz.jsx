import "./PlayQuiz.css";
import Map from "../components/Map";
import BoxMap from "../assets/images/map-box.png";
import MapBox from "../components/MapBox";
import bgShire from "../assets/videos/Hobbington.mp4";
import QuizContainer from "../components/layout/QuizContainer";
import React, { useEffect, useState } from "react";
import MovingCharacter from "../components/Map";
import Sidebar from "../components/layout/Sidebar";
import BoxWoodenR from "../assets/images/box/box-aviso-gg.png";
import { useLocation } from "react-router-dom";

function Quiz({ setMusicaAtual }) {
  const [fadeIn, setFadeIn] = useState(false); // para o efeito de fadeIN quando a página abre
  /*Essas variáveis servem para o quadro lateral Sidebar*/

  const location = useLocation();
  const data = location.state; // name id score

  const token = localStorage.getItem("token");

  const [playerName] = useState(data.user.name);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(1);
  const total = 7;
  const [segundos, setSegundos] = useState(1);

  const handleRanking = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/ranking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    setFadeIn(true); // ativa fade in ao entrar
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

      // console.log("ESSE É A RESPOSTA DA REQUISIÇÃO:  ", res.users)
      if (!res.ok) {
        throw new Error("Erro ao atualizar pontuação");
      }

      const resData = await res.json();
      await setScore(resData.score);
      setCurrent(current + 1);
    } catch (err) {
      console.error("Erro:", err);
      console.log("ESSE É O CATCH CONSOLE");
    }
  };

  const handleGetHour = (timer) => {
    setSegundos(timer);
  };

  return (
    <div className="bg-black-quiz">
      <div className={`quiz-page ${fadeIn ? "fade-in" : ""} `}>
        <div className="box-lateral">
          {/* Quadro lateral */}
          <Sidebar
            playerName={playerName}
            score={score}
            current={current}
            total={total}
            handleGetHour={handleGetHour}
          />
        </div>
        <QuizContainer
          handleUpdateUser={handleUpdateUser}
          handleUpdateScore={handleUpdateScore}
        ></QuizContainer>

        <div className="box-lateral-r ">
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

        <video className="bg-video2" autoPlay muted loop playsInline>
          <source src={bgShire} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default Quiz;

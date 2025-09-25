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
  const total = 10;
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

  // Controle do bonequinho / isMoving vindo do QuizContainer
  const [isMoving, setIsMoving] = useState(false);
  const handleMoving = (status) => {
    setIsMoving(status);
    console.log("Bonequinho está andando?", status);
  };

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

  // --------------------------- Atualização de score ---------------------------
  const handleUpdateUser = () => {};
  const handleUpdateScore = async (scoreUpdate = 300) => {
    const scoreByTime = Math.round(scoreUpdate / segundos);
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
      // Fade-out antes de trocar vídeo
      setFadeIn(false);
      const timeout = setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoBackgrounds.length);
        setFadeIn(true); // Fade-in do novo vídeo
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isMoving]);

  // --------------------------- JSX ---------------------------
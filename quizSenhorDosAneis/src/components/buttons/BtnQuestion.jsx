import './BtnQuestion.css'
import React, { useRef, useState, useEffect } from "react";
import btnQuestionMarrom from '../../assets/images/button/btn-marrom-2.png'
import btnQuestionDourado from '../../assets/images/button/btn-dourado-2.png'
import btnQuestionVerde from '../../assets/images/button/btn-verde.png'
import btnQuestionVermelho from '../../assets/images/button/btn-vermelho.png'
import hoverSound from '../../assets/audio/click-song.mp3'

function BtnQuestion({ w, h, texto, resposta, onClick }) {
  const audioRef = useRef(new Audio(hoverSound));
  const [status, setStatus] = useState("default"); 
  // valores possíveis: "default", "correct", "wrong"

  // 🔄 sempre que mudar a pergunta, volta para o estado inicial
  useEffect(() => {
    setStatus("default");
  }, [texto, resposta]);

  const handleHover = () => {
    if (status !== "default") return; // só toca o som na fase inicial
    const audio = audioRef.current;
    audio.volume = 0.4;
    audio.currentTime = 0.18;
    audio.play().catch(() => {});
  };

  const handleClick = (e) => {
    e.preventDefault();
    const audio = audioRef.current;
    audio.volume = 0.8;
    audio.currentTime = 0.16;
    audio.play().catch(() => {});

    if (onClick) onClick(resposta);

    // espera 0.5s antes de mostrar verde/vermelho
    setTimeout(() => {
      setStatus(resposta ? "correct" : "wrong");
    }, 500);
  };

  // define imagens: base marrom sempre, hover muda conforme status
  let bgImage = btnQuestionMarrom;
  let hoverImage = btnQuestionDourado;

  if (status === "correct") {
    hoverImage = btnQuestionVerde;
  }
  if (status === "wrong") {
    hoverImage = btnQuestionVermelho;
  }

  return (
    <button
      onMouseEnter={handleHover}
      onClick={handleClick}
      style={{ width: w, height: h }}
      className={`btn-question ${status}`} 
    >
      <p className='txt-btn-question'>{texto}</p>
     {/* Base sempre marrom */}
  <img className="btn-img base" src={btnQuestionMarrom} alt="" />

  {/* Hover dourado */}
  <img className="btn-img hover" src={btnQuestionDourado} alt="" />

  {/* Verde (correto) */}
  <img className="btn-img correct" src={btnQuestionVerde} alt="" />

  {/* Vermelho (errado) */}
  <img className="btn-img wrong" src={btnQuestionVermelho} alt="" />
    </button>
  )
}

export default BtnQuestion;

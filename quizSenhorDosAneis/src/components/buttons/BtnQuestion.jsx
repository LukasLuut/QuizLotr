import './BtnQuestion.css'
import React, { useRef } from "react";
import btnQuestionMarrom from '../../assets/images/button/btn-marrom-2.png'
import btnQuestionDourado from '../../assets/images/button/btn-dourado-2.png'
import hoverSound from '../../assets/audio/click-song.mp3'

function BtnQuestion({ w, h, texto, resposta, onClick }) {
  const audioRef = useRef(new Audio(hoverSound));

  const handleHover = () => {
    const audio = audioRef.current;
    audio.volume = 0.4;
    audio.currentTime = 0.18;
    audio.play().catch(err => {
      console.log("Som bloqueado pelo navegador até interação do usuário:", err);
    });
  };

  const handleClick = (e) => {
    // toca o som
    e.preventDefault()
    const audio = audioRef.current;
    audio.volume = 0.8;
    audio.currentTime = 0.16;
    audio.play().catch(err => {
      console.log("Som bloqueado pelo navegador até interação do usuário:", err);
    });

    // chama a função do pai, passando se a resposta é correta
    if (onClick) {
      
      onClick(resposta);
    }
  };

  return (
    <button
      onMouseEnter={handleHover}
      onClick={handleClick}
      style={{ width: w, height: h }}
      className='btn-question'
    >
      <p className='txt-btn-question'>{texto}</p>
      <img className='btn-question-bg' src={btnQuestionMarrom} alt="" />
      <img className='btn-question-bg-2' src={btnQuestionDourado} alt="" />
    </button>
  )
}

export default BtnQuestion;

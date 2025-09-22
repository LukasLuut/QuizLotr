import './BtnQuestion.css'
import React, { useRef } from "react";
import btnQuestionMarrom from '../../assets/images/button/btn-marrom-2.png'
import btnQuestionDourado from '../../assets/images/button/btn-dourado-2.png'
import hoverSound from '../../assets/audio/click-song.mp3'

function BtnQuestion(props) {

   const audioRef = useRef(new Audio(hoverSound));

    const handleHover = () => {
    const audio = audioRef.current;
    audio.volume=0.4
    audio.currentTime = 0.18; // reinicia o som toda vez
    audio.play().catch(err => {
      console.log("Som bloqueado pelo navegador até interação do usuário:", err);
    });
  };
  const handleClick = () => {
    const audio = audioRef.current;
    audio.volume=0.8
    audio.currentTime = 0.16; // reinicia o som toda vez
    audio.play().catch(err => {
      console.log("Som bloqueado pelo navegador até interação do usuário:", err);
    });
  };

  return (
    <button onMouseEnter={handleHover} onClick={handleClick} style={{ width: props.w, height: props.h }} className='btn-question'>
        <p className='txt-btn-question'>{props.texto}</p>
        <img className='btn-question-bg' src={btnQuestionMarrom} alt="" />
        <img className='btn-question-bg-2' src={btnQuestionDourado} alt="" />
    
    </button>
  )
}

export default BtnQuestion
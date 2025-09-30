import './BtnQuestion.css'
import React, { useRef, useState, useEffect } from "react";
import btnQuestionMarrom from '../../assets/images/button/btn-marrom-2.png'
import btnQuestionDourado from '../../assets/images/button/btn-dourado-2.png'
import btnQuestionVerde from '../../assets/images/button/btn-verde.png'
import btnQuestionVermelho from '../../assets/images/button/btn-vermelho.png'
import hoverSound from '../../assets/audio/click-song.mp3'
import correctSong from '../../assets/audio/sfx/correct-sfx.mp3'
import incorrectSong from '../../assets/audio/sfx/error-sfx.mp3'

/**
 * Componente BtnQuestion
 * Botão de resposta do quiz com imagens temáticas e sons para hover, clique, acerto e erro.
 */
function BtnQuestion({ className, w, h, texto, resposta, onClick }) {

  /* 🎵 Referências de áudio */
  const hoverAudioRef = useRef(new Audio(hoverSound));
  const correctAudioRef = useRef(new Audio(correctSong));
  const incorrectAudioRef = useRef(new Audio(incorrectSong));

  /*  Estado do botão: controla aparência e comportamento */
  const [status, setStatus] = useState("default"); 
  // valores possíveis: "default", "correct", "wrong"

  /*  Sempre que mudar a pergunta (texto ou resposta), 
       reseta o botão para o estado inicial */
  useEffect(() => {
    setStatus("default");
  }, [texto, resposta]);

  /*  Efeito sonoro ao passar o mouse */
  const handleHover = () => {
    if (status !== "default") return; // só toca no estado inicial
    const audio = hoverAudioRef.current;
    audio.volume = 0.4;
    audio.currentTime = 0.18;
    audio.play().catch(() => {});
  };

  /*  Clique do usuário */
  const handleClick = (e) => {
    e.preventDefault();   

    //  notifica o pai sobre a resposta escolhida
    if (onClick) onClick(resposta);

    //  após 0.1s mostra feedback visual + sonoro (acerto ou erro)
    setTimeout(() => {
      if (resposta) {
        setStatus("correct"); // muda cor para verde
        const correctAudio = correctAudioRef.current;
        correctAudio.volume = 0.7;
        correctAudio.currentTime = 0.03;
        correctAudio.play().catch(() => {});
      } else {
        setStatus("wrong"); // muda cor para vermelho
        const incorrectAudio = incorrectAudioRef.current;
        incorrectAudio.volume = 0.7;
        incorrectAudio.currentTime = 0.02;
        incorrectAudio.play().catch(() => {});
      }
    }, 100);
  };

  /*  Renderização do botão */
  return (
    <button
      onMouseEnter={handleHover}
      onClick={handleClick}
      style={{ width: w, height: h }}
      className={`btn-question ${status} ${className || ""}`} 
    >
      {/* Texto do botão */}
      <p className='txt-btn-question'>{texto}</p>

      {/* Camadas de imagens que mudam conforme o estado */}
      <img className="btn-img base" src={btnQuestionMarrom} alt="Base marrom" />
      <img className="btn-img hover" src={btnQuestionDourado} alt="Hover dourado" />
      <img className="btn-img correct" src={btnQuestionVerde} alt="Resposta correta" />
      <img className="btn-img wrong" src={btnQuestionVermelho} alt="Resposta incorreta" />
    </button>
  )
}

export default BtnQuestion;

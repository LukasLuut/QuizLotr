import React, { useRef } from "react";
import hoverSound from '../../assets/audio/click-song.mp3'
import './btnMenu.css'
function BtnMenu({onClick, texto}) {

   const audioRef = useRef(new Audio(hoverSound));
    
        const handleHover = () => {
        const audio = audioRef.current;
        audio.volume=0.2
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
         if (onClick) {
        onClick(); // chama a função que veio como prop
      }
      };
  return (
    <button type="button" onClick={handleClick } onMouseEnter={handleHover} className='btn-menu' > <p className='txt-btn'>{texto}</p></button>
  )
}

export default BtnMenu
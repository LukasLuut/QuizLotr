import React, { useState } from 'react';
import "./Start.css"
import { useNavigate } from 'react-router-dom' //npm install react-router-dom
import circleOneRing from '../assets/images/circleOneRing.png'
import circleOneRing2 from '../assets/images/circleOneRing2.png'
import lordOfTheRings from '../assets/images/lordOfTheRings.png'
import MusicaArgonath from "../assets/audio/the-argonath-song.mp3"

function Start({ setMusicaAtual }) {
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    // Ativa o fade
    setFade(true);

    // Espera a duração do fade (mesma do CSS) antes de navegar
    setTimeout(() => {
      setMusicaAtual(MusicaArgonath);
      navigate('/login');
    }, 3000); // 3000ms = mesma duração do transition
  

    console.log('cuuuuu')
    // Entrar em fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }

    // Navegar para o quiz
    // navigate('/quiz');
  };






  return (
    <div className='bg'>
      <div className="loader__container">
        {/*Aqui e o titulo*/}
        <img src={lordOfTheRings} alt="Lord of the Rings" />


        <div className='rings'>
            <div className="loader__ring" onClick={handleStart}>
              {/*Aqui estão as imagens da inscrição em elfico*/}
              <img className="loader__inscription" src={circleOneRing} alt="The One Ring Inscription" />
              <img className="loader__inscription loader__inscription2" src={circleOneRing2} alt="The One Ring Inscription" />
            </div>

              {/*Aqui estou criando um circulo*/}
              <svg viewBox="0 0 300 300">
              <defs>
                <path
                  id="circlePath"
                  d="
                    M 150, 150
                    m -120,0
                    a 120,120 0 1,1 240,0
                    a 120,120 0 1,1 -240,0
                  "
                />
              </defs>
                {/*Aqui está o texto que ficará no circulo */}
              <text className="circle-text">
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" textLength="750" lengthAdjust="spacingAndGlyphs">
                  "One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them."
                </textPath>
              </text>
            </svg>
            <button className='btn-start'>START</button>
        </div>
      </div>   
         
      {/* Overlay branco */}
      <div className={`fade-overlay ${fade ? 'active' : ''}`}></div>
    </div>
    
);
}

export default Start

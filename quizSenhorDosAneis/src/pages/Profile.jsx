import React from 'react'
import './Profile.css'
// import bgVideo2 from "../assets/videos/boromir.mp4";
import flag from "../assets/images/scroll.png"
import BtnMenu from '../components/buttons/BtnMenu';
import borderProfile from '../assets/images/perfil-border.png'
import gandalf from '../assets/images/Gandalf.jpg'
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import prologue from "../assets/videos/Prologue.mp4";
import Musica1 from "../assets/audio/the-shire-song.mp3"
import Button from '../components/buttons/Button';


function Profile({ setMusicaAtual }) {
  const [fadeIn, setFadeIn] = useState(false); // para o efeito de fadeIN quando a página abre
  const [fadeToBlack, setFadeToBlack] = useState(false); //para efeito de fadeOUT quando consegue logar
  const [playTransitionVideo, setPlayTransitionVideo] = useState(false);// para umas maracutaia 
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      setFadeIn(true); // ativa fade in ao entrar
      
    }, []);
  
    const handleStartQuiz = () => {
      setFadeToBlack(true); 
      setMusicaAtual(null)      // ativa overlay preta
      setTimeout(() => setPlayTransitionVideo(true), 3800); // depois do fade, toca vídeo
    };
  
    const handleVideoEnd = () => {
      navigate("/quiz");          // ao terminar o vídeo, vai para Quiz
      
    };


  const videoRef = useRef(null);  
  const [mostrarBotao, setMostrarBotao] = useState(false);

  const pularIntro = () => {
     setFadeOut(true); // ativa fade
     setMusicaAtual(Musica1);
    setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();
        navigate("/quiz");
        }, 2000); // tempo do fade, igual no CSS
  };
  
  
  
  return (
    <div className='bg-black-profile'>
      <div className={`body-container-profile ${fadeIn ? 'fade-in' : ''} `}>
        <div className='profile-container'>
          <div className='flag-profile'>
            <img className='flagg' src={flag} alt=""/>
            <img className='border-profile' src={borderProfile} alt="" />
            <img className='img-profile' src={gandalf} alt="" />
          
            <div className='btn-box'> 
              <BtnMenu onClick={handleStartQuiz} texto='New Game'></BtnMenu>            
              <BtnMenu onClick={()=>setMusicaAtual(null)} texto='Continue'></BtnMenu>
              <BtnMenu onClick={handleVideoEnd} texto='Logout'></BtnMenu>
            </div>
          </div>
        </div>
        <div className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`}></div>
          {/* Vídeo de transição */}
          {playTransitionVideo && (
            <video onPlay={() => setMostrarBotao(true)} className={`transition-video ${fadeOut ? "fade-out" : ""}`} autoPlay onEnded={handleVideoEnd} >
              <source src={prologue} type="video/mp4" />
            </video>            
          )}
            {mostrarBotao && (<div className={`pular-intro ${fadeOut ? "fade-out" : ""}`}><Button onClick={pularIntro} texto='Pular intro'></Button></div>)}
        {/* <video  className="bg-video" autoPlay muted loop playsInline>
          <source src={bgVideo2} type="video/mp4" />
        </video> */}

        
      </div>
    </div>
  )
}

export default Profile

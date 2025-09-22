import React, { useEffect, useState, useRef } from 'react'
import './Profile.css'
import flag from "../assets/images/scroll.png"
import BtnMenu from '../components/buttons/BtnMenu';
import borderProfile from '../assets/images/perfil-border.png'
import gandalf from '../assets/images/Gandalf.jpg'
import { useNavigate } from 'react-router-dom'
import prologue from "../assets/videos/Prologue.mp4";
import Musica1 from "../assets/audio/the-shire-song.mp3"
import Button from '../components/buttons/Button';

function Profile({ setMusicaAtual }) {
  const [fadeIn, setFadeIn] = useState(false); 
  const [fadeToBlack, setFadeToBlack] = useState(false); 
  const [playTransitionVideo, setPlayTransitionVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    setFadeIn(true); // ativa fade in ao entrar
  }, []);

  const handleStartQuiz = () => {
    setFadeToBlack(true); 
    setMusicaAtual(null); // parar música
    setTimeout(() => setPlayTransitionVideo(true), 3800); // depois do fade, toca vídeo
  };

  const handleVideoEnd = () => {
    navigate("/quiz"); // ao terminar o vídeo, vai para Quiz
  };

  const pularIntro = () => {
    setFadeOut(true); 
    setMusicaAtual(Musica1); // inicia música ao pular
    setTimeout(() => {
      if (videoRef.current) videoRef.current.pause();
      navigate("/quiz");
    }, 2000); 
  };

  //inicia a música 5s antes do vídeo acabar
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const handleTimeUpdate = () => {
        if (video.duration - video.currentTime <= 10) {
          setMusicaAtual(Musica1);
          video.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [playTransitionVideo, setMusicaAtual]);

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
              <BtnMenu onClick={()=>setMusicaAtual(null)} texto='Delete account'></BtnMenu>
              <BtnMenu onClick={handleVideoEnd} texto='Logout'></BtnMenu>
            </div>
          </div>
        </div>

        <div className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`}></div>

        {/* Vídeo de transição */}
        {playTransitionVideo && (
          <video 
            ref={videoRef}
            onPlay={() => setMostrarBotao(true)} 
            className={`transition-video ${fadeOut ? "fade-out" : ""}`} 
            autoPlay 
            onEnded={handleVideoEnd}
          >
            <source src={prologue} type="video/mp4" />
          </video>            
        )}

        {mostrarBotao && (
          <div className={`pular-intro ${fadeOut ? "fade-out" : ""}`}>
            <Button onClick={pularIntro} texto='Pular intro'></Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

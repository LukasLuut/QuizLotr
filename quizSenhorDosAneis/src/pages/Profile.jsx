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
import bgVideo from '../assets/videos/boromir.mp4'
import OptionProfile from '../components/layout/OptionProfile';

function Profile({ setMusicaAtual }) {
  const [fadeIn, setFadeIn] = useState(false); //State usado na animação de quando carrega a página
  const [fadeToBlack, setFadeToBlack] = useState(false); //State usado na animação de saída da página
  const [playTransitionVideo, setPlayTransitionVideo] = useState(false);//state usado para definir quando o vídeo intro deve rodar
  const [fadeOut, setFadeOut] = useState(false);
  const [mostrarBotao, setMostrarBotao] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);//state usado para mostrar o modal

  //métodos do modal
 

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
             <OptionProfile
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={(data) => console.log("Dados enviados:", data)}
              />
            <div className='btn-box'> 
              <BtnMenu onClick={handleStartQuiz} texto='Novo Jogo'></BtnMenu>            
              <BtnMenu onClick={()=>setMusicaAtual(null)} texto='Continuar'></BtnMenu>
              <BtnMenu onClick={() => setModalOpen(true)} texto='Editar Perfil'></BtnMenu>
              <BtnMenu onClick={handleVideoEnd} texto='Sair'></BtnMenu>
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

        <video className="bg-video" autoPlay muted loop playsInline>
                  <source src={bgVideo} type="video/mp4" />
                </video>
      </div>
    </div>
  )
}

export default Profile

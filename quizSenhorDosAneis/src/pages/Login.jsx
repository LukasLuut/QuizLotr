import "./Login.css";
import bgVideo from "../assets/videos/The-Argonath-Animated-Wallpaper.mp4.mp4";
import Button from "../components/buttons/Button";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import MusicaArgonath from "../assets/audio/the-argonath-song.mp3"
import BtnMenu from "../components/buttons/BtnMenu";

function Login() {
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); // para o efeito de fadeIN quando a página abre
  const [fadeToBlack, setFadeToBlack] = useState(false); //para efeito de fadeOUT quando consegue logar
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true); // ativa fade in ao entrar
    
  }, []);

  const handleStartQuiz = () => {
    setFadeToBlack(true);       // ativa overlay preta    
    setTimeout(() => navigate('/Profile'), 3500); // depois do fade, toca vídeo
  };

    
  return (
  
    <div className={`login-body ${fadeIn ? 'fade-in' : ''}`}>
      <div className="login-page">
        
        {/* Aqui o Formulário */}
        <div className="form-container ">
          <div className="title-container ">
            <h2 className="title-login">Quiz da Terra-médiA</h2>
          </div>
        
          <form>
            
            {/* Input de User*/}
            <div className="form-group">            
              <label htmlFor="username">Nome de usuário</label>
              <input type="text" id="username" placeholder="Ex: Frodo"/>
            </div>

            {/* Input de Email*/}          
              {mostrarEmail && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Ex: frodo@shire.me"/>
                </div>
              )}

            {/* Input de senha*/}
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" placeholder="••••••••" />
            </div>

            <BtnMenu type='button' onClick={handleStartQuiz} texto='Entrar'></BtnMenu>
          </form>

          <a href="#" type="button" className="link" onClick={() => setMostrarEmail(true)}>Criar nova conta</a>
        </div>
        
        <div className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`}></div>
        
        {/* vídeo de plano de fundo */}
        <video className="bg-video" autoPlay muted loop playsInline >
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
 
  )
}

export default Login;

import "./Login.css";
import bgVideo from "../assets/videos/The-Argonath-Animated-Wallpaper.mp4.mp4";
import Button from "../components/Button";
import { useState } from "react";

function Login() {
  const [mostrarEmail, setMostrarEmail] = useState(false);
  return (
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

          <Button texto="Entrar"/>
        </form>

        <a href="#" className="link" onClick={() => setMostrarEmail(true)}>Criar nova conta</a>
      </div>

      {/* vídeo de plano de fundo */}
      <video className="bg-video" autoPlay muted loop playsInline >
        <source src={bgVideo} type="video/mp4" />
      </video>
    </div>
  )
}

export default Login;

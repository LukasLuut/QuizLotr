import "./Login.css";
import bgVideo from "../assets/videos/The-Argonath-Animated-Wallpaper.mp4.mp4";
import Button from "../components/buttons/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MusicaArgonath from "../assets/audio/the-argonath-song.mp3";
import BtnMenu from "../components/buttons/BtnMenu";
import PopUpDTO from "../components/PopUpDTO";

function Login() {
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [fadeIn, setFadeIn] = useState(false); // para o efeito de fadeIN quando a página abre
  const [fadeToBlack, setFadeToBlack] = useState(false); //para efeito de fadeOUT quando consegue logar
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true); // ativa fade in ao entrar
  }, []);

  const handleStartQuiz = () => {};

  const [mostrarBtnEntrar, setMostrarBtnEntrar] = useState(false);
  const [mostrarBtnRegistrar, setMostrarBtnRegistrar] = useState(true);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [erroMessage, setErroMessage] = useState("Erro ao criar personagem");

  let btnTitle = "Entrar";

  const handleEntrarClick = async () => {
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
      const res = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Corrigido: "Content-Type", não "content-Type"
        },
        body: JSON.stringify({
          name: name, // Substitua com o valor real, se necessário
          password: password,
        }),
      });

      const data = await res.json();

      const token = data.token;
      localStorage.setItem("token", token);
      

      if (data.token) {
        setFadeToBlack(true); // ativa overlay preta
        setTimeout(() => navigate("/Profile", {state: data}), 3500); // depois do fade, toca vídeo

      } else {
        setErroMessage("Usuário não encontrado")
        setMostrarPopup(true);
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const handleRegistrarClick = async () => {
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
      const res = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Corrigido: "Content-Type", não "content-Type"
        },
        body: JSON.stringify({
          name: name,
          email: email, // Substitua com o valor real, se necessário
          password: password,
        }),
      });

      if (!res.ok) {
        const erro = await res.text();
        const mensagens = erro.map((err) => Object.values(err.constraints));

        throw new Error(mensagens);
      }

      const data = await res.json();

      if (data.name) {
        setMostrarBtnEntrar(false);
        setMostrarBtnRegistrar(true);
        setMostrarEmail(false);
      }
    } catch (err) {
      console.log("Entrou no Catch");
      console.log(err);
      setMostrarPopup(true);
    }
  };

  if (mostrarPopup) {
    setTimeout(() => {
      setMostrarPopup(false);
    }, 3000);
  }

  if (!mostrarEmail) {
    const bt = document.getElementById("btnEntrar");
  }

  if (mostrarBtnEntrar) {
  }

  if (mostrarBtnEntrar) {
    btnTitle = "Registrar";
  }

  return (
    <div className={`login-body ${fadeIn ? "fade-in-login" : ""}`}>
      {mostrarPopup && <PopUpDTO erro={erroMessage} />}
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
              <input autocomplete="off" type="text" id="username" placeholder="Ex: Frodo" />
            </div>

            {/* Input de Email*/}
            {mostrarEmail && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input autocomplete="off" type="email" id="email" placeholder="Ex: frodo@shire.me" />
              </div>
            )}

            {/* Input de senha*/}
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input autocomplete="off" type="password" id="password" placeholder="••••••••" />
            </div>

            <BtnMenu
              type="button"
              handleStartQuiz={handleStartQuiz}
              handleEntrarClick={handleEntrarClick}
              handleRegistrarClick={handleRegistrarClick}
              texto={btnTitle}
            ></BtnMenu>
          </form>

          {mostrarBtnRegistrar && (
            <a
              href="#"
              type="button"
              className="link"
              id="btnRegistrar"
              onClick={() => {
                setMostrarBtnEntrar(true);
                setMostrarBtnRegistrar(false);
                setMostrarEmail(true);
              }}
            >
              Criar nova conta
            </a>
          )}

          {mostrarBtnEntrar && (
            <a
              href="#"
              className="link"
              id="btnEntrar"
              onClick={() => {
                setMostrarBtnEntrar(false);
                setMostrarBtnRegistrar(true);
                setMostrarEmail(false);
                btnTitle = "Registrar";
              }}
            >
              Entrar
            </a>
          )}
        </div>

        <div
          className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`}
        ></div>

        {/* vídeo de plano de fundo */}
        <video className="bg-video-login" autoPlay muted loop playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default Login;

import "./Login.css";
import bgVideo from "../assets/videos/The-Argonath-Animated-Wallpaper.mp4.mp4";
import Button from "../components/buttons/Button";
import { useState } from "react";

function Login() {
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [mostrarBtnEntrar, setMostrarBtnEntrar] = useState(false);
  const [mostrarBtnRegistrar, setMostrarBtnRegistrar] = useState(true);
  let btnTitle = "Entrar"


  const handleEntrarClick = async () => {
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
      const res = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Corrigido: "Content-Type", não "content-Type"
        },
        body: JSON.stringify({
          email: email, // Substitua com o valor real, se necessário
          password: password
        })
      });

      const data = await res.json();

      if(data.token) {
        alert("VOCÊ LOGOU")
      } else {
        alert("ERRRROOOOU")
      }

      const token = data.token
      localStorage.setItem("token", token)
      console.log(token)

    } catch (err) {
      console.error("Erro:", err);
    }
  }

  const handleRegistrarClick = async () => {
      let name = document.getElementById("username").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      try {
        const res = await fetch(`http://localhost:3000/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json" // Corrigido: "Content-Type", não "content-Type"
          },
          body: JSON.stringify({
            name: name,
            email: email, // Substitua com o valor real, se necessário
            password: password
          })
        });

        const data = await res.json();

        console.log(data)
      } catch (err) {
        console.error("Erro:", err);
      }

    }

    if (!mostrarEmail) {
      const bt = document.getElementById("btnEntrar")
    }

    if (mostrarBtnEntrar) {
    }

    if (mostrarBtnEntrar) {
      btnTitle = "Registrar"
    }




    return (
      <div className="login-body">
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
                <input type="text" id="username" placeholder="Ex: Frodo" />
              </div>

              {/* Input de Email*/}
              {mostrarEmail && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Ex: frodo@shire.me" />
                </div>
              )}

              {/* Input de senha*/}
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" placeholder="••••••••" />
              </div>

              <Button texto={btnTitle} handleEntrarClick={handleEntrarClick} handleRegistrarClick={handleRegistrarClick} />
            </form>

            {mostrarBtnRegistrar && (
              <a href="#" className="link" id="btnRegistrar" onClick={() => { setMostrarBtnEntrar(true); setMostrarBtnRegistrar(false); setMostrarEmail(true) }}>Criar nova conta</a>
            )}

            {mostrarBtnEntrar && (
              <a href="#" className="link" id="btnEntrar" onClick={() => { setMostrarBtnEntrar(false); setMostrarBtnRegistrar(true); setMostrarEmail(false); btnTitle = "Registrar" }}>Entrar</a>
            )}

          </div>

          {/* vídeo de plano de fundo */}
          <video className="bg-video" autoPlay muted loop playsInline >
            <source src={bgVideo} type="video/mp4" />
          </video>
        </div>
      </div>
    )
  }

  export default Login;

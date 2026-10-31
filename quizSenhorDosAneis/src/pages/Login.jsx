import "./Login.css";
import bgVideo from "../assets/videos/The-Argonath-Animated-Wallpaper.mp4";
import bgPoster from "../assets/images/posters/login.jpg";

import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/buttons/Button";
import PopUpDTO from "../components/PopUpDTO";

const EMPTY = { name: "", email: "", password: "" };

function Login() {
  const { login, register, status, notice, clearNotice } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(null); // { message, variant }
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    setFadeIn(true); // fade in ao entrar
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  // Aviso vindo da sessão (ex.: token expirado)
  useEffect(() => {
    if (notice) {
      setPopup({ message: notice, variant: "info" });
      clearNotice();
    }
  }, [notice, clearNotice]);

  // O popup some sozinho depois de 4 s
  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 4000);
    return () => clearTimeout(t);
  }, [popup]);

  if (status === "authenticated" && !fadeToBlack) return <Navigate to="/profile" replace />;

  const isRegister = mode === "register";
  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setForm((prev) => ({ ...EMPTY, email: prev.email }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
        setPopup({ message: "Personagem criado! Agora é só entrar.", variant: "success" });
        switchMode("login");
      } else {
        await login(form.email.trim(), form.password);
        setFadeToBlack(true); // overlay preta e depois o perfil
        // Sempre pelo perfil: é lá que o jogador escolhe o modo ou continua a jornada
        timers.current.push(setTimeout(() => navigate("/profile", { replace: true }), 2500));
      }
    } catch (err) {
      setPopup({ message: err.message || "Não foi possível continuar.", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`login-body ${fadeIn ? "fade-in-login" : ""}`}>
      <PopUpDTO message={popup?.message} variant={popup?.variant} isOpen={!!popup} />
      <main className="login-page">
        <div className="form-container">
          <h1 className="title-login">Quiz da Terra-médiA</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="field">
                <label htmlFor="username">Nome do personagem</label>
                <input
                  autoComplete="nickname"
                  type="text"
                  id="username"
                  name="name"
                  placeholder="Ex: Frodo"
                  value={form.name}
                  onChange={update}
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                autoComplete="email"
                type="email"
                id="email"
                name="email"
                placeholder="Ex: frodo@condado.me"
                value={form.email}
                onChange={update}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                autoComplete={isRegister ? "new-password" : "current-password"}
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={update}
                aria-describedby={isRegister ? "password-hint" : undefined}
                required
              />
              {isRegister && (
                <span id="password-hint" className="field-hint">
                  Mínimo de 6 caracteres, com maiúscula, minúscula, número e símbolo (@$!%*?&#).
                </span>
              )}
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Aguarde..." : isRegister ? "Registrar" : "Entrar"}
            </Button>
          </form>

          <button type="button" className="link" onClick={() => switchMode(isRegister ? "login" : "register")}>
            {isRegister ? "Já tenho conta: entrar" : "Criar nova conta"}
          </button>
        </div>

        <div className={`fade-overlay-black ${fadeToBlack ? "active" : ""}`} aria-hidden="true"></div>

        {/* vídeo de plano de fundo */}
        <video className="bg-video-login" autoPlay muted loop playsInline preload="auto" poster={bgPoster} aria-hidden="true">
          <source src={bgVideo} type="video/mp4" />
        </video>
      </main>
    </div>
  );
}

export default Login;

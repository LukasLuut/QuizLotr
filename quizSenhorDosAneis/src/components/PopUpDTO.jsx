import { useEffect, useState } from "react";
import "./PopUpDTO.css";
import imgBoxDTO from "../assets/images/box/box-aviso-g.webp";

const TITLES = { error: "Atenção!", success: "Tudo certo!", info: "Aviso" };

/**
 * Aviso que desce do topo da tela.
 * variant "error" é anunciado imediatamente por leitores de tela (role=alert);
 * "success" e "info" de forma educada (role=status).
 */
function PopUpDTO({ message, erro, isOpen, variant = "error" }) {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      return;
    }
    // espera a animação de saída antes de desmontar
    const timer = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`pop-up-dto pop-up-${variant} ${isOpen ? "enter" : "exit"}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <img src={imgBoxDTO} alt="" />
      <div className="box-txt-DTO">
        <h1>{TITLES[variant] || TITLES.info}</h1>
        <h2>{message ?? erro}</h2>
      </div>
    </div>
  );
}

export default PopUpDTO;

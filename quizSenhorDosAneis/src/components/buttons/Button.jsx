import { useAudio } from "../../context/AudioContext";
import "./Button.css";
import "./ButtonMenu.css";

/**
 * Botão único do jogo.
 * - variant "menu": botão grande de madeira (menus, perfil, login)
 * - variant "plain": botão menor (pular intro, confirmações)
 * A ação vem sempre por onClick/type, nunca pelo texto do rótulo.
 */
function Button({ texto, children, onClick, type = "button", variant = "menu", disabled = false, className = "", ...rest }) {
  const { playSfx } = useAudio();

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${variant === "menu" ? "btn-menu" : "btn"} ${className}`.trim()}
      onMouseEnter={() => !disabled && playSfx("click", { volume: 0.2, offset: 0.18 })}
      onClick={(e) => {
        playSfx("click", { volume: 0.8, offset: 0.16 });
        onClick?.(e);
      }}
      {...rest}
    >
      <span className={variant === "menu" ? "txt-btn" : undefined}>{children ?? texto}</span>
    </button>
  );
}

export default Button;

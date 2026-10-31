import "./BtnQuestion.css";
import { useAudio } from "../../context/AudioContext";
import btnQuestionMarrom from "../../assets/images/button/btn-marrom-2.png";
import btnQuestionDourado from "../../assets/images/button/btn-dourado-2.png";
import btnQuestionVerde from "../../assets/images/button/btn-verde.png";
import btnQuestionVermelho from "../../assets/images/button/btn-vermelho.png";

const STATUS_LABEL = { correct: " (resposta correta)", wrong: " (sua resposta, incorreta)", selected: " (enviando)" };

/**
 * Botão de resposta do quiz. Só apresenta o estado que o pai define:
 * "default" | "selected" | "correct" | "wrong". Quem decide se a resposta
 * está certa é o servidor.
 */
function BtnQuestion({ className = "", texto, status = "default", disabled = false, onClick, ...rest }) {
  const { playSfx } = useAudio();

  return (
    <button
      type="button"
      onMouseEnter={() => status === "default" && !disabled && playSfx("click", { volume: 0.4, offset: 0.18 })}
      onClick={() => !disabled && onClick?.()}
      disabled={disabled}
      aria-disabled={disabled}
      className={`btn-question ${status} ${className}`.trim()}
      {...rest}
    >
      <span className="txt-btn-question">
        {texto}
        {STATUS_LABEL[status] && <span className="visually-hidden">{STATUS_LABEL[status]}</span>}
      </span>

      {/* Camadas de imagem que mudam conforme o estado (decorativas) */}
      <img className="btn-img base" src={btnQuestionMarrom} alt="" />
      <img className="btn-img hover" src={btnQuestionDourado} alt="" />
      <img className="btn-img correct" src={btnQuestionVerde} alt="" />
      <img className="btn-img wrong" src={btnQuestionVermelho} alt="" />
    </button>
  );
}

export default BtnQuestion;

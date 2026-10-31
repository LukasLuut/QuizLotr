import { useId } from "react";
import Button from "./buttons/Button";
import Modal from "./Modal";
import imgTemCerteza from "../assets/images/box/box-lateral-girado.webp";
import "./TemCerteza.css";

/**
 * Componente de confirmação genérico para ações críticas.
 *
 * Props:
 * - isOpen: controla se o modal aparece ou não
 * - mensagem: texto de aviso (default = "Você tem certeza?")
 * - onConfirm: callback quando o usuário clicar em "Sim"
 * - onCancel: callback quando o usuário clicar em "Não" ou apertar Esc
 */
function Confirmacao({ isOpen, mensagem = "Você tem certeza?", confirmLabel = "Sim", cancelLabel = "Não", onConfirm, onCancel }) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} labelledBy={titleId} overlayClassName="confirm-overlay" className="confirm-box">
      {/* Caixa de fundo decorativa */}
      <img src={imgTemCerteza} alt="" />
      <h2 id={titleId}>{mensagem}</h2>
      <div className="box-btn-tem-certeza">
        <Button variant="plain" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="plain" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default Confirmacao;

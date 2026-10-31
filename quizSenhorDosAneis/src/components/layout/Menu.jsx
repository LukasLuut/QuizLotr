import { useId, useState } from "react";
import "./Menu.css";
import bgMenu from "../../assets/images/box/box-lateral.webp";
import Button from "../buttons/Button";
import Modal from "../Modal";
import TemCerteza from "../TemCerteza";

/**
 * Menu de pausa (tecla Espaço). "Salvar e sair" mantém a partida para continuar depois;
 * "Reiniciar" encerra a atual e começa outra, sem recarregar a página.
 */
function Menu({ isOpen, onClose, onRestart, onLeave }) {
  const titleId = useId();
  const [confirmRestart, setConfirmRestart] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen && !confirmRestart} onClose={onClose} labelledBy={titleId} overlayClassName="box-menu" className="box-menu-dialog" closeOnEscape={false}>
        <img className="img-box-menu" src={bgMenu} alt="" />
        <div className="box-menu-content">
          <h1 id={titleId}>Menu</h1>
          <p className="menu-note">Jogo pausado · Espaço para continuar</p>
          <div className="box-btn">
            <Button onClick={onClose}>Continuar</Button>
            <Button onClick={() => setConfirmRestart(true)}>Reiniciar</Button>
            <Button onClick={onLeave}>Salvar e sair</Button>
          </div>
        </div>
      </Modal>

      <TemCerteza
        isOpen={isOpen && confirmRestart}
        mensagem="Começar uma nova jornada? O progresso desta partida será perdido."
        onConfirm={() => {
          setConfirmRestart(false);
          onRestart();
        }}
        onCancel={() => setConfirmRestart(false)}
      />
    </>
  );
}

export default Menu;

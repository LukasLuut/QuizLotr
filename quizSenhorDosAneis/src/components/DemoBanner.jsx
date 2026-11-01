import { useId, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";
import Button from "./buttons/Button";
import { REPO_URL } from "../config/demo";
import "./DemoBanner.css";

/**
 * Faixa da versão demo: avisa que nada é salvo e abre o "Sobre o projeto".
 * Some durante a partida para não disputar espaço com o quiz.
 */
function DemoBanner() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const titleId = useId();

  if (pathname === "/playquiz" && !open) return null;

  return (
    <>
      <div className="demo-banner" role="note">
        <span>Versão demo · nada é salvo ao fechar o navegador</span>
        <button type="button" className="demo-banner-link" onClick={() => setOpen(true)}>
          Sobre o projeto
        </button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} labelledBy={titleId} className="demo-about">
        <h2 id={titleId}>Quiz da Terra-média</h2>
        <p>
          Quiz sobre O Senhor dos Anéis e O Hobbit: a cada região do mapa, perguntas com regras próprias, personagens com
          habilidades, ajudas temáticas e o peso do Um Anel, que dobra os pontos mas corrompe quem o usa.
        </p>
        <ul>
          <li>Duas jornadas (Sociedade do Anel e O Hobbit), 8 regiões cada, com viagem animada pelo mapa</li>
          <li>20 personagens com habilidades próprias e falas a cada acerto e erro</li>
          <li>Modos Jornada (sem limite) e Desafio (3 vidas, 20 s por pergunta) e 24 conquistas</li>
          <li>React 19 + Vite + Leaflet; a versão completa tem API Node/Express + TypeORM + MySQL, login e ranking</li>
        </ul>
        <p className="demo-about-note">
          Nesta demo tudo roda no navegador: sem login, todos os personagens liberados, e nada fica salvo. Para apresentar,{" "}
          <kbd>Shift</kbd> + <kbd>D</kbd> durante a partida abre o modo apresentador (resposta certa e corrupção).
        </p>
        <div className="demo-about-actions">
          <a className="demo-about-repo" href={REPO_URL} target="_blank" rel="noreferrer">
            Ver o código no GitHub
          </a>
          <Button className="mode-back" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default DemoBanner;

// Sidebar.jsx
import React from "react";
import './Sidebar.css'
import imgBox1 from '../../assets/images/box/box-aviso.png' 

export default function Sidebar({ playerName, score, current, total }) {
  return (
    <aside className="sidebar">

        {/*numero de vidas, localidade */}
      {/* Nome do jogador */}
      <div className="player-info">
        <img className="player-info2" src={imgBox1}alt="" />
        <h2>{playerName}</h2>
      </div>

      {/* Pontuação */}
      <div className="score">
        <p>Pontuação: {score}</p>
      </div>

      {/* Progresso */}
      <div className="progress">
        <p>
          Progresso: {current}/{total}
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(current / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Extra: Mensagens motivacionais */}
      <div className="message">
        <p>Você está mandando bem!</p>
      </div>
      
    </aside>
  );
}

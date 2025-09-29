import React from 'react';
import './VictoryScreen.css';


// Função utilitária para formatar o tempo em mm:ss
function formatTime(time) {
if (time === undefined || time === null) return '--:--';
if (typeof time === 'string') return time;
const totalSeconds = Math.max(0, Math.floor(Number(time) || 0));
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;
return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


// Componente principal da tela de vitória
export default function VictoryScreen({
isOpen = true, // controla se a tela aparece ou não
message = 'Parabéns — Quiz Concluído!', // mensagem de conclusão
time = null, // tempo total
score = 0, // pontuação final
onRetry = () => {}, // callback para reiniciar o quiz
}) {
if (!isOpen) return null; // se não estiver aberto, não renderiza nada


return (
<div className="victory-overlay"> {/* Fundo preto translúcido */}
<div className="victory-card"> {/* Card central com informações */}
{/* Mensagem de conclusão */}
<h2 className="victory-title">{message}</h2>


{/* Estatísticas de tempo e pontuação */}
<div className="victory-stats">
<div className="victory-stat">
<span className="label">Tempo</span>
<span className="value">{formatTime(time)}</span>
</div>


<div className="victory-stat">
<span className="label">Pontuação</span>
<span className="value">{score}</span>
</div>
</div>


{/* Botão para jogar novamente */}
<button onClick={onRetry} className="victory-button">
Jogar novamente
</button>


{/* Observação abaixo do botão */}
<p className="victory-note">Toque em "Jogar novamente" para reiniciar.</p>
</div>
</div>
);
}
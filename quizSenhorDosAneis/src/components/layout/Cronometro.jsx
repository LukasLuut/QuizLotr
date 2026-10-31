import { useEffect, useState } from "react";
import "./Cronometro.css";
import { formatarTempo } from "../../utils/format";

// Até 59 s mostra só os segundos; a partir de 1 minuto, m:ss
const formatarCurto = (segundos) => (segundos < 60 ? String(segundos) : formatarTempo(segundos).replace(/^0/, ""));

// Cronômetro com estado próprio: re-renderiza só ele a cada segundo, não a página inteira
export default function Cronometro({ running = true }) {
  const [tempo, setTempo] = useState(0);

  useEffect(() => {
    if (!running) return;
    const intervalo = setInterval(() => setTempo((t) => t + 1), 1000);
    return () => clearInterval(intervalo);
  }, [running]);

  return (
    <div
      className={`conometro-box ${tempo >= 60 ? "com-minutos" : ""}`}
      role="timer"
      aria-label={`Tempo de jogo ${formatarTempo(tempo)}`}
    >
      <span className="contador" aria-hidden="true">
        {formatarCurto(tempo)}
      </span>
    </div>
  );
}

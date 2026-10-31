import { useEffect, useState } from "react";
import "./Cronometro.css";
import { formatarTempo } from "../../utils/format";

// Cronômetro com estado próprio: re-renderiza só ele a cada segundo, não a página inteira
export default function Cronometro({ running = true }) {
  const [tempo, setTempo] = useState(0);

  useEffect(() => {
    if (!running) return;
    const intervalo = setInterval(() => setTempo((t) => t + 1), 1000);
    return () => clearInterval(intervalo);
  }, [running]);

  return (
    <div className="conometro-box" role="timer" aria-label={`Tempo de jogo ${formatarTempo(tempo)}`}>
      <span className="contador" aria-hidden="true">
        {formatarTempo(tempo)}
      </span>
    </div>
  );
}

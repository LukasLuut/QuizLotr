import { useState, useEffect } from "react";
import "./Cronometro.css";

export default function Cronometro({ handleGetHour, current }) {
  const [tempo, setTempo] = useState(0); // tempo em segundos
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    handleGetHour(tempo);
  },);

  useEffect(() => {
    let intervalo;
    if (ativo) {
      intervalo = setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000); // atualiza a cada 1s
    } else {
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [ativo]);

  const iniciar = () => setAtivo(true);
  const pausar = () => setAtivo(false);
  const resetar = () => {
    setAtivo(false);
    setTempo(0);
  };

  // Converter segundos em mm:ss
  const formatarTempo = (segundos) => {
    const m = String(Math.floor(segundos / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="conometro-box">
      <h1 className="contador">{formatarTempo(tempo)}</h1>
      {/* <button onClick={iniciar}>Iniciar</button>
      <button onClick={pausar}>Pausar</button>
      <button onClick={resetar}>Resetar</button> */}
    </div>
  );
}

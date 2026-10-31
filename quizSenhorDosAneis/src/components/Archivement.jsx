import { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";
import "./Archivement.css";
import boxArchivement from "../assets/images/box/box-conquista.webp";

const SHOW_MS = 3800;

/**
 * Toast de conquista: mostra uma conquista por vez, na ordem em que chegaram.
 * Props: queue (lista de { code, title, description }), onShown(code) ao terminar cada uma.
 */
function Archivement({ queue, onShown }) {
  const { playSfx } = useAudio();
  const current = queue[0];
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!current) return;
    setLeaving(false);
    playSfx("win", { volume: 0.5 });
    const out = setTimeout(() => setLeaving(true), SHOW_MS - 400);
    const done = setTimeout(() => onShown(current.code), SHOW_MS);
    return () => {
      clearTimeout(out);
      clearTimeout(done);
    };
  }, [current, onShown, playSfx]);

  if (!current) return null;

  return (
    <div className={`archivement-box ${leaving ? "leaving" : ""}`} role="status" aria-live="polite">
      <img src={boxArchivement} alt="" />
      <div className="archivement-content">
        <h2>Conquista</h2>
        <p className="archivement-title">{current.title}</p>
        <p className="archivement-desc">{current.description}</p>
      </div>
    </div>
  );
}

export default Archivement;

import { useAudio } from "../context/AudioContext";
import "./SoundToggle.css";

// Botão fixo de som (WCAG 1.4.2: o usuário consegue silenciar o áudio automático)
function SoundToggle() {
  const { muted, toggleMute, volume, setVolume } = useAudio();

  return (
    <div className="sound-toggle">
      <button
        type="button"
        className="sound-toggle-btn"
        aria-pressed={muted}
        aria-label={muted ? "Ligar som" : "Desligar som"}
        title={muted ? "Ligar som" : "Desligar som"}
        onClick={toggleMute}
      >
        <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
      </button>
      <label className="sound-toggle-volume">
        <span className="visually-hidden">Volume</span>
        <input
          id="volume-geral"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          disabled={muted}
          onChange={(e) => setVolume(e.target.value)}
        />
      </label>
    </div>
  );
}

export default SoundToggle;

import "./Narrator.css";

// Título da região com as letras surgindo uma a uma
function Narrator({ text, active, typingSpeed = 110 }) {
  const letters = (text || "").split("");

  return (
    <div className={`narrator-box ${active ? "fade-in" : "fade-out"}`}>
      <p className="narrator-text" aria-label={text}>
        {letters.map((char, i) => (
          <span key={`${text}-${i}`} className="fade-letter" style={{ animationDelay: `${i * typingSpeed}ms` }} aria-hidden="true">
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}

export default Narrator;

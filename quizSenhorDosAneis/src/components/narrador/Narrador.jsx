import React, { useState, useEffect } from "react";
import "./Narrator.css";

function Narrator({ index, active, typingSpeed = 30 }) {
  const [letters, setLetters] = useState([]);

  const narrations = [
    "The Shire",
    "Bri",
    "Rivendell.",
    "Moria.",
    "Lorien.",
    "Argonath",
    "Mordor",
    "Mordor"  
];

  useEffect(() => {
    if (index == null || !narrations[index]) {
      setLetters([]);
      return;
    }

    const fullText = narrations[index].split("");
    setLetters(fullText);
  }, [index]);

  return (
    <div className={`narrator-box ${active ? "fade-in" : "fade-out"}`}>
      <p className="narrator-text">
        {letters.map((char, i) => (
          <span
            key={i}
            className="fade-letter"
            style={{ animationDelay: `${i * typingSpeed}ms` }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}

export default Narrator;

import React, { useState, useEffect } from "react";
import './Narrator.css';

function Narrator({ index, active, typingSpeed = 30 }) {
  const [displayText, setDisplayText] = useState("");

  const narrations = [
    "Os Hobbits partem de Hobbiton, sob a luz suave da manhã.",
    "A estrada velha leva-os por campos verdejantes e bosques silenciosos.",
    "Sombras crescem enquanto se aproximam da floresta de Trollshaws.",
    "Finalmente, chegam a Valfenda, onde Elrond aguarda sua chegada."
  ];

  useEffect(() => {
    if (!active || index == null || !narrations[index]) {
      setDisplayText("");
      return;
    }

    const fullText = narrations[index];
    setDisplayText("");

    let i = 0;

    const typeNextChar = () => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
        setTimeout(typeNextChar, typingSpeed);
      }
    };

    typeNextChar();

    return () => {
      // Limpa qualquer timeout pendente
      i = fullText.length;
    };
  }, [index, active, typingSpeed]);

  return (
    <div className={`narrator-box ${active ? "fade-in" : ""}`}>
      <p className="narrator-text">{displayText}</p>
    </div>
  );
}

export default Narrator;

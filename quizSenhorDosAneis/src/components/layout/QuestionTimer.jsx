import { useEffect, useRef, useState } from "react";

// Contagem regressiva do modo Desafio. Chama onExpire uma única vez ao chegar a zero.
function QuestionTimer({ seconds, running, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setLeft(seconds);
    expired.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && left === 0 && !expired.current) {
      expired.current = true;
      onExpireRef.current?.();
    }
  }, [left, running]);

  return (
    <div className={`question-timer ${left <= 5 ? "urgent" : ""}`} role="timer" aria-live={left <= 5 ? "assertive" : "off"}>
      <span className="timer-icon" aria-hidden="true">⏳</span>
      {left}s
    </div>
  );
}

export default QuestionTimer;

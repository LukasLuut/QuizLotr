// Converte segundos em mm:ss
export const formatarTempo = (segundos) => {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

// Versão demo (VITE_DEMO=true): roda só no navegador, sem login, nível nem ranking.
// A partida e as conquistas ficam no sessionStorage e somem ao fechar o navegador.
export const IS_DEMO = import.meta.env.VITE_DEMO === "true";

// Link do código mostrado na faixa da demo
export const REPO_URL = "https://github.com/LukasLuut/QuizLotr";

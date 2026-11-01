// Fora do modo demo, "@demo" aponta para cá (vite.config.js): o banco de perguntas com as
// respostas (usado por demo/localApi.js) nunca entra no site da versão completa.
export const localApi = null;
export const DEMO_LEVEL = 0;
export const resetDemo = () => {};
export const demoSettings = { short: false };
export const presenter = { correctAnswer: () => null, setCorruption: () => null };

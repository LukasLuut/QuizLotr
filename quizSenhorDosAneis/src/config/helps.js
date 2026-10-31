// Ajudas temáticas (uma de cada por partida; alguns personagens ganham extras).
// Os efeitos são aplicados pela API (POST /rounds/:id/help).
export const HELPS = [
  { code: "conselho", icon: "🧙", name: "Conselho de Gandalf", description: "Elimina duas alternativas erradas." },
  { code: "palantir", icon: "🔮", name: "Visão do Palantír", description: "Mostra como os viajantes responderam." },
  { code: "lembas", icon: "🍞", name: "Lembas", description: "+1 vida no Desafio e alivia a corrupção do Anel." },
  { code: "passolargo", icon: "🥾", name: "Passolargo", description: "Pula a pergunta sem perder pontos nem a sequência." },
];

// Usos restantes de cada ajuda na partida
export const helpsLeft = (round) =>
  Object.fromEntries(HELPS.map((h) => [h.code, (round?.helpsAllowed?.[h.code] ?? 1) - (round?.helpsUsed?.[h.code] ?? 0)]));

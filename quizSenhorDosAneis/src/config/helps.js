// Ajudas temáticas (uma de cada por partida; alguns personagens ganham extras).
// Os efeitos são aplicados pela API (POST /rounds/:id/help).
import lembasIcon from "../assets/icons/lembas.png";
import bootIcon from "../assets/icons/magic-boot.png";
import palantirIcon from "../assets/icons/palantir.png";
import hatIcon from "../assets/icons/witch-hat.png";

export const HELPS = [
  { code: "conselho", icon: hatIcon, name: "Conselho de Gandalf", description: "Elimina duas alternativas erradas." },
  { code: "palantir", icon: palantirIcon, name: "Visão do Palantír", description: "Mostra como os viajantes responderam." },
  { code: "lembas", icon: lembasIcon, name: "Lembas", description: "+1 vida no Desafio e alivia a corrupção do Anel." },
  { code: "passolargo", icon: bootIcon, name: "Passolargo", description: "Pula a pergunta sem perder pontos nem a sequência." },
];

// Usos restantes de cada ajuda na partida
export const helpsLeft = (round) =>
  Object.fromEntries(HELPS.map((h) => [h.code, (round?.helpsAllowed?.[h.code] ?? 1) - (round?.helpsUsed?.[h.code] ?? 0)]));

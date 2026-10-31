// Uma única fonte de verdade para cada região da jornada: nome, título do narrador,
// fundo (vídeo ou imagem) e ambiência. A ordem é a mesma do backend (game/rules.ts)
// e das rotas do mapa (components/Map.jsx).
import bgShire from "../assets/videos/Hobbington.mp4";
import bgBri from "../assets/videos/bri.mp4";
import bgRivendell from "../assets/images/rivendell.webp";
import bgMoria from "../assets/videos/moria.mp4";
import bgLorien from "../assets/videos/lorien.mp4";
import bgArgonath from "../assets/videos/argonath.mp4";
import bgMordor from "../assets/videos/mordor.mp4";
import bgMountDoom from "../assets/videos/destroy-the-ring.mp4";

import bgShirePoster from "../assets/images/posters/Hobbington.jpg";
import bgBriPoster from "../assets/images/posters/bri.jpg";
import bgMoriaPoster from "../assets/images/posters/moria.jpg";
import bgLorienPoster from "../assets/images/posters/lorien.jpg";
import bgArgonathPoster from "../assets/images/posters/argonath.jpg";
import bgMordorPoster from "../assets/images/posters/mordor.jpg";
import bgMountDoomPoster from "../assets/images/posters/destroy-the-ring.jpg";

import shireAmbience from "../assets/audio/ambience/shire-ambience.mp3";
import briAmbience from "../assets/audio/ambience/bri-ambience.mp3";
import rivendellAmbience from "../assets/audio/ambience/rivendell-ambience.mp3";
import moriaAmbience from "../assets/audio/ambience/moria-ambience.mp3";
import lorienAmbience from "../assets/audio/ambience/lorien-ambience.mp3";
import argonathAmbience from "../assets/audio/ambience/argonath-ambience.mp3";
import mordorAmbience from "../assets/audio/ambience/mordor-ambience.mp3";

export const REGIONS = [
  { key: "shire", name: "O Condado", title: "The Shire", background: { type: "video", src: bgShire, poster: bgShirePoster }, ambience: shireAmbience },
  { key: "bri", name: "Bri", title: "Bri", background: { type: "video", src: bgBri, poster: bgBriPoster }, ambience: briAmbience },
  { key: "rivendell", name: "Valfenda", title: "Rivendell", background: { type: "image", src: bgRivendell }, ambience: rivendellAmbience },
  { key: "moria", name: "Moria", title: "Moria", background: { type: "video", src: bgMoria, poster: bgMoriaPoster }, ambience: moriaAmbience },
  { key: "lorien", name: "Lothlórien", title: "Lorien", background: { type: "video", src: bgLorien, poster: bgLorienPoster }, ambience: lorienAmbience },
  { key: "argonath", name: "Argonath", title: "Argonath", background: { type: "video", src: bgArgonath, poster: bgArgonathPoster }, ambience: argonathAmbience },
  { key: "mordor", name: "Mordor", title: "Mordor", background: { type: "video", src: bgMordor, poster: bgMordorPoster }, ambience: mordorAmbience },
  { key: "mountdoom", name: "Montanha da Perdição", title: "Mount Doom", background: { type: "video", src: bgMountDoom, poster: bgMountDoomPoster }, ambience: mordorAmbience },
];

export const regionAt = (index) => REGIONS[Math.min(Math.max(index ?? 0, 0), REGIONS.length - 1)];

export const GAME_MODES = {
  normal: { label: "Jornada", description: "Sem limite de tempo nem de erros." },
  desafio: { label: "Desafio", description: "3 vidas e 20 segundos por pergunta." },
};

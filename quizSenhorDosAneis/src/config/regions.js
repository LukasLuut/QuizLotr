// Uma única fonte de verdade para cada região da jornada: nome, título do narrador,
// fundo (vídeo ou imagem) e ambiência. A ordem é a mesma do backend (game/rules.ts)
// e das rotas do mapa (components/Map.jsx).
import bgShire from "../assets/videos/Hobbington.mp4";
import { IS_DEMO } from "./demo";
import bgBri from "../assets/videos/bri.mp4";
import bgRivendell from "../assets/videos/rivendell.mp4";
import bgMoria from "../assets/videos/moria.mp4";
import bgLorien from "../assets/videos/lorien.mp4";
import bgArgonath from "../assets/videos/argonath.mp4";
import bgMordor from "../assets/videos/mordor.mp4";
import bgMountDoom from "../assets/videos/mountdoom.mp4";
// O Hobbit
import bgGoblinTown from "../assets/images/goblin-town.webp";
import bgTrollshaws from "../assets/videos/trollshaws.mp4";
import bgBeorn from "../assets/videos/beorn.mp4";
import bgMirkwood from "../assets/videos/mirkwood.mp4";
import bgLaketown from "../assets/videos/laketown.mp4";
import bgErebor from "../assets/videos/erebor.mp4";

import bgShirePoster from "../assets/images/posters/Hobbington.jpg";
import bgBriPoster from "../assets/images/posters/bri.jpg";
import bgMoriaPoster from "../assets/images/posters/moria.jpg";
import bgLorienPoster from "../assets/images/posters/lorien.jpg";
import bgArgonathPoster from "../assets/images/posters/argonath.jpg";
import bgMordorPoster from "../assets/images/posters/mordor.jpg";
import bgMountDoomPoster from "../assets/images/posters/mountdoom.jpg";
import bgRivendellPoster from "../assets/images/posters/rivendell.jpg";
import bgTrollshawsPoster from "../assets/images/posters/trollshaws.jpg";
import bgBeornPoster from "../assets/images/posters/beorn.jpg";
import bgMirkwoodPoster from "../assets/images/posters/mirkwood.jpg";
import bgLaketownPoster from "../assets/images/posters/laketown.jpg";
import bgEreborPoster from "../assets/images/posters/erebor.jpg";

import shireAmbience from "../assets/audio/ambience/shire-ambience.mp3";
import briAmbience from "../assets/audio/ambience/bri-ambience.mp3";
import rivendellAmbience from "../assets/audio/ambience/rivendell-ambience.mp3";
import moriaAmbience from "../assets/audio/ambience/moria-ambience.mp3";
import lorienAmbience from "../assets/audio/ambience/lorien-ambience.mp3";
import argonathAmbience from "../assets/audio/ambience/argonath-ambience.mp3";
import mordorAmbience from "../assets/audio/ambience/mordor-ambience.mp3";
// O Hobbit: o áudio dos próprios vídeos de fundo
import trollshawsAmbience from "../assets/audio/ambience/trollshaws-ambience.mp3";
import hobbitRivendellAmbience from "../assets/audio/ambience/hobbit-rivendell-ambience.mp3";
import beornAmbience from "../assets/audio/ambience/beorn-ambience.mp3";
import mirkwoodAmbience from "../assets/audio/ambience/mirkwood-ambience.mp3";
import laketownAmbience from "../assets/audio/ambience/laketown-ambience.mp3";
import ereborAmbience from "../assets/audio/ambience/erebor-ambience.mp3";

export const REGIONS = [
  { key: "shire", name: "O Condado", title: "The Shire", background: { type: "video", src: bgShire, poster: bgShirePoster }, ambience: shireAmbience },
  { key: "bri", name: "Bri", title: "Bri", background: { type: "video", src: bgBri, poster: bgBriPoster }, ambience: briAmbience },
  { key: "rivendell", name: "Valfenda", title: "Rivendell", background: { type: "video", src: bgRivendell, poster: bgRivendellPoster }, ambience: rivendellAmbience },
  { key: "moria", name: "Moria", title: "Moria", background: { type: "video", src: bgMoria, poster: bgMoriaPoster }, ambience: moriaAmbience },
  { key: "lorien", name: "Lothlórien", title: "Lothlórien", background: { type: "video", src: bgLorien, poster: bgLorienPoster }, ambience: lorienAmbience },
  { key: "argonath", name: "Argonath", title: "Argonath", background: { type: "video", src: bgArgonath, poster: bgArgonathPoster }, ambience: argonathAmbience },
  { key: "mordor", name: "Mordor", title: "Mordor", background: { type: "video", src: bgMordor, poster: bgMordorPoster }, ambience: mordorAmbience },
  { key: "mountdoom", name: "Montanha da Perdição", title: "Mount Doom", background: { type: "video", src: bgMountDoom, poster: bgMountDoomPoster }, ambience: mordorAmbience },
  // Jornada bônus "O Hobbit"
  { key: "misty", name: "Montanhas Sombrias", title: "Misty Mountains", background: { type: "image", src: bgGoblinTown }, ambience: moriaAmbience },
  { key: "mirkwood", name: "Floresta das Trevas", title: "Mirkwood", background: { type: "video", src: bgMirkwood, poster: bgMirkwoodPoster }, ambience: mirkwoodAmbience },
  { key: "erebor", name: "Erebor", title: "Erebor", background: { type: "video", src: bgErebor, poster: bgEreborPoster }, ambience: ereborAmbience },
  { key: "hobbit-shire", name: "O Condado", title: "The Shire", background: { type: "video", src: bgShire, poster: bgShirePoster }, ambience: shireAmbience },
  { key: "trollshaws", name: "Bosque dos Trolls", title: "Trollshaws", background: { type: "video", src: bgTrollshaws, poster: bgTrollshawsPoster }, ambience: trollshawsAmbience },
  { key: "hobbit-rivendell", name: "Valfenda", title: "Rivendell", background: { type: "video", src: bgRivendell, poster: bgRivendellPoster }, ambience: hobbitRivendellAmbience },
  { key: "beorn", name: "Casa de Beorn", title: "Beorn's House", background: { type: "video", src: bgBeorn, poster: bgBeornPoster }, ambience: beornAmbience },
  { key: "laketown", name: "Cidade do Lago", title: "Lake-town", background: { type: "video", src: bgLaketown, poster: bgLaketownPoster }, ambience: laketownAmbience },
];

export const regionAt = (index) => REGIONS[Math.min(Math.max(index ?? 0, 0), REGIONS.length - 1)];

// Jornadas: a principal e a bônus, liberada pelo nível do viajante (HOBBIT_UNLOCK_LEVEL no backend)
export const HOBBIT_UNLOCK_LEVEL = 5;
export const JOURNEYS = {
  main: { label: "A Sociedade do Anel", description: "Do Condado à Montanha da Perdição." },
  hobbit: {
    label: "O Hobbit",
    description: `Lá e de volta outra vez: do Condado a Erebor, pelos trolls, gobelins, aranhas e o dragão.${IS_DEMO ? "" : " Fora do ranking."}`,
  },
};

export const GAME_MODES = {
  normal: { label: "Jornada", description: "Sem limite de tempo nem de erros." },
  desafio: { label: "Desafio", description: "3 vidas e 20 segundos por pergunta." },
};

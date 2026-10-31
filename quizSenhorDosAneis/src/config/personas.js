// Personagens disponíveis como foto de perfil. Os códigos, níveis e habilidades são os mesmos
// da API (PERSONA_INFO em retorno-do-dev/src/game/rules.ts): lá ficam os efeitos de verdade,
// aqui só o que aparece na tela. Imagens recortadas no rosto.
import aragorn from "../assets/images/personas/aragorn.webp";
import arwen from "../assets/images/personas/arwen.webp";
import boromir from "../assets/images/personas/boromir.webp";
import frodo from "../assets/images/personas/frodo.webp";
import galadriel from "../assets/images/personas/galadriel.webp";
import gandalf from "../assets/images/personas/gandalf.webp";
import gimli from "../assets/images/personas/gimli.webp";
import legolas from "../assets/images/personas/legolas.webp";
import pippin from "../assets/images/personas/pippin.webp";
import sam from "../assets/images/personas/sam.webp";

// Em ordem de desbloqueio pelo nível do viajante
export const PERSONAS = [
  {
    code: "frodo",
    name: "Frodo",
    src: frodo,
    unlockLevel: 0,
    abilities: [
      { code: "portador", icon: "💍", name: "Portador do Anel", description: "O Anel corrompe 40% menos." },
      { code: "coragem", icon: "✦", name: "Coragem de Hobbit", description: "Acertos com o Anel valem 2,5x." },
    ],
  },
  {
    code: "sam",
    name: "Sam",
    src: sam,
    unlockLevel: 0,
    abilities: [
      { code: "leal", icon: "♥", name: "Coração Leal", description: "+1 vida no modo Desafio." },
      { code: "jardineiro", icon: "❦", name: "Jardineiro do Condado", description: "Toda corrupção cresce 30% mais devagar." },
    ],
  },
  {
    code: "gandalf",
    name: "Gandalf",
    src: gandalf,
    unlockLevel: 0,
    abilities: [
      { code: "istar", icon: "✧", name: "Sabedoria de Istar", description: "+1 Conselho de Gandalf por partida." },
      { code: "anor", icon: "🔥", name: "Chama de Anor", description: "Acertos valem 10% a mais." },
    ],
  },
  {
    code: "pippin",
    name: "Pippin",
    src: pippin,
    unlockLevel: 2,
    abilities: [
      { code: "tuk", icon: "➶", name: "Tolo de um Tûk", description: "+1 Passolargo por partida." },
      { code: "curioso", icon: "◉", name: "Olhar Curioso", description: "+1 Visão do Palantír por partida." },
    ],
  },
  {
    code: "legolas",
    name: "Legolas",
    src: legolas,
    unlockLevel: 4,
    abilities: [
      { code: "olhos", icon: "👁", name: "Olhos de Elfo", description: "+5 s por pergunta no modo Desafio." },
      { code: "flecha", icon: "🏹", name: "Flecha Certeira", description: "Janela do bônus de velocidade 5 s maior." },
    ],
  },
  {
    code: "gimli",
    name: "Gimli",
    src: gimli,
    unlockLevel: 6,
    abilities: [
      { code: "teimosia", icon: "⛰", name: "Teimosia Anã", description: "O 1º erro de cada região não zera a sequência." },
      { code: "durin", icon: "🪓", name: "Machado de Durin", description: "Acertos em Moria e Erebor valem 25% a mais." },
    ],
  },
  {
    code: "aragorn",
    name: "Aragorn",
    src: aragorn,
    unlockLevel: 8,
    abilities: [
      { code: "herdeiro", icon: "👑", name: "Herdeiro de Isildur", description: "A sequência multiplica os pontos até 2,5x." },
      { code: "athelas", icon: "☘", name: "Athelas", description: "+1 Lembas por partida." },
    ],
  },
  {
    code: "boromir",
    name: "Boromir",
    src: boromir,
    unlockLevel: 10,
    abilities: [
      { code: "escudo", icon: "🛡", name: "Escudo de Gondor", description: "O 1º erro da partida não custa vida, pontos nem corrupção." },
      { code: "forca", icon: "⚔", name: "Força de Gondor", description: "Acertos valem 10% a mais." },
    ],
  },
  {
    code: "arwen",
    name: "Arwen",
    src: arwen,
    unlockLevel: 12,
    abilities: [
      { code: "evenstar", icon: "✶", name: "Graça de Evenstar", description: "O Lembas também zera a corrupção." },
      { code: "vau", icon: "🐎", name: "Fuga pelo Vau", description: "+3 s por pergunta no modo Desafio." },
    ],
  },
  {
    code: "galadriel",
    name: "Galadriel",
    src: galadriel,
    unlockLevel: 15,
    abilities: [
      { code: "nenya", icon: "💧", name: "Nenya", description: "O Anel corrompe 50% menos." },
      { code: "earendil", icon: "★", name: "Luz de Eärendil", description: "+1 Conselho de Gandalf por partida." },
    ],
  },
];

// Foto padrão de quem ainda não escolheu
export const DEFAULT_PERSONA = "gandalf";

export const personaAt = (code) => PERSONAS.find((p) => p.code === code) || PERSONAS.find((p) => p.code === DEFAULT_PERSONA);
export const personaSrc = (code) => personaAt(code).src;
export const isUnlocked = (persona, level = 0) => level >= persona.unlockLevel;

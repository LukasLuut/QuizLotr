// Personagens disponíveis como foto de perfil. Os códigos, níveis e habilidades são os mesmos
// da API (PERSONA_INFO em retorno-do-dev/src/game/rules.ts): lá ficam os efeitos de verdade,
// aqui só o que aparece na tela. Imagens recortadas no rosto.
import aragorn from "../assets/images/personas/aragorn.webp";
import frodo from "../assets/images/personas/frodo.webp";
import galadriel from "../assets/images/personas/galadriel.webp";
import gandalf from "../assets/images/personas/gandalf.webp";
import gimli from "../assets/images/personas/gimli.webp";
import legolas from "../assets/images/personas/legolas.webp";
import sam from "../assets/images/personas/sam.webp";
import eowyn from "../assets/images/personas/eowyn.webp";
import saruman from "../assets/images/personas/saruman.webp";
import sauron from "../assets/images/personas/sauron.webp";
// O Hobbit
import balin from "../assets/images/personas/balin.webp";
import bard from "../assets/images/personas/bard.webp";
import bilbo from "../assets/images/personas/bilbo.webp";
import fili from "../assets/images/personas/fili.webp";
import kili from "../assets/images/personas/kili.webp";
import radagast from "../assets/images/personas/radagast.webp";
import thorin from "../assets/images/personas/thorin.webp";
import thranduil from "../assets/images/personas/thranduil.webp";
import azog from "../assets/images/personas/azog.webp";
// Ícones da identidade visual (assets/icons, 48x48 com o mesmo peso visual). "icon" fica
// como símbolo reserva.
import lembasIcon from "../assets/icons/lembas.png";
import bootIcon from "../assets/icons/magic-boot.png";
import ringIcon from "../assets/icons/o-um-anel.png";
import palantirIcon from "../assets/icons/palantir.png";
import hatIcon from "../assets/icons/witch-hat.png";
import arrowIcon from "../assets/icons/flecha.png";
import axeIcon from "../assets/icons/machado.png";
import crownIcon from "../assets/icons/coroa.png";
import elfEyeIcon from "../assets/icons/olho-elfo.png";
import fireIcon from "../assets/icons/fogo.png";
import heartIcon from "../assets/icons/coracao.png";
import helmIcon from "../assets/icons/capacete-anao.png";
import houseIcon from "../assets/icons/casa-hobbit.png";
import nenyaIcon from "../assets/icons/anel-galadriel.png";
import plantIcon from "../assets/icons/planta.png";
import shieldIcon from "../assets/icons/escudo-de-gondor.png";
import horseIcon from "../assets/icons/cavalo.png";

// Em ordem de desbloqueio pelo nível do viajante (Sociedade e O Hobbit intercalados)
export const PERSONAS = [
  {
    code: "frodo",
    name: "Frodo",
    src: frodo,
    journey: "main",
    unlockLevel: 0,
    abilities: [
      { code: "portador", icon: "💍", img: ringIcon, name: "Portador do Anel", description: "O Anel corrompe 40% menos." },
      { code: "coragem", icon: "✦", img: houseIcon, name: "Coragem de Hobbit", description: "Acertos com o Anel valem 2,5x." },
    ],
  },
  {
    code: "sam",
    name: "Sam",
    src: sam,
    journey: "main",
    unlockLevel: 0,
    abilities: [
      { code: "leal", icon: "♥", img: heartIcon, name: "Coração Leal", description: "+1 vida no modo Desafio." },
      { code: "jardineiro", icon: "❦", img: plantIcon, name: "Jardineiro do Condado", description: "Toda corrupção cresce 30% mais devagar." },
    ],
  },
  {
    code: "gandalf",
    name: "Gandalf",
    src: gandalf,
    journey: "main",
    unlockLevel: 0,
    abilities: [
      { code: "istar", icon: "✧", img: hatIcon, name: "Sabedoria de Istar", description: "+1 Conselho de Gandalf por partida." },
      { code: "anor", icon: "🔥", img: fireIcon, name: "Chama de Anor", description: "Acertos valem 10% a mais." },
    ],
  },
  {
    code: "eowyn",
    name: "Éowyn",
    src: eowyn,
    journey: "main",
    unlockLevel: 2,
    abilities: [
      { code: "escudeira", icon: "🛡", img: shieldIcon, name: "Donzela-Escudeira", description: "O 1º erro da partida não custa vida, pontos nem corrupção." },
      { code: "rohirrim", icon: "🐎", img: horseIcon, name: "Cavalga com Rohan", description: "+3 s por pergunta no modo Desafio." },
    ],
  },
  {
    code: "legolas",
    name: "Legolas",
    src: legolas,
    journey: "main",
    unlockLevel: 4,
    abilities: [
      { code: "olhos", icon: "👁", img: elfEyeIcon, name: "Olhos de Elfo", description: "+5 s por pergunta no modo Desafio." },
      { code: "flecha", icon: "🏹", img: arrowIcon, name: "Flecha Certeira", description: "Janela do bônus de velocidade 5 s maior." },
    ],
  },
  {
    code: "bilbo",
    name: "Bilbo",
    src: bilbo,
    journey: "hobbit",
    unlockLevel: 5,
    abilities: [
      { code: "achado", icon: "💍", img: ringIcon, name: "Achado no Escuro", description: "O Anel corrompe 30% menos." },
      { code: "enigmas", icon: "◉", img: palantirIcon, name: "Enigmas no Escuro", description: "+1 Visão do Palantír por partida." },
    ],
  },
  {
    code: "gandalf-hobbit",
    name: "Gandalf",
    src: gandalf,
    journey: "hobbit",
    unlockLevel: 5,
    abilities: [
      { code: "pinhas", icon: "🔥", img: fireIcon, name: "Pinhas em Chamas", description: "Acertos nas Montanhas Sombrias valem 50% a mais." },
      { code: "cinzento", icon: "✧", img: hatIcon, name: "O Cinzento", description: "+1 Conselho de Gandalf por partida." },
    ],
  },
  {
    code: "gimli",
    name: "Gimli",
    src: gimli,
    journey: "main",
    unlockLevel: 6,
    abilities: [
      { code: "teimosia", icon: "⛰", img: helmIcon, name: "Teimosia Anã", description: "O 1º erro de cada região não zera a sequência." },
      { code: "durin", icon: "🪓", img: axeIcon, name: "Machado de Durin", description: "Acertos em Moria e Erebor valem 25% a mais." },
    ],
  },
  {
    code: "balin",
    name: "Balin",
    src: balin,
    journey: "hobbit",
    unlockLevel: 7,
    abilities: [
      { code: "conselheiro", icon: "✧", img: hatIcon, name: "Conselheiro de Thorin", description: "+1 Conselho de Gandalf por partida." },
      { code: "mazarbul", icon: "⛰", img: helmIcon, name: "Livro de Mazarbul", description: "Acertos em Moria valem 30% a mais." },
    ],
  },
  {
    code: "aragorn",
    name: "Aragorn",
    src: aragorn,
    journey: "main",
    unlockLevel: 8,
    abilities: [
      { code: "herdeiro", icon: "👑", img: crownIcon, name: "Herdeiro de Isildur", description: "A sequência multiplica os pontos até 2,5x." },
      { code: "athelas", icon: "☘", img: lembasIcon, name: "Athelas", description: "+1 Lembas por partida." },
    ],
  },
  {
    code: "kili",
    name: "Kíli",
    src: kili,
    journey: "hobbit",
    unlockLevel: 9,
    abilities: [
      { code: "arqueiro", icon: "🏹", img: arrowIcon, name: "Arqueiro Anão", description: "+3 s por pergunta no modo Desafio." },
      { code: "jovem", icon: "♥", img: heartIcon, name: "Coragem Jovem", description: "O 1º erro de cada região não zera a sequência." },
    ],
  },
  {
    code: "saruman",
    name: "Saruman",
    src: saruman,
    journey: "main",
    unlockLevel: 10,
    abilities: [
      { code: "palantir-orthanc", icon: "◉", img: palantirIcon, name: "Palantír de Orthanc", description: "+1 Visão do Palantír por partida." },
      { code: "cobica", icon: "🔥", img: fireIcon, name: "Cobiça de Isengard", description: "Acertos valem 20% a mais, mas a corrupção cresce 20% mais." },
    ],
  },
  {
    code: "fili",
    name: "Fíli",
    src: fili,
    journey: "hobbit",
    unlockLevel: 11,
    abilities: [
      { code: "laminas", icon: "🪓", img: axeIcon, name: "Lâminas Gêmeas", description: "Acertos valem 10% a mais." },
      { code: "irmao", icon: "🛡", img: shieldIcon, name: "Irmão de Escudo", description: "O 1º erro da partida não custa vida, pontos nem corrupção." },
    ],
  },
  {
    code: "bard",
    name: "Bard",
    src: bard,
    journey: "hobbit",
    unlockLevel: 13,
    abilities: [
      { code: "flechanegra", icon: "🏹", img: arrowIcon, name: "Flecha Negra", description: "Janela do bônus de velocidade 8 s maior." },
      { code: "barqueiro", icon: "➶", img: bootIcon, name: "Barqueiro do Lago", description: "+1 Passolargo por partida." },
    ],
  },
  {
    code: "galadriel",
    name: "Galadriel",
    src: galadriel,
    journey: "main",
    unlockLevel: 15,
    abilities: [
      { code: "nenya", icon: "💧", img: nenyaIcon, name: "Nenya", description: "O Anel corrompe 50% menos." },
      { code: "earendil", icon: "★", img: hatIcon, name: "Luz de Eärendil", description: "+1 Conselho de Gandalf por partida." },
    ],
  },
  {
    code: "radagast",
    name: "Radagast",
    src: radagast,
    journey: "hobbit",
    unlockLevel: 16,
    abilities: [
      { code: "bichos", icon: "❦", img: plantIcon, name: "Amigo dos Bichos", description: "Toda corrupção cresce 25% mais devagar." },
      { code: "rhosgobel", icon: "☘", img: lembasIcon, name: "Coelhos de Rhosgobel", description: "+1 Lembas por partida." },
    ],
  },
  {
    code: "thranduil",
    name: "Thranduil",
    src: thranduil,
    journey: "hobbit",
    unlockLevel: 18,
    abilities: [
      { code: "reifloresta", icon: "👑", img: crownIcon, name: "Rei da Floresta", description: "Acertos na Floresta das Trevas valem 50% a mais." },
      { code: "imortal", icon: "👁", img: elfEyeIcon, name: "Elfo Imortal", description: "+4 s por pergunta no modo Desafio." },
    ],
  },
  {
    code: "thorin",
    name: "Thorin",
    src: thorin,
    journey: "hobbit",
    unlockLevel: 20,
    abilities: [
      { code: "reimontanha", icon: "👑", img: crownIcon, name: "Rei sob a Montanha", description: "Acertos em Erebor valem 50% a mais." },
      { code: "orcrist", icon: "⚔", img: fireIcon, name: "Orcrist", description: "Acertos valem 15% a mais." },
    ],
  },
  {
    code: "sauron",
    name: "Sauron",
    src: sauron,
    journey: "main",
    unlockLevel: 22,
    abilities: [
      { code: "senhor-do-anel", icon: "💍", img: ringIcon, name: "Senhor do Anel", description: "Acertos com o Anel valem 3x, e ele corrompe 70% menos." },
      { code: "olho", icon: "👁", img: elfEyeIcon, name: "O Olho Sem Pálpebra", description: "+1 Visão do Palantír por partida." },
    ],
  },
  {
    code: "azog",
    name: "Azog",
    src: azog,
    journey: "hobbit",
    unlockLevel: 24,
    abilities: [
      { code: "profanador", icon: "🪓", img: axeIcon, name: "O Profanador", description: "Acertos valem 25% a mais, mas a corrupção cresce 30% mais." },
      { code: "warg", icon: "🐺", img: horseIcon, name: "Caçador de Warg", description: "Janela do bônus de velocidade 6 s maior." },
    ],
  },
];

// Foto padrão de quem ainda não escolheu
export const DEFAULT_PERSONA = "gandalf";

export const personaAt = (code) => PERSONAS.find((p) => p.code === code) || PERSONAS.find((p) => p.code === DEFAULT_PERSONA);
export const personaSrc = (code) => personaAt(code).src;
export const isUnlocked = (persona, level = 0) => level >= persona.unlockLevel;
// Personagens de cada jornada e o padrão dela (mesmas regras da API)
export const JOURNEY_DEFAULT_PERSONA = { main: "gandalf", hobbit: "bilbo" };
export const personasOf = (journey) => PERSONAS.filter((p) => p.journey === journey);

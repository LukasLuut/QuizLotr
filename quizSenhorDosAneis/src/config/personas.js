// Personagens disponíveis como foto de perfil. Os códigos são os mesmos validados pela
// API (PERSONAS em retorno-do-dev/src/game/rules.ts). Imagens recortadas no rosto.
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

export const PERSONAS = [
  { code: "frodo", name: "Frodo", src: frodo },
  { code: "sam", name: "Sam", src: sam },
  { code: "pippin", name: "Pippin", src: pippin },
  { code: "gandalf", name: "Gandalf", src: gandalf },
  { code: "aragorn", name: "Aragorn", src: aragorn },
  { code: "legolas", name: "Legolas", src: legolas },
  { code: "gimli", name: "Gimli", src: gimli },
  { code: "boromir", name: "Boromir", src: boromir },
  { code: "arwen", name: "Arwen", src: arwen },
  { code: "galadriel", name: "Galadriel", src: galadriel },
];

// Foto padrão de quem ainda não escolheu
export const DEFAULT_PERSONA = "gandalf";

export const personaSrc = (code) => (PERSONAS.find((p) => p.code === code) || PERSONAS.find((p) => p.code === DEFAULT_PERSONA)).src;

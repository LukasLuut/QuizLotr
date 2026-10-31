import borderProfile from "../assets/images/perfil-border.webp";
import { personaSrc } from "../config/personas";
import "./Avatar.css";

// Foto do jogador (um dos personagens) dentro da moldura dourada; sem escolha, Gandalf
function Avatar({ persona, name, className = "" }) {
  return (
    <span className={`avatar ${className}`.trim()}>
      <img className="avatar-photo" src={personaSrc(persona)} alt={name ? `Foto de ${name}` : ""} />
      <img className="avatar-border" src={borderProfile} alt="" />
    </span>
  );
}

export default Avatar;

import gandalf from "../assets/images/Gandalf.jpg";
import borderProfile from "../assets/images/perfil-border.webp";
import "./Avatar.css";

// Foto do jogador dentro da moldura dourada; sem foto, usa o retrato de Gandalf
function Avatar({ src, name, className = "" }) {
  return (
    <span className={`avatar ${className}`.trim()}>
      <img className="avatar-photo" src={src || gandalf} alt={name ? `Foto de ${name}` : ""} />
      <img className="avatar-border" src={borderProfile} alt="" />
    </span>
  );
}

export default Avatar;

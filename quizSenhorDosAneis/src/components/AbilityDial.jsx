import "./AbilityDial.css";
import AbilityIcon from "./AbilityIcon";

/**
 * Habilidades do personagem em "speed dial" (como o "⋯" do Luut Automator, speed_dial.py):
 * fica dentro de um elemento com a classe "dial-host" (a foto); com "dial-open" no host,
 * as opções saem de trás da foto e assentam ao lado dela ("dial-left": do lado esquerdo).
 */
function AbilityDial({ abilities, open, id }) {
  return (
    <ul id={id} className="ability-dial" style={{ "--n": abilities.length }} aria-hidden={!open}>
      {abilities.map((a, i) => (
        <li key={a.code} className="ability-box" style={{ "--i": i }}>
          <span className="ability-icon" aria-hidden="true">
            <AbilityIcon ability={a} />
          </span>
          <span className="ability-text">
            <span className="ability-name">{a.name}</span>
            <span className="ability-desc">{a.description}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default AbilityDial;

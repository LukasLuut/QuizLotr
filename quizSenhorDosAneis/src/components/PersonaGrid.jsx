import Avatar from "./Avatar";
import AbilityIcon from "./AbilityIcon";
import AbilityDial from "./AbilityDial";
import { isUnlocked } from "../config/personas";

/**
 * Grade de personagens (foto, nome, ícones das habilidades ou o nível que libera).
 * Usada na foto do perfil e na escolha do personagem do novo jogo.
 * dialFor: código do personagem com as habilidades abertas ao lado da foto (AbilityDial);
 * sem a prop (undefined), a grade não tem dial; null = dial fechado.
 * nas duas últimas colunas (de 5) elas abrem para a esquerda.
 */
const COLUMNS = 5;

function PersonaGrid({ personas, level = 0, selected, onPick, disabled = false, labelledBy, dialFor }) {
  return (
    <div className="persona-options" role="radiogroup" aria-labelledby={labelledBy}>
      {personas.map((p, index) => {
        const locked = !isUnlocked(p, level);
        const abilities = p.abilities.map((a) => `${a.name}: ${a.description}`).join(" · ");
        const dialOpen = dialFor === p.code;
        const left = index % COLUMNS >= COLUMNS - 2;
        return (
          <button
            key={p.code}
            type="button"
            role="radio"
            aria-checked={selected === p.code}
            className={`persona-option ${selected === p.code ? "selected" : ""} ${locked ? "locked" : ""} ${dialOpen ? "dial-shown" : ""}`}
            onClick={() => onPick(p.code)}
            disabled={disabled || locked}
            title={locked ? `Abre no nível ${p.unlockLevel}` : abilities}
            aria-label={`${p.name}${locked ? ` (abre no nível ${p.unlockLevel})` : ""}. ${abilities}`}
          >
            {dialFor === undefined ? (
              <Avatar persona={p.code} />
            ) : (
              <span className={`dial-host ${left ? "dial-left" : ""} ${dialOpen ? "dial-open" : ""}`}>
                <Avatar persona={p.code} />
                <AbilityDial abilities={p.abilities} open={dialOpen} />
              </span>
            )}
            <span className="persona-name">{p.name}</span>
            <span className="persona-abilities" aria-hidden="true">
              {locked ? `🔒 Nível ${p.unlockLevel}` : p.abilities.map((a) => <AbilityIcon key={a.code} ability={a} />)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default PersonaGrid;

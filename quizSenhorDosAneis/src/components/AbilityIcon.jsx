// Ícone de uma habilidade: o PNG da identidade visual (assets/icons) quando já existe,
// senão o símbolo provisório
function AbilityIcon({ ability, className = "" }) {
  if (ability.img) return <img className={`ability-img ${className}`.trim()} src={ability.img} alt="" />;
  return <span className={className || undefined}>{ability.icon}</span>;
}

export default AbilityIcon;

import React from 'react'
import BtnQuestion from './buttons/btnQuestion'
import imgTemCerteza from '../assets/images/box/box-lateral-girado.png'
import './TemCerteza.css'

/**
 * Componente de confirmação genérico
 * Pode ser usado em qualquer lugar do app para confirmar ações críticas.
 *
 * Props:
 * - isOpen: controla se o modal aparece ou não
 * - mensagem: texto de aviso (default = "Você tem certeza?")
 * - onConfirm: callback quando o usuário clicar em "Sim"
 * - onCancel: callback quando o usuário clicar em "Não"
 */
function Confirmacao({ isOpen, mensagem = "Você tem certeza?", onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        {/* Caixa de fundo decorativa */}
        <img src={imgTemCerteza} alt="Confirmação" />

        {/* Texto de aviso */}
        <h1>{mensagem}</h1>

        {/* Botões */}
        <div className="box-btn-tem-certeza">
          <BtnQuestion className="sim" w={150} h={60} texto="Sim" resposta={true} onClick={onConfirm} />
          <BtnQuestion className="nao"  w={150} h={60} texto="Não" resposta={false} onClick={onCancel} />
        </div>
      </div>
    </div>
  )
}

export default Confirmacao

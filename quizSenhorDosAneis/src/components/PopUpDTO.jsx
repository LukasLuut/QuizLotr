import React, { useEffect, useState } from 'react'
import './PopUpDTO.css'
import imgBoxDTO from '../assets/images/box/box-aviso-g.png'

function PopUpDTO({ erro, isOpen, onClose }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAnimate(true)
    } else if (animate) {
      // Delay para esperar a animação de saída antes de desmontar
      const timer = setTimeout(() => setAnimate(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !animate) return null

  return (
    <div className={`pop-up-dto ${isOpen ? 'enter' : 'exit'}`}>
      <img src={imgBoxDTO} alt="" />
      <div className="box-txt-DTO">
        <h1>Atenção!</h1>
        <h2>{erro}</h2>
      </div>
    </div>
  )
}

export default PopUpDTO

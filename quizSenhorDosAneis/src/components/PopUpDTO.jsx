import React from 'react'
import './PopUpDTO.css'
import imgBoxDTO from '../assets/images/box/box-aviso-g.png'
function PopUpDTO() {
  return (
    <div className='pop-up-dto'>
        <img src={imgBoxDTO} alt="" />
        <div className='box-txt-DTO'>
            <h1>Atenção!</h1>
            <h2>Senha deve conter pelo menos um caractere especial@$!%*?&---</h2>
        </div>        
    </div>
  )
}

export default PopUpDTO
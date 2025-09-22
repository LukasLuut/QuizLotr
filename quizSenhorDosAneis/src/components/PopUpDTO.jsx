import React from 'react'
import './PopUpDTO.css'
import imgBoxDTO from '../assets/images/box/box-aviso-g.png'
function PopUpDTO({erro}) {
  return (
    <div className='pop-up-dto'>
        <img src={imgBoxDTO} alt="" />
        <div className='box-txt-DTO'>
            <h1>Atenção!</h1>
            <h2>{erro}</h2>
        </div>
        
    </div>
  )
}

export default PopUpDTO
import React from 'react'
import './Menu.css'
import bgMenu from '../../assets/images/box/box-lateral.png'
import BtnMenu from '../buttons/BtnMenu'


function Menu() {
  return (
    <div className='box-menu'>
        <img src={bgMenu} alt="" />
        <h1>Menu</h1>
        <div className='box-btn'>
            <BtnMenu texto='Continuar'></BtnMenu>
            <BtnMenu texto='Reiniciar'></BtnMenu>
            <BtnMenu texto='Salvar'></BtnMenu>
            <BtnMenu texto='Sair'></BtnMenu>
        </div>
       
    </div>
  )
}

export default Menu
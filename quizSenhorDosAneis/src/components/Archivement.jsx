import React from 'react'
import './Archivement.css'
import boxArchivement from '../assets/images/box/box-conquista.png'

function Archivement() {
  return (
    <div className='archivement-box'>
        <img src={boxArchivement} alt="" />
        <h1>ConquistA</h1>
        <h2>Parabéns!<br></br> titulo conquistado:
        <br></br>
        <span>
              
        </span></h2>
        <span>Queimador de anel</span>
    </div>
  )
}

export default Archivement
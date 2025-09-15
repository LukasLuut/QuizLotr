import React from 'react'
import './btnMenu.css'
function BtnMenu(props) {
  return (
    <button className='btn-menu' > <p className='txt-btn'>{props.texto}</p></button>
  )
}

export default BtnMenu
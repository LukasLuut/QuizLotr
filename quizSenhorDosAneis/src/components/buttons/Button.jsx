import React from 'react'
import './Button.css'

function Button(props) {
  // let handle = props.handleEntrarClick();


  return (
    <button type="submit" className="btn" onClick={(e) => {
      e.preventDefault();
      if(props.texto == "Entrar") { 
        props.handleEntrarClick();
      } else {
        props.handleRegistrarClick();
      }}}>
            <p>{props.texto}</p>
          </button>
  )
}

export default Button
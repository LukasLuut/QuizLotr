import React from 'react'
import './Button.css'

function Button(props) {
  return (
    <button type="submit" className="btn">
            <p>{props.texto}</p>
          </button>
  )
}

export default Button
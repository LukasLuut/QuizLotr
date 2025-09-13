import React from 'react'
import "./Start.css"
import circleOneRing from '../assets/images/circleOneRing.png'
import circleOneRing2 from '../assets/images/circleOneRing2.png'
import lordOfTheRings from '../assets/images/lordOfTheRings.png'

function Start() {
  return (
    <div className='bg'>
      <div className="loader__container">
        {/*Aqui e o titulo*/}
        <img src={lordOfTheRings} alt="Lord of the Rings" />


        <div className='rings'>
            <div className="loader__ring">
              {/*Aqui estão as imagens da inscrição em elfico*/}
              <img className="loader__inscription" src={circleOneRing} alt="The One Ring Inscription" />
              <img className="loader__inscription loader__inscription2" src={circleOneRing2} alt="The One Ring Inscription" />
            </div>

              {/*Aqui estou criando um circulo*/}
              <svg viewBox="0 0 300 300">
              <defs>
                <path
                  id="circlePath"
                  d="
                    M 150, 150
                    m -120,0
                    a 120,120 0 1,1 240,0
                    a 120,120 0 1,1 -240,0
                  "
                />
              </defs>
                {/*Aqui está o texto que ficará no circulo */}
              <text className="circle-text">
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" textLength="750" lengthAdjust="spacingAndGlyphs">
                  "One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them."
                </textPath>
              </text>
            </svg>
            <h2 className='btn-start'>INICIAR</h2>
        </div>
      </div>
    </div>
  )
}

export default Start

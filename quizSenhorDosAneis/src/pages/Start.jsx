import React from 'react'
import "./Start.css"
import circleOneRing from '../assets/images/circleOneRing.png'
import circleOneRing2 from '../assets/images/circleOneRing2.png'
import lordOfTheRings from '../assets/images/lordOfTheRings.png'


function Start() {
  return (
    <div className='bg'>
        <div class="loader__container">
            <img src={lordOfTheRings} alt=" title: Lord of the Rings" />
            <img class="loader__inscription" src={circleOneRing} alt="The One Ring Inscription" />
            <img class="loader__inscription loader__inscription2" src={circleOneRing2} alt="The One Ring Inscription" />
            <h2 className='btn-start'>INICIAR</h2>
            
        </div>

            
        
    </div>
  )
}

export default Start
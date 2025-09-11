import React from 'react'
import './Profile.css'
import windowPerfil from '../assets/images/window.png'
import Map from '../components/Map'


function Profile() {
  return (
    <div className='body-container-profile'>
        <div className='profile-container'> 

          <div className='portrait-container'>
            <img className='window-perfil' src={windowPerfil} alt="foto de perfil" />
          </div> 

          <div className='stone-container'></div>  

        </div>
        <div className='map-container'>
          <Map></Map>
        </div>

    </div>
  )
}

export default Profile
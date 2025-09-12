import React from 'react'
import './Profile.css'
import windowPerfil from '../assets/images/window.png'
import Map from '../components/Map'
import bgVideo2 from "../assets/videos/the-shire.mp4";
import flag from "../assets/images/scroll.png"


function Profile() {
  return (
    <div className='body-container-profile'>
       {/* <div className='profile-container'> 

          <div className='portrait-container'>
            <img className='window-perfil' src={windowPerfil} alt="foto de perfil" />
          </div> 

          <div className='stone-container'></div>  

        </div>
        <div className='map-container'>
          <Map></Map>
        </div>*/}
        <div className='profile-container'>
          <div className='flag-profile'>
            <img className='flagg' src={flag} alt="" />
          </div>

        </div>
        <video className="bg-video" autoPlay muted loop playsInline >
        <source src={bgVideo2} type="video/mp4" />
      </video>
    </div>
    
  )
}

export default Profile
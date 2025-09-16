import React from 'react'
import './Profile.css'
import Map from '../components/Map'
import bgVideo2 from "../assets/videos/Boromir.mp4";
import flag from "../assets/images/scroll.png"
import BtnMenu from '../components/buttons/BtnMenu';
import borderProfile from '../assets/images/perfil-border.png'
import gandalf from '../assets/images/Gandalf.jpg'
import bgVideo3 from "../assets/videos/EyeOfSauron.mp4";

function Profile() {
  
  
  
  return (
    <div className='body-container-profile'>
      <div className='profile-container'>
        <div className='flag-profile'>
          <img className='flagg' src={flag} alt=""/>
          <img className='border-profile' src={borderProfile} alt="" />
          <img className='img-profile' src={gandalf} alt="" />
          {/* <video  className="img-profile" autoPlay muted loop playsInline>
            <source src={bgVideo3} type="video/mp4" />
          </video> */}
          <div className='btn-box'> 
            <BtnMenu texto='New Game'></BtnMenu>            
            <BtnMenu texto='Continue'></BtnMenu>
            <BtnMenu texto='Logout'></BtnMenu>
          </div>
        </div>
      </div>

      <video  className="bg-video" autoPlay muted loop playsInline>
        <source src={bgVideo2} type="video/mp4" />
      </video>

      
    </div>
  )
}

export default Profile

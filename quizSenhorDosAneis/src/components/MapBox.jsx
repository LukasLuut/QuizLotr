import './MapBox.css'
import Map from '../components/Map'
import BoxMap from '../assets/images/map-box.png'

import React from 'react'
import MapLocation from './MapLocation'

function MapBox() {
  return (
    <div className="map-component">
            <div className="box-map">  
              <MapLocation className="the-map"></MapLocation>
            </div>
            <img className="border-map" src={BoxMap} alt="" />
          </div>
  )
}

export default MapBox
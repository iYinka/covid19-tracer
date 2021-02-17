import React from 'react'
import { Map as Leaflet, TileLayer } from "react-leaflet"
import './Map.css'
import { showDataOnMap } from './util';

function Map({countries, casesType, center, zoom}) {
  return (
    <div className="map">
      <Leaflet
        center={center}
        zoom={zoom}
      >
        <TileLayer 
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through countries and draw circles on the screen */}
        {showDataOnMap(countries, casesType)}
      </Leaflet>
    </div>
  )
}

export default Map;

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const carIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007bff" width="32" height="32">
      <text x="12" y="16" text-anchor="middle" font-size="20" fill="#007bff">🚗</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

const stationIcon = (available) => new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="11" fill="${available ? '#28a745' : '#dc3545'}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="16" fill="white">⚡</text>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14]
})

const LeafletMap = ({ userLocation, stations, selectedCar }) => {
  const calculateDistance = (station) => {
    if (!userLocation) return 0
    const R = 6371
    const dLat = (station.latitude - userLocation.latitude) * Math.PI / 180
    const dLon = (station.longitude - userLocation.longitude) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(station.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const formatDistance = (distance) => {
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
  }

  const openDirections = (station) => {
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${station.latitude},${station.longitude}`
    window.open(url, '_blank')
  }

  if (!userLocation) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
        <p>Getting your location...</p>
      </div>
    )
  }

  return (
    <MapContainer 
      center={[userLocation.latitude, userLocation.longitude]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* User Location */}
      <Marker position={[userLocation.latitude, userLocation.longitude]} icon={carIcon}>
        <Popup>
          <div>
            <strong>🚗 Your Location</strong><br/>
            {selectedCar && (
              <>
                {selectedCar.brand} {selectedCar.model}<br/>
                Battery: {selectedCar.currentBatteryPercentage}%
              </>
            )}
          </div>
        </Popup>
      </Marker>
      
 
      {stations.map((station) => {
        const distance = calculateDistance(station)
        
        return (
          <Marker 
            key={station.id}
            position={[station.latitude, station.longitude]} 
            icon={stationIcon(station.availableSlots > 0)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>⚡ {station.name}</strong><br/>
                <small>{station.address}</small><br/>
                <span className={`badge bg-${station.availableSlots > 0 ? 'success' : 'danger'}`}>
                  {station.availableSlots}/{station.totalSlots} slots
                </span><br/>
                <small>{station.chargerType} - {station.chargingPower}</small><br/>
                <strong>₹{station.pricePerHour}/hr</strong><br/>
                <small>Distance: {formatDistance(distance)}</small><br/>
                <button 
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => openDirections(station)}
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default LeafletMap
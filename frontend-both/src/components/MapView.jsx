import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Car icon for user location
const carIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#007bff" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="16" fill="white">🚗</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Charging station icon with ⚡ symbol
const chargingIcon = (available = true) => new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="13" fill="${available ? '#28a745' : '#dc3545'}" stroke="white" stroke-width="2"/>
      <text x="14" y="18" text-anchor="middle" font-size="16" fill="white">⚡</text>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const MapView = ({ center, filters }) => {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(center);

  useEffect(() => {
    // Watch user location changes
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    // Mock charging station data
    const mockStations = [
      {
        id: 1,
        name: "Downtown Charging Hub",
        lat: center.lat + 0.01,
        lng: center.lng + 0.01,
        speed: "fast",
        availability: "available",
        connector: "ccs",
        price: "$0.35/kWh"
      },
      {
        id: 2,
        name: "Mall Parking Charger",
        lat: center.lat - 0.015,
        lng: center.lng + 0.02,
        speed: "standard",
        availability: "busy",
        connector: "type2",
        price: "$0.25/kWh"
      },
      {
        id: 3,
        name: "Highway Rest Stop",
        lat: center.lat + 0.02,
        lng: center.lng - 0.01,
        speed: "fast",
        availability: "available",
        connector: "chademo",
        price: "$0.40/kWh"
      }
    ];

    // Filter stations based on current filters
    const filteredStations = mockStations.filter(station => {
      if (filters.speed !== 'all' && station.speed !== filters.speed) return false;
      if (filters.availability !== 'all' && station.availability !== filters.availability) return false;
      if (filters.connector !== 'all' && station.connector !== filters.connector) return false;
      return true;
    });

    setStations(filteredStations);
  }, [center, filters]);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Location Marker */}
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={carIcon}
      >
        <Popup className="custom-popup">
          <div className="station-popup">
            <h4>🚗 Your Location</h4>
            <p>This is where you are currently located</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Charging Station Markers */}
      {stations.map(station => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={chargingIcon(station.availability === 'available')}
        >
          <Popup className="custom-popup">
            <div className="station-popup">
              <h4>{station.name}</h4>
              <p><strong>Speed:</strong> {station.speed === 'fast' ? 'Fast (50kW+)' : 'Standard (7-22kW)'}</p>
              <p><strong>Status:</strong> <span className={`status ${station.availability}`}>{station.availability}</span></p>
              <p><strong>Price:</strong> {station.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
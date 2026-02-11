import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants/apiConstants';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


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


const chargingIcon = (isReachableAndAvailable = true, isReachable = true, isAvailable = true) => {
  let color = '#dc3545';

  if (isReachableAndAvailable) {
    color = '#28a745';
  } else if (isReachable && !isAvailable) {
    color = '#ffc107';
  } else if (!isReachable) {
    color = '#6c757d';
  }

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="13" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="14" y="18" text-anchor="middle" font-size="16" fill="white">⚡</text>
      </svg>
    `),
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const InteractiveMap = ({ filters, userRange, vehicleData }) => {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 19.0760, lng: 72.8777 });
  const [loading, setLoading] = useState(true);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    const fetchStations = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/stations`);
        const data = await response.json();

        if (data.stations) {

          const apiStations = data.stations.map(station => {
            const distance = userLocation ? calculateDistance(
              userLocation.lat, userLocation.lng,
              station.latitude, station.longitude
            ) : 0;

            const isReachable = userRange > 0 ? distance <= userRange : true;
            const isAvailable = station.availableSlots > 0;

            return {
              id: station.id,
              name: station.name,
              lat: station.latitude,
              lng: station.longitude,
              availability: isAvailable ? 'available' : 'busy',
              connector: station.connectorTypes?.[0]?.toLowerCase() || 'ccs',
              price: `₹${station.pricePerKwh}/kWh`,
              availableSlots: station.availableSlots,
              totalSlots: station.totalSlots,
              distance: distance,
              address: station.address,
              powerOutput: station.powerOutput,
              operatingHours: station.operatingHours,
              amenities: station.amenities || [],
              isReachable: isReachable,
              priority: isReachable && isAvailable ? 1 : isReachable ? 2 : 3
            };
          });

          let filteredStations = apiStations;

          if (filters.status !== 'all') {
            filteredStations = filteredStations.filter(station => {
              if (filters.status === 'available') return station.availableSlots > 0;
              if (filters.status === 'busy') return station.availableSlots === 0;
              if (filters.status === 'maintenance') return station.status === 'Maintenance';
              return true;
            });
          }

          if (filters.connector !== 'all') {
            filteredStations = filteredStations.filter(station => station.connector === filters.connector);
          }

          filteredStations.sort((a, b) => {
            if (a.priority !== b.priority) {
              return a.priority - b.priority;
            }
            return a.distance - b.distance;
          });

          setStations(filteredStations);
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
        setStations([]);
      }
    };

    if (!loading) {
      fetchStations();
    }
  }, [filters, userRange, userLocation, loading]);

  if (loading) {
    return (
      <div className="map-loading">
        <div className="skeleton map-skeleton" style={{ height: '500px' }}></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={12}
      style={{ height: '500px', width: '100%' }}
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={carIcon}
      >
        <Popup>
          <div className="station-popup">
            <h4>🚗 Your Location</h4>
            {userRange > 0 && <p>Range: {userRange} km</p>}
          </div>
        </Popup>
      </Marker>

      {stations.map(station => (
        <Marker
          key={station.id}
          position={[station.lat, station.lng]}
          icon={chargingIcon(
            station.isReachable && station.availableSlots > 0,
            station.isReachable,
            station.availableSlots > 0
          )}
        >
          <Popup>
            <div className="station-popup">
              <h4>{station.name}</h4>
              <p><strong>Available:</strong> {station.availableSlots}/{station.totalSlots} slots</p>
              <p><strong>Distance:</strong> {station.distance} km</p>
              <p><strong>Price:</strong> {station.price}</p>
              <p><strong>Connector:</strong> {station.connector.toUpperCase()}</p>
              {!station.isReachable && (
                <p style={{ color: 'red' }}><strong>⚠️ Out of Range</strong></p>
              )}
              {station.availableSlots === 0 && (
                <p style={{ color: 'orange' }}><strong>🚫 Fully Booked</strong></p>
              )}
              {station.isReachable && station.availableSlots > 0 && (
                <p style={{ color: 'green' }}><strong>✅ Recommended</strong></p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;

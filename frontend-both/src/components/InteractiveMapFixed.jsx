import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Card, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';
import './razorpay-custom.css';
import { emailService } from '../services/emailService';
import { stationService } from '../services/stationService';

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

// Charging station icon with different colors for status
const chargingIcon = (isReachableAndAvailable = true, isReachable = true, isAvailable = true) => {
  let color = '#dc3545'; // Red for unreachable/unavailable
  
  if (isReachableAndAvailable) {
    color = '#28a745'; // Green for reachable and available (recommended)
  } else if (isReachable && !isAvailable) {
    color = '#ffc107'; // Yellow for reachable but booked
  } else if (!isReachable) {
    color = '#6c757d'; // Gray for out of range
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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    duration: 1,
    paymentMethod: 'Card'
  });
  const [dateError, setDateError] = useState('');

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Validate date selection
  const validateDate = (selectedDate) => {
    const today = new Date();
    const selected = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    if (selected < today) {
      setDateError('Cannot select past dates. Please choose today or a future date.');
      return false;
    } else {
      setDateError('');
      return true;
    }
  };
  const mapRef = useRef();

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          if (mapRef.current) {
            mapRef.current.setView([newLocation.lat, newLocation.lng], 15);
          }
        },
        (error) => {
          alert('Unable to get your location');
        }
      );
    }
  };

  const handleBookStation = (station) => {
    // Check if vehicle is selected
    if (!vehicleData?.model) {
      alert('Please select your vehicle first to book a charging slot.');
      return;
    }
    setSelectedStation(station);
    setShowBookingModal(true);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    
    // Check if selected date is today
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    let startHour, startMinute;
    
    if (isToday) {
      // For today, start from next 10-minute slot
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const nextSlotMinutes = Math.ceil((currentMinutes + 10) / 10) * 10;
      startHour = Math.floor(nextSlotMinutes / 60);
      startMinute = nextSlotMinutes % 60;
      
      // If past 22:00, no slots available
      if (startHour >= 22) {
        return [];
      }
    } else {
      // For future dates, start from 6:00 AM
      startHour = 6;
      startMinute = 0;
    }
    
    // Generate 10-minute slots from start time to 22:00
    for (let hour = startHour; hour < 22; hour++) {
      const startMin = (hour === startHour) ? startMinute : 0;
      
      for (let minute = startMin; minute < 60; minute += 10) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if this slot is already booked
        const isBooked = checkIfSlotBooked(selectedStation.id, bookingData.date, timeSlot);
        if (!isBooked) {
          slots.push(timeSlot);
        }
      }
    }
    
    return slots;
  };

  const checkIfSlotBooked = async (stationId, date, timeSlot) => {
    try {
      // Check with backend API for accurate slot availability
      const response = await fetch(`http://localhost:5000/api/bookings/slots/${stationId}?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const slots = await response.json();
        const requestedSlot = slots.find(slot => {
          const slotHour = slot.displayTime.split(':')[0];
          const requestedHour = timeSlot.split(':')[0];
          return slotHour === requestedHour;
        });
        
        // Return true if slot is fully booked (no available slots)
        return requestedSlot ? !requestedSlot.isAvailable : false;
      }
    } catch (error) {
      console.error('Error checking slot availability:', error);
    }
    
    // Fallback to local check if API fails
    return false;
  };

  const handleBookingSubmit = async () => {
    try {
      // Validate booking date
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert('Cannot book for past dates. Please select today or a future date.');
        return;
      }
      
      const savedVehicleData = JSON.parse(localStorage.getItem('savedVehicleData') || '{}');
      const amount = parseFloat(selectedStation.price.replace('₹', '').replace('/kWh', '')) * 10;
      
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_Rx7lCx7a7G7UsV',
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'EV Charger Finder',
        description: `Charging at ${selectedStation.name}`,
        image: '/vite.svg',
        handler: async function (response) {
          // Payment successful, create booking
          await createBooking(response.razorpay_payment_id, amount);
        },
        prefill: {
          name: localStorage.getItem('userName') || 'User',
          email: localStorage.getItem('userEmail') || 'user@example.com',
          contact: '9999999999'
        },
        notes: {
          station: selectedStation.name,
          date: bookingData.date,
          time: bookingData.timeSlot,
          duration: bookingData.duration
        },
        theme: {
          color: '#ad21ff'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };
  
  const createBooking = async (paymentId, amount) => {
    try {
      const savedVehicleData = JSON.parse(localStorage.getItem('savedVehicleData') || '{}');
      
      const booking = {
        stationId: selectedStation.id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        duration: bookingData.duration,
        amount: amount,
        paymentMethod: 'Razorpay',
        paymentId: paymentId,
        vehicleType: savedVehicleData.vehicleType || vehicleData?.type || 'Car',
        vehicleBrand: savedVehicleData.brand || vehicleData?.brand || '',
        vehicleModel: savedVehicleData.model || vehicleData?.model || '',
        vehicleNumber: savedVehicleData.vehicleNumber || vehicleData?.vehicleNumber || '',
        status: 'Confirmed',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + bookingData.duration * 60 * 60 * 1000).toISOString()
      };
      
      console.log('Creating booking with payment ID:', paymentId);
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(booking)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Booking created successfully:', result);
        
        // Store booking locally to prevent double booking
        const existingBookings = JSON.parse(localStorage.getItem('stationBookings') || '[]');
        existingBookings.push({
          stationId: selectedStation.id,
          date: bookingData.date,
          timeSlot: bookingData.timeSlot,
          duration: bookingData.duration
        });
        localStorage.setItem('stationBookings', JSON.stringify(existingBookings));
        
        setShowBookingModal(false);
        alert('Payment successful! Booking confirmed and saved to database.');
      } else {
        const errorData = await response.text();
        console.error('Booking failed:', errorData);
        alert('Payment successful but booking failed. Please contact support.');
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      alert('Payment successful but booking failed. Please contact support.');
    }
  };

  useEffect(() => {
    // Get user location
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
    // Fetch stations from API
    const fetchStations = async () => {
      try {
        const data = await stationService.getAllStations();
        
        if (data.stations) {
          // Convert API data to map format
          const apiStations = data.stations.map(station => {
            const distance = userLocation ? calculateDistance(
              userLocation.lat, userLocation.lng, 
              station.latitude, station.longitude
            ) : 0;
            
            const isReachable = userRange > 0 ? distance <= userRange : true;
            const isAvailable = station.availableSlots > 0 && station.status === 'Active';
            
            return {
              id: station.id,
              name: station.name,
              lat: station.latitude,
              lng: station.longitude,
              availability: isAvailable ? 'available' : 'busy',
              connector: station.connectorTypes?.[0]?.toUpperCase() || 'TYPE 2',
              price: `₹${station.pricePerKwh || 100}/kWh`,
              availableSlots: station.availableSlots || station.totalSlots || 4,
              totalSlots: station.totalSlots || 4,
              distance: distance,
              address: station.address,
              powerOutput: station.powerOutput,
              operatingHours: station.operatingHours,
              amenities: station.amenities || [],
              isReachable: isReachable,
              status: station.status === 'Active' ? 'Available' : station.status,
              priority: isReachable && isAvailable ? 1 : isReachable ? 2 : 3
            };
          });
          
          // Filter stations based on filters
          let filteredStations = apiStations;
          
          if (filters.status !== 'all') {
            filteredStations = filteredStations.filter(station => {
              if (filters.status === 'available') return station.availableSlots > 0;
              if (filters.status === 'busy') return station.availableSlots === 0;
              if (filters.status === 'maintenance') return station.status === 'Maintenance';
              return true;
            });
          }
          
          if (filters.chargerType !== 'all') {
            filteredStations = filteredStations.filter(station => {
              const powerOutput = station.powerOutput || '';
              const wattage = parseInt(powerOutput.match(/\d+/)?.[0] || '0');
              if (filters.chargerType === 'fast') return wattage >= 50;
              if (filters.chargerType === 'slow') return wattage < 50;
              return true;
            });
          }

          // Sort by priority: 1=reachable+available, 2=reachable+busy, 3=unreachable
          // Then by distance (nearest first)
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

  const recommendedStations = stations.filter(s => s.isReachable).sort((a, b) => {
    // Sort by availability first (available stations first), then by distance
    if (a.availableSlots > 0 && b.availableSlots === 0) return -1;
    if (a.availableSlots === 0 && b.availableSlots > 0) return 1;
    return a.distance - b.distance;
  });

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <MapContainer
          ref={mapRef}
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
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
            <Popup>
              <div className="station-popup">
                <h4>🚗 Your Location</h4>
                {userRange > 0 && <p>Range: {userRange} km</p>}
              </div>
            </Popup>
          </Marker>
          
          {/* Charging Station Markers */}
          {stations.map(station => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={chargingIcon(
                station.isReachable && station.availableSlots > 0 && station.status === 'Available',
                station.isReachable,
                station.availableSlots > 0 && station.status === 'Available'
              )}
            >
              <Popup>
                <div className="station-popup">
                  <h4>{station.name}</h4>
                  <p><strong>Status:</strong> {station.status}</p>
                  <p><strong>Available:</strong> {station.availableSlots}/{station.totalSlots} slots</p>
                  <p><strong>Distance:</strong> {station.distance} km</p>
                  <p><strong>Price:</strong> {station.price || 'N/A'}</p>
                  <p><strong>Connector:</strong> {station.connector.toUpperCase()}</p>
                  {!station.isReachable && (
                    <p style={{color: 'red'}}><strong>⚠️ Out of Range</strong></p>
                  )}
                  {station.status !== 'Available' && (
                    <p style={{color: 'red'}}><strong>🚫 {station.status}</strong></p>
                  )}
                  {station.status === 'Available' && station.availableSlots === 0 && (
                    <p style={{color: 'orange'}}><strong>🚫 Fully Booked Today</strong></p>
                  )}
                  {station.isReachable && vehicleData?.model && station.status === 'Available' && station.availableSlots > 0 && (
                    <>
                      <p style={{color: 'green'}}><strong>✅ Available Now</strong></p>
                      <Button size="sm" onClick={() => handleBookStation(station)}>Book Slot</Button>
                      <small className="d-block mt-1" style={{color: 'white !important'}}>Book for today or future dates</small>
                    </>
                  )}
                  {station.isReachable && !vehicleData?.model && station.status === 'Available' && (
                    <p style={{color: 'orange'}}><strong>⚠️ Select vehicle to book</strong></p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Current Location Button */}
        <Button 
          className="current-location-btn"
          onClick={goToCurrentLocation}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            width: '40px',
            height: '40px',
            fontSize: '18px'
          }}
        >
          📍
        </Button>
      </div>

      {/* Recommended Stations List */}
      {recommendedStations.length > 0 && (
        <div className="mt-4">
          <h5>Recommended Stations</h5>
          <Row>
            {recommendedStations.map(station => (
              <Col md={6} lg={4} key={station.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between">
                      {station.name}
                      {station.status === 'Available' && station.availableSlots > 0 ? (
                        <Badge bg="success">✅</Badge>
                      ) : station.status !== 'Available' ? (
                        <Badge bg="danger">{station.status}</Badge>
                      ) : (
                        <Badge bg="warning">📅</Badge>
                      )}
                    </Card.Title>
                    <Card.Text>
                      <small className="text-muted">{station.address}</small><br/>
                      <strong>Status:</strong> {station.status}<br/>
                      <strong>Available:</strong> {station.availableSlots}/{station.totalSlots} slots<br/>
                      <strong>Distance:</strong> {station.distance} km<br/>
                      <strong>Price:</strong> {station.price || 'N/A'}
                    </Card.Text>
                    {station.status === 'Available' ? (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleBookStation(station)}
                        disabled={!vehicleData?.model}
                      >
                        {vehicleData?.model ? 'Book Slot' : 'Select Vehicle First'}
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        {station.status}
                      </Button>
                    )}
                    {vehicleData?.model && (
                      <small className="d-block mt-1" style={{color: 'white !important'}}>Book for today or future dates</small>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} className="dark-modal">
        <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
          <Modal.Title style={{ color: 'white' }}>Book Charging Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
          {selectedStation && (
            <>
              <h6 style={{ color: 'white' }}>{selectedStation.name}</h6>
              <p style={{ color: 'var(--muted)' }}>{selectedStation.address}</p>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.date}
                    min={getTodayDate()}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const isValid = validateDate(e.target.value);
                      if (isValid) {
                        setBookingData({...bookingData, date: e.target.value, timeSlot: ''});
                      }
                    }}
                    className={dateError ? 'is-invalid' : ''}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  />
                  {dateError && (
                    <div className="invalid-feedback d-block">
                      {dateError}
                    </div>
                  )}
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Time Slot</Form.Label>
                  <Form.Control
                    type="time"
                    value={bookingData.timeSlot}
                    onChange={async (e) => {
                      const selectedTime = e.target.value;
                      
                      // Check if manually entered time conflicts with existing bookings
                      const isBooked = await checkIfSlotBooked(selectedStation.id, bookingData.date, selectedTime);
                      if (isBooked) {
                        alert(`This time slot is fully booked. Please select another time.`);
                        return;
                      }
                      
                      setBookingData({...bookingData, timeSlot: selectedTime});
                    }}
                    step="600"
                    min={bookingData.date === getTodayDate() ? 
                      `${Math.max(new Date().getHours() + 1, 6).toString().padStart(2, '0')}:00` : 
                      "06:00"
                    }
                    max="23:59"
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                    placeholder="Select time"
                  />
                  <small style={{ color: 'var(--muted)' }}>Click to open time picker (10-min intervals)</small>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Duration (hours)</Form.Label>
                  <Form.Select
                    value={bookingData.duration}
                    onChange={async (e) => {
                      const newDuration = parseInt(e.target.value);
                      setBookingData({...bookingData, duration: newDuration});
                      
                      // Recheck if current time slot is still valid with new duration
                      if (bookingData.timeSlot) {
                        const isBooked = await checkIfSlotBooked(selectedStation.id, bookingData.date, bookingData.timeSlot);
                        if (isBooked) {
                          setBookingData(prev => ({...prev, timeSlot: '', duration: newDuration}));
                          alert('Duration change makes this slot fully booked. Please select a new time slot.');
                        }
                      }
                    }}
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    <option value={1} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>1 hour</option>
                    <option value={2} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>2 hours</option>
                    <option value={3} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>3 hours</option>
                    <option value={4} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>4 hours</option>
                    <option value={5} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>5 hours</option>
                    <option value={6} style={{ backgroundColor: '#2a2a2a', color: 'white' }}>6 hours</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="text-center">
                  <strong style={{ color: 'white' }}>Total Amount: ₹{selectedStation && selectedStation.price ? (parseFloat(selectedStation.price.replace('₹', '').replace('/kWh', '')) * 10).toFixed(2) : '0.00'}</strong>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button variant="primary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookingSubmit}
            disabled={!bookingData.timeSlot}
          >
            Pay ₹{selectedStation && selectedStation.price ? (parseFloat(selectedStation.price.replace('₹', '').replace('/kWh', '')) * 10).toFixed(2) : '0.00'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InteractiveMap;
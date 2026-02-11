import React, { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../constants/apiConstants';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Card, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './InteractiveMap.css';

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
        duration: 1
    });
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
        setSelectedStation(station);
        setShowBookingModal(true);
    };

    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        const currentHour = now.getHours();
        const isToday = bookingData.date === new Date().toISOString().split('T')[0];

        for (let hour = isToday ? Math.max(currentHour + 1, 6) : 6; hour <= 22; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const handleBookingSubmit = () => {
        const booking = {
            id: Date.now(),
            stationId: selectedStation.id,
            stationName: selectedStation.name,
            date: bookingData.date,
            timeSlot: bookingData.timeSlot,
            duration: bookingData.duration,
            vehicleData: JSON.parse(localStorage.getItem('savedVehicleData') || '{}'),
            amount: parseFloat(selectedStation.price.replace('₹', '').replace('/kWh', '')) * 10,
            status: 'Confirmed',
            bookedAt: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('userBookings', JSON.stringify(existingBookings));

        setShowBookingModal(false);
        alert('Booking confirmed! Check My Bookings page for details.');
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
                const response = await fetch(`${API_CONFIG.BASE_URL}/stations`);
                const data = await response.json();

                if (data.stations) {
                    // Convert API data to map format
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
                            status: station.status,
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

                    if (filters.connector !== 'all') {
                        filteredStations = filteredStations.filter(station => station.connector === filters.connector);
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

    const recommendedStations = stations.filter(s => s.priority === 1);

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
                                        <>
                                            <p style={{ color: 'green' }}><strong>✅ Recommended</strong></p>
                                            <Button size="sm" onClick={() => handleBookStation(station)}>Book Now</Button>
                                        </>
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
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px'
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
                                            <Badge bg="success">✅</Badge>
                                        </Card.Title>
                                        <Card.Text>
                                            <small className="text-muted">{station.address}</small><br />
                                            <strong>Distance:</strong> {station.distance} km<br />
                                            <strong>Available:</strong> {station.availableSlots}/{station.totalSlots} slots<br />
                                            <strong>Price:</strong> {station.price}
                                        </Card.Text>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleBookStation(station)}
                                        >
                                            Book Now
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Booking Modal */}
            <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Book Charging Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStation && (
                        <>
                            <h6>{selectedStation.name}</h6>
                            <p className="text-muted">{selectedStation.address}</p>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={bookingData.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Time Slot</Form.Label>
                                    <Form.Select
                                        value={bookingData.timeSlot}
                                        onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                                    >
                                        <option value="">Select Time</option>
                                        {generateTimeSlots().map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Duration (hours)</Form.Label>
                                    <Form.Select
                                        value={bookingData.duration}
                                        onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1 hour</option>
                                        <option value={2}>2 hours</option>
                                        <option value={3}>3 hours</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className="text-center">
                                    <strong>Total Amount: ₹{(parseFloat(selectedStation.price.replace('₹', '').replace('/kWh', '')) * 10).toFixed(2)}</strong>
                                </div>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleBookingSubmit}
                        disabled={!bookingData.timeSlot}
                    >
                        Proceed to Payment
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InteractiveMap;

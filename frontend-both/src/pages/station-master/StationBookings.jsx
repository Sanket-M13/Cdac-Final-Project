import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FiCheck, FiX, FiClock, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StationBookings = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/station-master/stations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStations(data || []);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStationBookings = async (stationId) => {
    try {
      const response = await fetch(`https://evcharger-springboot.onrender.com/api/station-master/stations/${stationId}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Real bookings from API:', data);
        data.forEach((booking, index) => {
          console.log(`Booking ${index}: ID=${booking.id}, Status=${booking.status}`);
        });
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    fetchStationBookings(station.id);
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      console.log(`Attempting to ${action} booking ${bookingId}`);
      
      // For real bookings, call API
      const endpoint = action === 'complete' ? 'complete' : action;
      const url = `https://evcharger-springboot.onrender.com/api/station-master/bookings/${bookingId}/${endpoint}`;
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (response.ok) {
        const message = action === 'complete' ? 'Charging completed successfully!' : `Booking ${action}d successfully!`;
        toast.success(message);
        fetchStationBookings(selectedStation.id);
        setShowModal(false);
      } else {
        toast.error(`Failed to ${action} booking: ${responseText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error ${action}ing booking`);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'warning',
      'Confirmed': 'success',
      'Cancelled': 'danger',
      'Completed': 'info'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" />
        </div>
      </Container>
    );
  }

  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)', color: 'var(--fg)' }}>
      <Container>
        <Row>
          <Col>
            <h1 style={{ color: 'var(--fg)' }}>Station Bookings</h1>
            <p style={{ color: 'var(--muted)' }}>Manage bookings for your stations</p>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h5 style={{ color: 'var(--fg)' }}>My Stations</h5>
              </Card.Header>
              <Card.Body style={{ background: 'var(--card-bg)' }}>
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className={`p-3 mb-2 rounded cursor-pointer ${selectedStation?.id === station.id ? 'bg-primary' : 'bg-secondary'}`}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedStation?.id === station.id ? '#ad21ff' : '#4a5568',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => handleStationClick(station)}
                  >
                    <div className="d-flex align-items-center">
                      <FiMapPin className="me-2" />
                      <div>
                        <h6 style={{ color: 'white', margin: 0 }}>{station.name}</h6>
                        <small style={{ color: '#ccc' }}>{station.address}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            {selectedStation ? (
              <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <h5 style={{ color: 'var(--fg)' }}>Bookings for {selectedStation.name}</h5>
                </Card.Header>
                <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
                  {bookings.length > 0 ? (
                    <Table responsive style={{ margin: '0', background: 'transparent' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                          <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Customer</th>
                          <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Date & Time</th>
                          <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                          <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Amount</th>
                          <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                              {booking.userName || booking.user?.name || 'N/A'}
                            </td>
                            <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                              {formatDate(booking.createdAt || booking.startTime || booking.date)}
                            </td>
                            <td style={{ background: 'transparent', padding: '12px' }}>
                              {getStatusBadge(booking.status)}
                            </td>
                            <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                              ₹{booking.amount}
                            </td>
                            <td style={{ background: 'transparent', padding: '12px' }}>
                              {booking.status === 'Pending' && (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleBookingAction(booking.id, 'confirm')}
                                  >
                                    <FiCheck />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleBookingAction(booking.id, 'cancel')}
                                  >
                                    <FiX />
                                  </Button>
                                </>
                              )}
                              {booking.status === 'Confirmed' && booking.id && (
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleBookingAction(booking.id, 'complete')}
                                >
                                  <FiClock /> Complete
                                </Button>
                              )}
                              {!booking.id && (
                                <small style={{ color: 'var(--muted)' }}>No real booking data</small>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-5">
                      <FiClock size={64} style={{ color: 'var(--muted)' }} />
                      <h4 style={{ color: 'var(--fg)' }} className="mt-3">No bookings found</h4>
                      <p style={{ color: 'var(--muted)' }}>No bookings for this station yet.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Card.Body className="text-center py-5" style={{ background: 'var(--card-bg)' }}>
                  <FiMapPin size={64} style={{ color: 'var(--muted)' }} />
                  <h4 style={{ color: 'var(--fg)' }} className="mt-3">Select a Station</h4>
                  <p style={{ color: 'var(--muted)' }}>Click on a station to view its bookings</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StationBookings;

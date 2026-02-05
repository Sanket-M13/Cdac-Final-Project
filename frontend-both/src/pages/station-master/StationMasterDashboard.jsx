import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { FiSettings, FiMapPin, FiUsers, FiBarChart, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StationMasterDashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stations owned by this station master
      const stationsResponse = await fetch('http://localhost:5000/api/station-master/stations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (stationsResponse.ok) {
        const stationsData = await stationsResponse.json();
        setStations(stationsData);
        
        // Fetch recent bookings for all stations
        const allBookings = [];
        for (const station of stationsData) {
          const bookingsResponse = await fetch(`http://localhost:5000/api/station-master/stations/${station.id}/bookings`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();
            // Get upcoming bookings
            const upcoming = bookings.filter(booking => {
              const bookingDate = new Date(booking.date + 'T' + booking.timeSlot);
              const now = new Date();
              return bookingDate > now && booking.status === 'Confirmed';
            });
            allBookings.push(...upcoming.map(b => ({...b, stationName: station.name})));
          }
        }
        
        // Sort by booking time and take first 5
        allBookings.sort((a, b) => {
          const dateA = new Date(a.date + 'T' + a.timeSlot);
          const dateB = new Date(b.date + 'T' + b.timeSlot);
          return dateA - dateB;
        });
        setUpcomingBookings(allBookings.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Station Master Dashboard</h1>
              <p className="text-muted">Welcome back, {user?.name}</p>
            </div>
            <Button as={Link} to="/station-master/add-station" variant="success" size="lg">
              <FiPlus className="me-2" />
              Add New Station
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiMapPin size={48} className="text-primary mb-3" />
              <h5>My Stations</h5>
              <p className="text-muted">{stations.length} stations</p>
              <Button as={Link} to="/station-master/stations" variant="primary" size="sm">
                View Stations
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiPlus size={48} className="text-success mb-3" />
              <h5>Add Station</h5>
              <p className="text-muted">Create new charging station</p>
              <Button as={Link} to="/station-master/add-station" variant="success" size="sm">
                Add Station
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiUsers size={48} className="text-info mb-3" />
              <h5>Bookings</h5>
              <p className="text-muted">{upcomingBookings.length} upcoming</p>
              <Button as={Link} to="/station-master/bookings" variant="info" size="sm">
                View Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiBarChart size={48} className="text-warning mb-3" />
              <h5>Analytics</h5>
              <p className="text-muted">View performance metrics</p>
              <Button as={Link} to="/station-master/analytics" variant="warning" size="sm">
                View Reports
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Upcoming Bookings</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading bookings...</p>
              ) : upcomingBookings.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Station</th>
                      <th>Date & Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.userName || 'N/A'}</td>
                        <td>{booking.stationName}</td>
                        <td>
                          {new Date(booking.date).toLocaleDateString()}<br/>
                          <small className="text-muted">
                            {booking.timeSlot}
                          </small>
                        </td>
                        <td>{booking.duration || '1 hour'}</td>
                        <td>
                          <Badge bg="success">{booking.status}</Badge>
                        </td>
                        <td>₹{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No upcoming bookings found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationMasterDashboard;
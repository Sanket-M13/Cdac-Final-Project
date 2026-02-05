import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FiUsers, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStations: 0,
    totalReservations: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, stationsRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/admin/stations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/admin/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const usersData = await usersRes.json();
      const stationsData = await stationsRes.json();
      const bookingsData = await bookingsRes.json();

      // Handle both .NET (direct arrays) and Spring Boot (wrapped objects) response formats
      const allUsers = Array.isArray(usersData) ? usersData : (usersData.users || []);
      const allStations = Array.isArray(stationsData) ? stationsData : (stationsData.stations || []);
      const allBookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || []);

      const revenue = allBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

      setUsers(allUsers);
      setStations(allStations);
      setBookings(allBookings);
      setStats({
        totalUsers: allUsers.length,
        totalStations: allStations.length,
        totalReservations: allBookings.length,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  return (
    <div className="admin-dashboard-page" style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)' }}>
      <Container>
        <Row>
          <Col>
            <h1 style={{ color: 'var(--fg)', marginBottom: '2rem' }}>Admin Dashboard</h1>
          </Col>
        </Row>

        <Row>
          <Col md={6} lg={3} className="mb-4">
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Body className="text-center">
                <FiUsers size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--fg)' }}>{stats.totalUsers}</h3>
                <p style={{ color: 'var(--muted)' }}>Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Body className="text-center">
                <FiMapPin size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--fg)' }}>{stats.totalStations}</h3>
                <p style={{ color: 'var(--muted)' }}>Stations</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Body className="text-center">
                <FiCalendar size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--fg)' }}>{stats.totalReservations}</h3>
                <p style={{ color: 'var(--muted)' }}>Reservations</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Body className="text-center">
                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '1rem', margin: '0 auto 1rem auto' }}>₹</div>
                <h3 style={{ color: 'var(--fg)' }}>₹{stats.totalRevenue.toFixed(2)}</h3>
                <p style={{ color: 'var(--muted)' }}>Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12} className="mb-4">
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Header style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h5 style={{ color: 'var(--fg)' }}>All Bookings ({bookings.length})</h5>
              </Card.Header>
              <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
                <Table responsive style={{ margin: '0', background: 'transparent' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>User</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Date</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Time</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Amount</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.userName || 'N/A'}</td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.stationName || 'N/A'}</td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.date || 'N/A'}</td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.timeSlot || 'N/A'}</td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>₹{booking.amount || 0}</td>
                        <td style={{ background: 'transparent', padding: '12px' }}>
                          <Badge bg={booking.status === 'Confirmed' ? 'success' : booking.status === 'Cancelled' ? 'danger' : 'warning'}>
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
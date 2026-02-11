import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../constants/apiConstants';
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { FiMapPin, FiUsers, FiDollarSign, FiTrendingUp, FiActivity, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StationMasterAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalStations: 0,
    activeStations: 0,
    maintenanceStations: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyBookings: 0,
    monthlyRevenue: 0,
    stationDetails: [],
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch stations
      // Fetch stations
      const stationsResponse = await fetch(`${API_CONFIG.BASE_URL}/station-master/stations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (stationsResponse.ok) {
        const stations = await stationsResponse.json();

        let totalBookings = 0;
        let totalRevenue = 0;
        let monthlyBookings = 0;
        let monthlyRevenue = 0;
        const stationDetails = [];
        const allBookings = [];

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        for (const station of stations) {
          const bookingsResponse = await fetch(`${API_CONFIG.BASE_URL}/station-master/stations/${station.id}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          let stationBookings = 0;
          let stationRevenue = 0;
          let stationMonthlyBookings = 0;
          let stationMonthlyRevenue = 0;

          if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();

            bookings.forEach(booking => {
              const bookingDate = new Date(booking.date);
              const amount = parseFloat(booking.amount) || 0;

              stationBookings++;
              stationRevenue += amount;
              totalBookings++;
              totalRevenue += amount;

              if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
                stationMonthlyBookings++;
                stationMonthlyRevenue += amount;
                monthlyBookings++;
                monthlyRevenue += amount;
              }
            });

            allBookings.push(...bookings.slice(0, 10).map(b => ({
              ...b,
              stationName: station.name
            })));
          }

          stationDetails.push({
            ...station,
            bookings: stationBookings,
            revenue: stationRevenue,
            monthlyBookings: stationMonthlyBookings,
            monthlyRevenue: stationMonthlyRevenue
          });
        }

        const activeStations = stations.filter(s => s.status === 'Active').length;
        const maintenanceStations = stations.filter(s => s.status === 'Maintenance').length;

        setAnalytics({
          totalStations: stations.length,
          activeStations,
          maintenanceStations,
          totalBookings,
          totalRevenue,
          monthlyBookings,
          monthlyRevenue,
          stationDetails,
          recentBookings: allBookings.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="mb-4">Station Analytics</h1>
          <p className="text-muted mb-4">Performance overview for {user?.name}</p>
        </Col>
      </Row>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiMapPin size={40} className="text-primary mb-2" />
              <h3 className="text-primary">{analytics.totalStations}</h3>
              <p className="mb-0">Total Stations</p>
              <small className="text-success">{analytics.activeStations} Active</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiUsers size={40} className="text-info mb-2" />
              <h3 className="text-info">{analytics.totalBookings}</h3>
              <p className="mb-0">Total Bookings</p>
              <small className="text-success">+{analytics.monthlyBookings} this month</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiDollarSign size={40} className="text-success mb-2" />
              <h3 className="text-success">₹{analytics.totalRevenue.toLocaleString()}</h3>
              <p className="mb-0">Total Revenue</p>
              <small className="text-success">+₹{analytics.monthlyRevenue.toLocaleString()} this month</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiActivity size={40} className="text-warning mb-2" />
              <h3 className="text-warning">{analytics.maintenanceStations}</h3>
              <p className="mb-0">In Maintenance</p>
              <small className="text-muted">Needs attention</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Station Performance */}
      <Row className="mb-4">
        <Col>
          <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h5 className="mb-0" style={{ color: 'var(--fg)' }}>Station Performance</h5>
            </Card.Header>
            <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
              <Table responsive style={{ margin: '0', background: 'transparent' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station Name</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Total Bookings</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Monthly Bookings</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Total Revenue</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Monthly Revenue</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.stationDetails.map((station) => (
                    <tr key={station.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                        <strong>{station.name}</strong><br />
                        <small style={{ color: 'var(--muted)' }}>{station.location}</small>
                      </td>
                      <td style={{ background: 'transparent', padding: '12px' }}>
                        <Badge bg={station.status === 'Active' ? 'success' : 'warning'}>
                          {station.status}
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{station.bookings}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{station.monthlyBookings}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>₹{station.revenue.toLocaleString()}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>₹{station.monthlyRevenue.toLocaleString()}</td>
                      <td style={{ background: 'transparent', padding: '12px' }}>
                        <ProgressBar
                          now={Math.min((station.monthlyBookings / 30) * 100, 100)}
                          variant={station.monthlyBookings > 15 ? 'success' : station.monthlyBookings > 5 ? 'warning' : 'danger'}
                          style={{ width: '100px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Row>
        <Col>
          <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Card.Header style={{ background: 'var(--card-bg)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h5 className="mb-0" style={{ color: 'var(--fg)' }}>Recent Bookings</h5>
            </Card.Header>
            <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
              <Table responsive style={{ margin: '0', background: 'transparent' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Customer</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Date</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Time Slot</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                    <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentBookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.user?.name || 'N/A'}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.stationName}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{new Date(booking.date).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.timeSlot}</td>
                      <td style={{ background: 'transparent', padding: '12px' }}>
                        <Badge bg={
                          booking.status === 'Confirmed' ? 'success' :
                            booking.status === 'Cancelled' ? 'danger' : 'warning'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>₹{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StationMasterAnalytics;

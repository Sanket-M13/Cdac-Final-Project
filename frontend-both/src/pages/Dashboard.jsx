import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiZap, FiCalendar, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isStationMaster } = useAuth();
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    totalSpent: 0,
    nearbyStations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect StationMaster to their specific dashboard
  if (isStationMaster) {
    return <Navigate to="/station-master/dashboard" replace />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
        const activeBookings = bookings.filter(b => b.status === 'Confirmed');
        const totalSpent = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

        setStats({
          totalReservations: bookings.length,
          activeReservations: activeBookings.length,
          totalSpent: totalSpent,
          nearbyStations: 10 // Static for now
        });

        setRecentReservations(bookings.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Find Chargers',
      description: 'Locate nearby charging stations',
      icon: FiMapPin,
      link: '/map',
      color: 'primary'
    },
    {
      title: 'Make Reservation',
      description: 'Book a charging slot',
      icon: FiCalendar,
      link: '/map',
      color: 'success'
    },
    {
      title: 'Cost Estimator',
      description: 'Calculate charging costs',
      icon: FiDollarSign,
      link: '/cost-estimator',
      color: 'info'
    },
    {
      title: 'My Reservations',
      description: 'View your bookings',
      icon: FiClock,
      link: '/reservations',
      color: 'warning'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-page">
        <Container>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Container>
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="welcome-section">
              <h1 className="dashboard-title">
                Welcome back, {user?.firstName || user?.name}!
              </h1>
              <p className="dashboard-subtitle">
                Here's your EV charging overview
              </p>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="stats-row mb-4">
          <Col md={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon primary">
                    <FiCalendar size={24} />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.totalReservations}</h3>
                    <p className="stat-label">Total Reservations</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon success">
                    <FiZap size={24} />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.activeReservations}</h3>
                    <p className="stat-label">Active Reservations</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon info">
                    <FiDollarSign size={24} />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">₹{stats.totalSpent.toFixed(2)}</h3>
                    <p className="stat-label">Total Spent</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon warning">
                    <FiMapPin size={24} />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.nearbyStations}</h3>
                    <p className="stat-label">Nearby Stations</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <h2 className="section-title">Quick Actions</h2>
          </Col>
        </Row>
        <Row className="quick-actions-row mb-4">
          {quickActions.map((action, index) => (
            <Col key={index} md={6} lg={3} className="mb-3">
              <Card className="action-card" as={Link} to={action.link}>
                <Card.Body className="text-center">
                  <div className={`action-icon ${action.color}`}>
                    <action.icon size={32} />
                  </div>
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-description">{action.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Activity */}
        <Row>
          <Col lg={8}>
            <Card className="activity-card">
              <Card.Header>
                <h3 className="card-title">Recent Reservations</h3>
              </Card.Header>
              <Card.Body>
                {recentReservations.length > 0 ? (
                  <div className="reservations-list">
                    {recentReservations.map((reservation) => (
                      <div key={reservation.id} className="reservation-item">
                        <div className="reservation-info">
                          <h5 className="reservation-station">{reservation.station?.name || 'Station'}</h5>
                          <p className="reservation-time">
                            {reservation.date ? new Date(reservation.date + 'T00:00:00').toLocaleDateString('en-IN') : 'Invalid Date'} at{' '}
                            {reservation.timeSlot || 'No time'}
                          </p>
                        </div>
                        <div className="reservation-meta">
                          <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                            {reservation.status}
                          </span>
                          <span className="reservation-cost">
                            ₹{reservation.amount || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FiCalendar size={48} className="empty-icon" />
                    <h4>No reservations yet</h4>
                    <p>Start by finding a charging station near you</p>
                    <Button as={Link} to="/map" className="btn-primary">
                      Find Chargers
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="tips-card">
              <Card.Header>
                <h3 className="card-title">Charging Tips</h3>
              </Card.Header>
              <Card.Body>
                <div className="tips-list">
                  <div className="tip-item">
                    <FiTrendingUp className="tip-icon" />
                    <div>
                      <h5>Peak Hours</h5>
                      <p>Avoid charging during 6-9 PM for better rates</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <FiZap className="tip-icon" />
                    <div>
                      <h5>Fast Charging</h5>
                      <p>Use DC fast chargers for quick top-ups</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <FiMapPin className="tip-icon" />
                    <div>
                      <h5>Plan Ahead</h5>
                      <p>Reserve charging slots for long trips</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './DynamicNavbar.css';

const DynamicNavbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isUser, isStationMaster } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    handleClose();
  };

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
      <Nav.Link as={Link} to="/about" onClick={handleClose}>About</Nav.Link>
      <Nav.Link as={Link} to="/contact" onClick={handleClose}>Contact</Nav.Link>
    </>
  );

  const userLinks = (
    <>
      <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/map" onClick={handleClose}>Map View</Nav.Link>
      <Nav.Link as={Link} to="/reservations" onClick={handleClose}>My Reservations</Nav.Link>
      <Nav.Link as={Link} to="/profile" onClick={handleClose}>Profile</Nav.Link>
    </>
  );

  const adminLinks = (
    <>
      <Nav.Link as={Link} to="/admin/dashboard" onClick={handleClose}>Admin Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/admin/stations" onClick={handleClose}>Manage Stations</Nav.Link>
      <Nav.Link as={Link} to="/admin/reservations" onClick={handleClose}>Reservations</Nav.Link>
      <Nav.Link as={Link} to="/admin/contacts" onClick={handleClose}>Messages</Nav.Link>
      <Nav.Link as={Link} to="/admin/reports" onClick={handleClose}>Reports</Nav.Link>
    </>
  );

  const stationMasterLinks = (
    <>
      <Nav.Link as={Link} to="/station-master/dashboard" onClick={handleClose}>Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/station-master/stations" onClick={handleClose}>My Stations</Nav.Link>
      <Nav.Link as={Link} to="/station-master/add-station" onClick={handleClose}>Add Station</Nav.Link>
      <Nav.Link as={Link} to="/station-master/bookings" onClick={handleClose}>Bookings</Nav.Link>
      <Nav.Link as={Link} to="/station-master/reviews" onClick={handleClose}>Reviews</Nav.Link>
      <Nav.Link as={Link} to="/profile" onClick={handleClose}>Profile</Nav.Link>
    </>
  );

  return (
    <>
      <Navbar expand="lg" className="custom-navbar" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <span className="brand-icon">⚡</span>
            EV Charger Finder
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center">
            <Nav className="me-auto">
              {!isAuthenticated && guestLinks}
              {isUser && userLinks}
              {isAdmin && adminLinks}
              {isStationMaster && stationMasterLinks}
            </Nav>

            <div className="auth-section">
              {!isAuthenticated ? (
                <div className="auth-buttons">
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-light" 
                    size="sm" 
                    className="me-2"
                  >
                    Login
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    className="btn-primary" 
                    size="sm"
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div className="user-section">
                  <span className="user-greeting">
                    <FiUser size={16} className="me-1" />
                    Welcome, {user?.name || 'User'}
                  </span>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleLogout}
                    className="ms-2"
                  >
                    <FiLogOut size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="outline-light" 
            className="d-lg-none mobile-menu-btn"
            onClick={handleShow}
          >
            <FiMenu size={20} />
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={show} onHide={handleClose} placement="end" className="mobile-menu">
        <Offcanvas.Header>
          <Offcanvas.Title className="brand">
            <span className="brand-icon">⚡</span>
            EV Charger Finder
          </Offcanvas.Title>
          <Button variant="outline-light" onClick={handleClose} className="close-btn">
            <FiX size={20} />
          </Button>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          <Nav className="flex-column">
            {!isAuthenticated && guestLinks}
            {isUser && userLinks}
            {isAdmin && adminLinks}
            {isStationMaster && stationMasterLinks}
          </Nav>

          <hr className="mobile-divider" />

          <div className="mobile-auth">
            {!isAuthenticated ? (
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light"
                  onClick={handleClose}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-primary"
                  onClick={handleClose}
                >
                  Register
                </Button>
              </div>
            ) : (
              <div className="user-mobile-section">
                <div className="user-info">
                  <FiUser size={20} className="me-2" />
                  <span>{user?.name || 'User'}</span>
                  <small className="d-block text-muted">{user?.email}</small>
                </div>
                <Button 
                  variant="outline-light" 
                  onClick={handleLogout}
                  className="w-100 mt-3"
                >
                  <FiLogOut size={16} className="me-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default DynamicNavbar;
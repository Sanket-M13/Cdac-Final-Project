import { Navbar as BSNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FaBolt, FaUser, FaSignOutAlt, FaCog, FaHome, FaInfoCircle, FaEnvelope, FaTachometerAlt, FaCalendarCheck } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <BSNavbar bg="info" variant="dark" expand="lg" className="mb-4" style={{backgroundColor: '#20232a !important'}}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold" style={{color: '#61dafb'}}>
          <FaBolt className="me-2" style={{color: '#61dafb'}} />
          EV Charger Finder
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-light">
              <FaHome className="me-1" />Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-light">
              <FaInfoCircle className="me-1" />About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-light">
              <FaEnvelope className="me-1" />Contact
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-light">
                  <FaTachometerAlt className="me-1" />Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/my-bookings" className="text-light">
                  <FaCalendarCheck className="me-1" />My Bookings
                </Nav.Link>
                {user.role === 'admin' && (
                  <NavDropdown title={<span className="text-light"><FaCog className="me-1" />Admin</span>} id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin">
                      <FaTachometerAlt className="me-2" />Admin Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/stations">
                      <FaBolt className="me-2" />Manage Stations
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <Nav.Link disabled className="text-light">
                  <FaUser className="me-1" />
                  {user.name}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout} style={{borderColor: '#61dafb', color: '#61dafb'}}>
                  <FaSignOutAlt className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-light">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

export default Navbar
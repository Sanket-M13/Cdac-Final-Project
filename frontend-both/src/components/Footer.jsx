import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FiMail, FiTwitter, FiLinkedin, FiGithub, FiMapPin, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand">
              <h5 className="brand-name">⚡ EV Charger Finder</h5>
              <p className="brand-description">
                Find and access EV charging stations anywhere, anytime. 
                Making electric vehicle charging simple and accessible.
              </p>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/map">Find Stations</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="footer-title">Support</h6>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#support">24/7 Support</a></li>
            </ul>
          </Col>
          
          <Col lg={4} md={6} className="mb-4">
            <h6 className="footer-title">Contact Info</h6>
            <div className="contact-info mb-3">
              <p><FiMapPin className="me-2" />Mumbai, Maharashtra, India</p>
              <p><FiPhone className="me-2" />+91 98765 43210</p>
              <p><FiMail className="me-2" />support@evchargerfinder.com</p>
            </div>
            <h6 className="footer-title">Newsletter</h6>
            <p className="newsletter-text">
              Get updates on new charging stations.
            </p>
            <Form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <Button type="submit" className="newsletter-button">
                  <FiMail size={16} />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="footer-social">
              <a href="https://twitter.com/evchargerfinder" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="https://linkedin.com/company/evchargerfinder" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </a>
              <a href="https://github.com/evchargerfinder" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FiGithub size={20} />
              </a>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col className="text-center">
            <p className="footer-copyright">
              © 2024 EV Charger Finder. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
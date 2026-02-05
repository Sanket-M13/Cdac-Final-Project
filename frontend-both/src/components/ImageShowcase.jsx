import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiMapPin, FiZap, FiClock } from 'react-icons/fi';

const ImageShowcase = () => {
  return (
    <section className="image-showcase py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="showcase-content">
              <h2 className="mb-4">Find EV Charging Stations Near You</h2>
              <p className="lead mb-4">
                Discover thousands of charging stations across India. Fast, reliable, and always available when you need them.
              </p>
              
              <div className="features-list mb-4">
                <div className="feature-item d-flex align-items-center mb-3">
                  <FiMapPin className="text-primary me-3" size={24} />
                  <span>Real-time station availability</span>
                </div>
                <div className="feature-item d-flex align-items-center mb-3">
                  <FiZap className="text-primary me-3" size={24} />
                  <span>Fast and ultra-fast charging</span>
                </div>
                <div className="feature-item d-flex align-items-center mb-3">
                  <FiClock className="text-primary me-3" size={24} />
                  <span>24/7 customer support</span>
                </div>
              </div>
              
              <Button as={Link} to="/map" variant="primary" size="lg">
                Explore Charging Stations
              </Button>
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="showcase-image">
              <img 
                src="https://plus.unsplash.com/premium_photo-1715611967784-cf625ea00af9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Electric vehicle charging cable plugged into charging port"
                className="img-fluid rounded shadow-lg"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover'
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ImageShowcase;
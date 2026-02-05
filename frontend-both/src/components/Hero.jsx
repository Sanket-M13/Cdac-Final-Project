import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={10} xl={8}>
            <div className="hero-content">
              <h1 className="hero-title">
                Find EV Chargers
                <span className="hero-accent"> Anywhere</span>
              </h1>
              <p className="hero-subtitle">
                Discover fast, reliable charging stations near you with real-time availability
              </p>
              <div className="hero-actions">
                <Link to="/map" className="btn btn-primary hero-btn-primary">
                  <FiMapPin size={20} />
                  Find Chargers
                </Link>
                <button className="btn btn-secondary hero-btn-secondary">
                  Get Started
                  <FiArrowRight size={20} />
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="hero-glow"></div>
    </section>
  );
};

export default Hero;
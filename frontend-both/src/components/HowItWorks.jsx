import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiMapPin, FiZap, FiCreditCard } from 'react-icons/fi';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: FiMapPin,
      title: "Find Stations",
      description: "Locate nearby charging stations with real-time availability"
    },
    {
      icon: FiZap,
      title: "Start Charging",
      description: "Connect your vehicle and begin charging instantly"
    },
    {
      icon: FiCreditCard,
      title: "Pay Securely",
      description: "Complete payment through our secure mobile app"
    }
  ];

  return (
    <section className="how-it-works">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="section-title-center">How It Works</h2>
            <p className="section-subtitle">
              Get charged up in three simple steps
            </p>
          </Col>
        </Row>
        
        <Row className="justify-content-center">
          {steps.map((step, index) => (
            <Col key={index} md={4} className="mb-4">
              <div className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">
                  <step.icon size={32} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HowItWorks;
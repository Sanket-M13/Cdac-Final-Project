import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="contact-header text-center mb-5">
              <h1 className="contact-title">Contact Us</h1>
              <p className="contact-subtitle">
                Get in touch with our admin team for any queries or support
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Row>
              <Col md={6} className="mb-4">
                <Card className="info-card h-100">
                  <Card.Body className="text-center">
                    <div className="info-icon mb-3">
                      <FiMail size={48} />
                    </div>
                    <h5>Admin Email</h5>
                    <p className="mb-0">
                      <a href="mailto:admin@evchargerfinder.com" className="contact-link">
                        admin@evchargerfinder.com
                      </a>
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="info-card h-100">
                  <Card.Body className="text-center">
                    <div className="info-icon mb-3">
                      <FiPhone size={48} />
                    </div>
                    <h5>Support Phone</h5>
                    <p className="mb-0">
                      <a href="tel:+911234567889" className="contact-link">
                        +91 1234567889
                      </a>
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="info-card h-100">
                  <Card.Body className="text-center">
                    <div className="info-icon mb-3">
                      <FiMapPin size={48} />
                    </div>
                    <h5>Office Address</h5>
                    <p className="mb-0">
                      EV Charger Finder HQ<br />
                      Pune, Maharashtra<br />
                      India - 431605
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="info-card h-100">
                  <Card.Body className="text-center">
                    <div className="info-icon mb-3">
                      <FiClock size={48} />
                    </div>
                    <h5>Support Hours</h5>
                    <p className="mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
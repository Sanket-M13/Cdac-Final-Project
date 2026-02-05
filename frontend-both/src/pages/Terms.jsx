import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Terms = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4">Terms of Service</h1>
          <p className="text-muted">Last updated: December 2024</p>
          
          <h3>Acceptance of Terms</h3>
          <p>By using EV Charger Finder, you agree to be bound by these Terms of Service.</p>
          
          <h3>Service Description</h3>
          <p>EV Charger Finder provides a platform to locate, book, and access electric vehicle charging stations.</p>
          
          <h3>User Responsibilities</h3>
          <ul>
            <li>Provide accurate information when registering</li>
            <li>Use the service only for lawful purposes</li>
            <li>Respect charging station equipment and facilities</li>
            <li>Pay for services as agreed</li>
          </ul>
          
          <h3>Booking and Cancellation</h3>
          <p>Bookings can be cancelled through your dashboard. Cancellation policies may vary by charging station.</p>
          
          <h3>Limitation of Liability</h3>
          <p>EV Charger Finder is not liable for any damages arising from the use of charging stations or our platform.</p>
          
          <h3>Contact Information</h3>
          <p>For questions about these Terms, contact us at support@evchargerfinder.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Terms;
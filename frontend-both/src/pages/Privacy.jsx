import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Privacy = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="text-muted">Last updated: December 2024</p>
          
          <h3>Information We Collect</h3>
          <p>We collect information you provide when you register, book charging stations, and use our services.</p>
          
          <h3>How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our EV charging services</li>
            <li>To process your bookings and payments</li>
            <li>To send you booking confirmations and updates</li>
            <li>To improve our services and user experience</li>
          </ul>
          
          <h3>Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h3>Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at support@evchargerfinder.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Privacy;
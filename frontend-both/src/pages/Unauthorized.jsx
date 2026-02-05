import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiShield, FiHome } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={6}>
            <FiShield size={80} style={{ color: 'var(--accent)', marginBottom: '2rem' }} />
            <h1 style={{ color: 'var(--fg)', marginBottom: '1rem' }}>Access Denied</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              You don't have permission to access this page.
            </p>
            <Button as={Link} to="/" className="btn-primary">
              <FiHome className="me-2" />
              Go Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Unauthorized;
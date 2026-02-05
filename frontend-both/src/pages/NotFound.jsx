import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={6}>
            <h1 style={{ fontSize: '6rem', color: 'var(--accent)', fontWeight: 'bold' }}>404</h1>
            <h2 style={{ color: 'var(--fg)', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              The page you're looking for doesn't exist.
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

export default NotFound;
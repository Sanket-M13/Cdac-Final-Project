import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={16}
        style={{
          color: i < rating ? '#ffc107' : '#6c757d',
          fill: i < rating ? '#ffc107' : 'none'
        }}
      />
    ));
  };

  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)' }}>
      <Container>
        <Row>
          <Col>
            <h1 style={{ color: 'var(--fg)', marginBottom: '2rem' }}>Station Reviews</h1>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Header style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h5 style={{ color: 'var(--fg)' }}>All Reviews ({reviews.length})</h5>
              </Card.Header>
              <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
                <Table responsive style={{ margin: '0', background: 'transparent' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>User</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Rating</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Comment</th>
                      <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                          {review.user?.name || 'N/A'}
                        </td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                          {review.station?.name || 'N/A'}
                        </td>
                        <td style={{ background: 'transparent', padding: '12px' }}>
                          <div className="d-flex align-items-center">
                            {renderStars(review.rating)}
                            <span style={{ color: 'var(--fg)', marginLeft: '8px' }}>({review.rating}/5)</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                          {review.comment || 'No comment'}
                        </td>
                        <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminContacts;
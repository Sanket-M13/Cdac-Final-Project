import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../constants/apiConstants';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { FiStar, FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StationMasterReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/station-master/reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const getRatingBadge = (rating) => {
    if (rating <= 2) return 'danger';
    if (rating <= 3) return 'warning';
    return 'success';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        size={16}
        style={{
          color: index < rating ? '#ffc107' : 'rgba(255,255,255,0.3)',
          marginRight: '2px'
        }}
        fill={index < rating ? '#ffc107' : 'none'}
      />
    ));
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 0', minHeight: '100vh', background: '#0a0a0a' }}>
        <Container>
          <div className="text-center" style={{ color: 'white' }}>Loading reviews...</div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{
        position: 'relative',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
        overflow: 'hidden'
      }}>
        <img
          src="https://www.vecteezy.com/vector-art/29898290-customer-review-usability-evaluation-feedback-rating-system-isometric-concept-vector-illustration"
          alt="EV Charging Reviews"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(111, 0, 255, 0.8), rgba(84, 133, 185, 0.9))'
        }} />
        <Container style={{ height: '100%', display: 'flex', alignItems: 'center', paddingTop: '80px' }}>
          <div style={{ color: 'white', zIndex: 2 }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Station Reviews
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              Customer feedback for your charging stations
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: '20px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '10px 20px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)'
              }}>
                <FiStar size={20} style={{ marginRight: '8px' }} />
                Total Reviews: {reviews.length}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container style={{ paddingTop: '40px', paddingBottom: '50px' }}>
        {reviews.length === 0 ? (
          <Card style={{
            background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <Card.Body className="text-center p-5">
              <FiStar size={64} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }} />
              <h3 style={{ color: 'white', marginBottom: '15px' }}>No Reviews Yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Your stations haven't received any reviews yet. Encourage customers to share their experience!
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {reviews.map(review => (
              <Col md={6} lg={4} key={review.id} className="mb-4">
                <Card style={{
                  background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}>
                  <Card.Body style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{
                        color: 'white',
                        marginBottom: '5px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <FiMapPin size={18} style={{ marginRight: '8px', color: '#007bff' }} />
                        {review.station?.name || 'Unknown Station'}
                      </h5>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ marginRight: '10px' }}>
                        {renderStars(review.rating)}
                      </div>
                      <Badge
                        bg={getRatingBadge(review.rating)}
                        style={{ fontSize: '12px' }}
                      >
                        {review.rating}/5
                      </Badge>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <p style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        fontStyle: review.comment ? 'normal' : 'italic'
                      }}>
                        "{review.comment || 'No comment provided'}"
                      </p>
                    </div>

                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      paddingTop: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FiUser size={16} style={{ marginRight: '6px', color: '#87CEEB' }} />
                        <span style={{ color: '#87CEEB', fontSize: '13px' }}>
                          {review.user?.name || 'Anonymous'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FiCalendar size={16} style={{ marginRight: '6px', color: 'rgba(255,255,255,0.5)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default StationMasterReviews;

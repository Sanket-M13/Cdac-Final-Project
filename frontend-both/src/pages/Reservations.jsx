import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants/apiConstants';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FiCalendar, FiMapPin, FiClock, FiDollarSign, FiX, FiStar } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReservations();

    const interval = setInterval(fetchReservations, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data.bookings || []);
      }
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReservation) return;

    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const stationId = selectedReservation.station?.id || selectedReservation.stationId;

      const response = await fetch(`${API_CONFIG.BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          stationId,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: '' });
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={20}
        style={{
          color: i < rating ? '#ffc107' : '#6c757d',
          fill: i < rating ? '#ffc107' : 'none',
          cursor: interactive ? 'pointer' : 'default',
          marginRight: '4px'
        }}
        onClick={interactive ? () => setReviewData({ ...reviewData, rating: i + 1 }) : undefined}
      />
    ));
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      const bookingDate = selectedReservation.Date || selectedReservation.date;
      const bookingTime = selectedReservation.TimeSlot || selectedReservation.timeSlot;

      if (bookingDate && bookingTime) {
        const bookingDateTime = new Date(`${bookingDate}T${bookingTime}:00`);
        const now = new Date();
        const timeDifference = bookingDateTime.getTime() - now.getTime();
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));

        if (minutesDifference <= 20 && minutesDifference >= 0) {
          toast.error('Cancellation of booking before 20 minutes is not allowed');
          setShowCancelModal(false);
          return;
        }
      }

      const bookingId = selectedReservation.Id || selectedReservation.id;

      const response = await fetch(`${API_CONFIG.BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Reservation cancelled successfully');
        fetchReservations();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to cancel reservation');
      }

      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Cancel reservation error:', error);
      toast.error('Failed to cancel reservation');
      setShowCancelModal(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'secondary';
      case 'active': return 'success';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="reservations-page">
        <Container>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <Container>
        <Row>
          <Col>
            <div className="page-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">My Reservations</h1>
                  <p className="page-subtitle">Manage your charging station bookings</p>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={fetchReservations}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {reservations.length > 0 ? (
          <Row>
            {reservations.map((reservation) => (
              <Col key={reservation.id} lg={6} className="mb-4">
                <Card className="reservation-card">
                  <Card.Body>
                    <div className="reservation-header">
                      <h4 className="station-name">{reservation.Station?.Name || reservation.station?.name || reservation.StationName || reservation.stationName || 'Station'}</h4>
                      <Badge bg={getStatusBadgeVariant(reservation.status)}>
                        {reservation.Status || reservation.status || 'Unknown'}
                      </Badge>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-item">
                        <FiCalendar className="detail-icon" />
                        <span>
                          <strong>Date:</strong> {reservation.Date || reservation.date || 'No date'}
                        </span>
                      </div>

                      <div className="detail-item">
                        <FiClock className="detail-icon" />
                        <span>
                          <strong>Time:</strong> {reservation.TimeSlot || reservation.timeSlot || 'No time'} ({reservation.Duration || reservation.duration || 0}h)
                        </span>
                      </div>

                      <div className="detail-item">
                        <FiDollarSign className="detail-icon" />
                        <span>
                          <strong>Amount:</strong> ₹{reservation.Amount || reservation.amount || 0}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span style={{ color: 'white' }}>
                          <strong>Vehicle:</strong> {reservation.VehicleBrand || reservation.vehicleBrand || ''} {reservation.VehicleModel || reservation.vehicleModel || ''}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span style={{ color: 'white' }}>
                          <strong>Payment:</strong> {reservation.PaymentMethod || reservation.paymentMethod || 'Card'}
                          {(reservation.PaymentId || reservation.paymentId) && (
                            <small className="d-block" style={{ color: 'white' }}>ID: {reservation.PaymentId || reservation.paymentId}</small>
                          )}
                        </span>
                      </div>

                      <div className="detail-item">
                        <span style={{ color: 'white' }}>
                          <strong>Booked on:</strong> {reservation.CreatedAt || reservation.createdAt ? new Date(reservation.CreatedAt || reservation.createdAt).toLocaleDateString('en-IN') : 'Unknown'}
                        </span>
                      </div>

                      {(reservation.Status || reservation.status) === 'Cancelled' && reservation.CancellationMessage && (
                        <div className="detail-item" style={{ backgroundColor: '#ffebee', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                          <span style={{ color: '#d32f2f' }}>
                            <strong>Cancellation Reason:</strong> {reservation.CancellationMessage}
                          </span>
                        </div>
                      )}
                    </div>

                    {(reservation.Status || reservation.status) === 'Confirmed' && (
                      <div className="reservation-actions">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowCancelModal(true);
                          }}
                        >
                          <FiX size={16} className="me-1" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {(reservation.Status || reservation.status) !== 'Cancelled' && (
                      <div className="reservation-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowReviewModal(true);
                          }}
                        >
                          <FiStar size={16} className="me-1" />
                          Write Review
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col>
              <Card className="empty-state-card">
                <Card.Body className="text-center">
                  <FiCalendar size={64} className="empty-icon" />
                  <h3>No Reservations Yet</h3>
                  <p>You haven't made any reservations. Start by finding a charging station near you.</p>
                  <Button href="/map" className="btn-primary">
                    Find Charging Stations
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Modal.Title style={{ color: 'white' }}>Cancel Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px' }}>
          <p style={{ color: 'white', marginBottom: '16px' }}>Are you sure you want to cancel this reservation?</p>
          {selectedReservation && (
            <div className="cancel-details" style={{
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                {selectedReservation.Station?.Name || selectedReservation.station?.name || selectedReservation.StationName || selectedReservation.stationName || 'Station'}
              </div>
              <div style={{ color: '#ffc107', fontSize: '14px' }}>
                📅 {selectedReservation.Date || selectedReservation.date || 'No date'} at {selectedReservation.TimeSlot || selectedReservation.timeSlot || 'No time'}
              </div>
              <div style={{ color: '#28a745', fontSize: '14px', marginTop: '4px' }}>
                💰 Amount: ₹{selectedReservation.Amount || selectedReservation.amount || 0}
              </div>
            </div>
          )}
          <div style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <small style={{ color: '#ffc107', fontSize: '13px' }}>
              ⚠️ Cancellation is not allowed within 20 minutes of the booking time.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowCancelModal(false)}
            style={{ borderRadius: '8px', padding: '8px 20px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Keep Reservation
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelReservation}
            style={{ borderRadius: '8px', padding: '8px 20px' }}
          >
            Cancel Reservation
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
          <Modal.Title style={{ color: 'white' }}>Write Review</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <img
              src="https://plus.unsplash.com/premium_photo-1739518892874-c31b2da91732?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="EV Charging Station"
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            />
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <h5 style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>
                {selectedReservation?.Station?.Name || selectedReservation?.station?.name || 'Charging Station'}
              </h5>
              <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '14px', color: '#87CEEB' }}>
                Help others by sharing your charging experience
              </p>
            </div>
          </div>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>How was your experience?</Form.Label>
              <div className="d-flex align-items-center justify-content-center" style={{ padding: '16px 0' }}>
                {renderStars(reviewData.rating, true)}
                <span className="ms-3" style={{ color: '#ffc107', fontSize: '18px', fontWeight: 'bold' }}>({reviewData.rating}/5)</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>Tell us more about your experience</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Was the station easy to find? How was the charging speed? Any issues or highlights?"
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '2px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  padding: '12px'
                }}
              />
            </Form.Group>

            <div style={{
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              border: '1px solid rgba(0, 123, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px'
            }}>
              <small style={{ color: '#87CEEB', fontSize: '13px' }}>
                💡 Your review helps other EV drivers make informed decisions about charging stations.
              </small>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowReviewModal(false)}
            style={{ borderRadius: '8px', padding: '8px 20px' }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitReview}
            style={{
              borderRadius: '8px',
              padding: '8px 24px',
              background: 'linear-gradient(45deg, #007bff, #0056b3)',
              border: 'none'
            }}
          >
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reservations;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminReservations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/admin', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancelMessage.trim()) {
      toast.error('Please provide a cancellation message');
      return;
    }

    try {
      const response = await fetch(`/api/bookings/admin-cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          bookingId: selectedBooking.id,
          message: cancelMessage 
        })
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        setCancelMessage('');
        fetchBookings();
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Confirmed': 'success',
      'Cancelled': 'danger',
      'Completed': 'info',
      'Pending': 'warning'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)' }}>
        <Container>
          <div className="text-center" style={{ color: 'var(--fg)' }}>Loading...</div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1 style={{ color: 'var(--fg)' }}>All Reservations</h1>
            <p style={{ color: 'var(--muted)' }}>View and manage all user reservations ({bookings.length} total)</p>
          </Col>
        </Row>

        <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
            <Table responsive style={{ margin: '0', background: 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>ID</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>User</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Date & Time</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Duration</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Amount</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>#{booking.id}</td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.userName || 'N/A'}</td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.stationName || 'N/A'}</td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                      {booking.date && booking.timeSlot ? `${booking.date} ${booking.timeSlot}` : 'N/A'}
                    </td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{booking.duration || 1}h</td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>₹{booking.amount}</td>
                    <td style={{ background: 'transparent', padding: '12px' }}>
                      {getStatusBadge(booking.status)}
                    </td>
                    <td style={{ background: 'transparent', padding: '12px' }}>
                      {booking.status === 'Confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          <FiTrash2 /> Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {bookings.length === 0 && (
              <div className="text-center p-4" style={{ color: 'var(--muted)' }}>
                No reservations found
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Cancel Booking Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} className="dark-modal">
          <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <Modal.Title style={{ color: 'white' }}>Cancel Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
            {selectedBooking && (
              <>
                <p>Are you sure you want to cancel this booking?</p>
                <div className="mb-3">
                  <strong>Booking Details:</strong><br/>
                  User: {selectedBooking.userName}<br/>
                  Station: {selectedBooking.stationName}<br/>
                  Date: {selectedBooking.date} {selectedBooking.timeSlot}<br/>
                  Amount: ₹{selectedBooking.amount}
                </div>
                <Form.Group>
                  <Form.Label>Cancellation Message (will be shown to user):</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={cancelMessage}
                    onChange={(e) => setCancelMessage(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                    style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={confirmCancelBooking}>
              Cancel Booking
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminReservations;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { FiEdit, FiEye, FiTrash2, FiMapPin, FiPlus, FiDollarSign, FiCalendar, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [stationBookings, setStationBookings] = useState([]);
  const [stationRevenue, setStationRevenue] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/station-master/stations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStations(data || []);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStationDetails = async (stationId) => {
    setLoadingDetails(true);
    try {
      // Fetch bookings for this specific station
      const bookingsResponse = await fetch(`https://evcharger-springboot.onrender.com/api/station-master/stations/${stationId}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setStationBookings(bookingsData || []);
        
        // Calculate revenue for this station only
        const totalRevenue = (bookingsData || []).reduce((sum, booking) => {
          return sum + (booking.amount || 0);
        }, 0);
        setStationRevenue(totalRevenue);
      }
    } catch (error) {
      console.error('Error fetching station details:', error);
      setStationBookings([]);
      setStationRevenue(0);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewStation = (station) => {
    setSelectedStation(station);
    setFormData(station);
    setIsEditing(false);
    setShowModal(true);
    fetchStationDetails(station.id);
  };

  const handleEditStation = (station) => {
    setSelectedStation(station);
    setFormData(station);
    setIsEditing(true);
    setShowModal(true);
    fetchStationDetails(station.id);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://evcharger-springboot.onrender.com/api/station-master/stations/${selectedStation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Station updated successfully! Waiting for admin approval.');
        setShowModal(false);
        fetchStations();
      } else {
        toast.error('Failed to update station');
      }
    } catch (error) {
      toast.error('Error updating station');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Active': 'success',
      'Maintenance': 'warning',
      'Electricity Shortage': 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  const getApprovalBadge = (approvalStatus) => {
    const colors = {
      'Pending': 'warning',
      'Approved': 'success', 
      'Rejected': 'danger'
    };
    return <Badge bg={colors[approvalStatus] || 'secondary'}>{approvalStatus}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" />
        </div>
      </Container>
    );
  }

  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)', color: 'var(--fg)' }}>
      <Container>
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 style={{ color: 'var(--fg)' }}>My Stations</h1>
                <p style={{ color: 'var(--muted)' }}>Manage your charging stations</p>
              </div>
              <Button as={Link} to="/station-master/add-station" style={{ background: 'var(--accent)', border: 'none' }}>
                <FiPlus className="me-2" />
                Add New Station
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
                {stations.length > 0 ? (
                  <Table responsive style={{ margin: '0', background: 'transparent' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Station Name</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Location</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Approval</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Slots</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Price</th>
                        <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stations.map((station) => (
                        <tr key={station.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                            <strong>{station.name}</strong>
                          </td>
                          <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                            <FiMapPin className="me-1" />
                            {station.address}
                          </td>
                          <td style={{ background: 'transparent', padding: '12px' }}>
                            {getApprovalBadge(station.approvalStatus || 'Pending')}
                          </td>
                          <td style={{ background: 'transparent', padding: '12px' }}>
                            {getStatusBadge(station.status)}
                          </td>
                          <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                            {station.availableSlots}/{station.totalSlots}
                          </td>
                          <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                            ₹{station.pricePerKwh}/kWh
                          </td>
                          <td style={{ background: 'transparent', padding: '12px' }}>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleViewStation(station)}
                            >
                              <FiEye />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEditStation(station)}
                            >
                              <FiEdit />
                            </Button>
                            {station.approvalStatus === 'Pending' && (
                              <small style={{ color: '#fbbf24', marginLeft: '8px' }}>Waiting for approval</small>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <FiMapPin size={64} style={{ color: 'var(--muted)' }} />
                    <h4 style={{ color: 'var(--fg)' }} className="mt-3">No stations found</h4>
                    <p style={{ color: 'var(--muted)' }}>You haven't added any charging stations yet.</p>
                    <Button as={Link} to="/station-master/add-station" style={{ background: 'var(--accent)', border: 'none' }}>
                      Add Your First Station
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* View/Edit Station Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton style={{ backgroundColor: '#2d3748', borderBottom: '1px solid #4a5568' }}>
            <Modal.Title style={{ color: 'white' }}>
              {isEditing ? 'Edit Station' : 'Station Details'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#2d3748', color: 'white' }}>
            {selectedStation && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Station Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Electricity Shortage">Electricity Shortage</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ 
                      backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                      color: 'white', 
                      border: '1px solid #4a5568' 
                    }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Latitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Total Slots</Form.Label>
                      <Form.Control
                        type="number"
                        name="totalSlots"
                        value={formData.totalSlots || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'white' }}>Price per kWh (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="pricePerKwh"
                        value={formData.pricePerKwh || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        style={{ 
                          backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                          color: 'white', 
                          border: '1px solid #4a5568' 
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'white' }}>Operating Hours</Form.Label>
                  <Form.Control
                    type="text"
                    name="operatingHours"
                    value={formData.operatingHours || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{ 
                      backgroundColor: isEditing ? '#4a5568' : '#1a202c', 
                      color: 'white', 
                      border: '1px solid #4a5568' 
                    }}
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#2d3748', borderTop: '1px solid #4a5568' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {isEditing && (
              <Button variant="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyStations;

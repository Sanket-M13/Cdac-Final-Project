import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../constants/apiConstants';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { stationService } from '../../services/stationService';

const ManageStations = () => {
  const [stations, setStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    connectorTypes: [],
    powerOutput: '',
    pricePerKwh: '',
    amenities: [],
    operatingHours: '',
    status: 'Available',
    totalSlots: '',
    availableSlots: ''
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      // Use admin endpoint to get all stations including pending ones
      const response = await fetch(`${API_CONFIG.BASE_URL}/stations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      const stationsData = data.stations || [];
      setStations(stationsData);
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Failed to fetch stations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stationData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        pricePerKwh: parseFloat(formData.pricePerKwh),
        totalSlots: parseInt(formData.totalSlots),
        availableSlots: parseInt(formData.availableSlots)
      };

      if (editingStation) {
        await stationService.updateStation(editingStation.id, stationData);
        toast.success('Station updated successfully');
      } else {
        await stationService.createStation(stationData);
        toast.success('Station created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchStations();
    } catch (error) {
      console.error('Error saving station:', error);
      toast.error('Failed to save station');
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      latitude: station.latitude.toString(),
      longitude: station.longitude.toString(),
      connectorTypes: station.connectorTypes || [],
      powerOutput: station.powerOutput,
      pricePerKwh: station.pricePerKwh.toString(),
      amenities: station.amenities || [],
      operatingHours: station.operatingHours,
      status: station.status,
      totalSlots: station.totalSlots.toString(),
      availableSlots: station.availableSlots.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await stationService.deleteStation(id);
        toast.success('Station deleted successfully');
        fetchStations();
      } catch (error) {
        console.error('Error deleting station:', error);
        toast.error('Failed to delete station');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/stations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Station approved successfully');
        fetchStations();
      } else {
        toast.error('Failed to approve station');
      }
    } catch (error) {
      console.error('Error approving station:', error);
      toast.error('Failed to approve station');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this station?')) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/stations/${id}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success('Station rejected successfully');
          fetchStations();
        } else {
          toast.error('Failed to reject station');
        }
      } catch (error) {
        console.error('Error rejecting station:', error);
        toast.error('Failed to reject station');
      }
    }
  };



  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      connectorTypes: [],
      powerOutput: '',
      pricePerKwh: '',
      amenities: [],
      operatingHours: '',
      status: 'Available',
      totalSlots: '',
      availableSlots: ''
    });
    setEditingStation(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div style={{ padding: '100px 0 50px', minHeight: '100vh', background: 'var(--bg-900)' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 style={{ color: 'var(--fg)' }}>Manage Stations</h1>
                <p style={{ color: 'var(--muted)' }}>Add, edit, and manage charging stations</p>
              </div>
              <Button
                onClick={handleAddNew}
                style={{ background: 'var(--accent)', border: 'none' }}
              >
                <FiPlus className="me-2" />
                Add New Station
              </Button>
            </div>
          </Col>
        </Row>

        <Card style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Card.Body style={{ background: 'var(--card-bg)', padding: '0' }}>
            <Table responsive style={{ margin: '0', background: 'transparent' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Name</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Address</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Status</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Approval</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Slots</th>
                  <th style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map(station => (
                  <tr key={station.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{station.name}</td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>{station.address}</td>
                    <td style={{ background: 'transparent', padding: '12px' }}>
                      <Badge bg={station.status === 'Available' ? 'success' : station.status === 'Maintenance' ? 'warning' : 'danger'}>
                        {station.status}
                      </Badge>
                    </td>
                    <td style={{ background: 'transparent', padding: '12px' }}>
                      <Badge bg={station.approvalStatus === 'Approved' ? 'success' : station.approvalStatus === 'Rejected' ? 'danger' : 'warning'}>
                        {station.approvalStatus || 'Pending'}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--fg)', background: 'transparent', padding: '12px' }}>
                      {station.availableSlots}/{station.totalSlots}
                    </td>
                    <td style={{ background: 'transparent', padding: '12px' }}>
                      <div className="d-flex gap-1">
                        {(!station.approvalStatus || station.approvalStatus === 'Pending') && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleApprove(station.id)}
                              title="Approve Station"
                            >
                              <FiCheck />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleReject(station.id)}
                              title="Reject Station"
                            >
                              <FiX />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(station)}
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(station.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="dark-modal">
          <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <Modal.Title style={{ color: 'white' }}>
              {editingStation ? 'Edit Station' : 'Add New Station'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Station Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Status</Form.Label>
                    <Form.Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                    >
                      <option value="Available" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Available</option>
                      <option value="Maintenance" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Maintenance</option>
                      <option value="Electricity Shortage" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Electricity Shortage</option>
                      <option value="Offline" style={{ backgroundColor: '#2a2a2a', color: 'white' }}>Offline</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={{ color: 'white' }}>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Connector Types</Form.Label>
                    <Form.Control
                      type="text"
                      value={Array.isArray(formData.connectorTypes) ? formData.connectorTypes.join(', ') : ''}
                      onChange={(e) => setFormData({ ...formData, connectorTypes: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                      placeholder="e.g., Type 2, CCS, CHAdeMO"
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Amenities</Form.Label>
                    <Form.Control
                      type="text"
                      value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : ''}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                      placeholder="e.g., WiFi, Restroom, Cafe"
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Power Output</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.powerOutput}
                      onChange={(e) => setFormData({ ...formData, powerOutput: e.target.value })}
                      placeholder="e.g., 50kW"
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Price per kWh</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={formData.pricePerKwh}
                      onChange={(e) => setFormData({ ...formData, pricePerKwh: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Operating Hours</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.operatingHours}
                      onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                      placeholder="e.g., 24/7"
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
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
                      value={formData.totalSlots}
                      onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Available Slots</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.availableSlots}
                      onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                      style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#007bff', border: 'none', color: 'white' }}
            >
              {editingStation ? 'Update Station' : 'Add Station'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageStations;

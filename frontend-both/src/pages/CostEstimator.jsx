import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FiZap, FiClock, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CostEstimator.css';

const CostEstimator = () => {
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    chargingStationId: '',
    startTime: '',
    endTime: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('https://evcharger-springboot.onrender.com/api/stations/nearby?latitude=40.7128&longitude=-74.0060&radiusKm=50');
      setStations(response.data);
    } catch (error) {
      toast.error('Failed to load stations');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstimate = async (e) => {
    e.preventDefault();
    
    if (!formData.chargingStationId || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://evcharger-springboot.onrender.com/api/reservations/estimate-cost', {
        chargingStationId: parseInt(formData.chargingStationId),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      setEstimate(response.data);
    } catch (error) {
      toast.error('Failed to calculate estimate');
    } finally {
      setLoading(false);
    }
  };

  const selectedStation = stations.find(s => s.id === parseInt(formData.chargingStationId));

  return (
    <div className="cost-estimator-page">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="page-header text-center">
              <h1 className="page-title">
                <FiDollarSign className="me-2" />
                Cost Estimator
              </h1>
              <p className="page-subtitle">
                Calculate your charging costs before making a reservation
              </p>
            </div>

            <Card className="estimator-card">
              <Card.Body>
                <Form onSubmit={handleEstimate}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Charging Station</Form.Label>
                        <Form.Select
                          name="chargingStationId"
                          value={formData.chargingStationId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a station</option>
                          {stations.map(station => (
                            <option key={station.id} value={station.id}>
                              {station.name} - ${station.pricePerKwh}/kWh
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {selectedStation && (
                        <div className="station-info">
                          <h6>Station Details</h6>
                          <p className="mb-1">
                            <FiZap size={16} className="me-1" />
                            {selectedStation.connectorType}
                          </p>
                          <p className="mb-1">
                            <FiDollarSign size={16} className="me-1" />
                            ${selectedStation.pricePerKwh}/kWh
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          min={new Date().toISOString().slice(0, 16)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          min={formData.startTime}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      className="btn-primary"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <FiDollarSign size={20} className="me-2" />
                          Calculate Cost
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {estimate && (
              <Card className="estimate-result-card mt-4">
                <Card.Header>
                  <h4 className="mb-0">Cost Estimate</h4>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="estimate-item">
                        <FiZap className="estimate-icon" />
                        <div>
                          <h6>Station</h6>
                          <p>{estimate.stationName}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="estimate-item">
                        <FiClock className="estimate-icon" />
                        <div>
                          <h6>Duration</h6>
                          <p>{estimate.duration}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="estimate-item">
                        <FiDollarSign className="estimate-icon" />
                        <div>
                          <h6>Price per kWh</h6>
                          <p>${estimate.pricePerKwh}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="estimate-item">
                        <FiZap className="estimate-icon" />
                        <div>
                          <h6>Estimated Consumption</h6>
                          <p>{estimate.estimatedConsumption}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="total-cost">
                    <h3>Total Estimated Cost: ${estimate.estimatedCost.toFixed(2)}</h3>
                  </div>

                  <div className="text-center mt-3">
                    <Button 
                      href="/map" 
                      className="btn-primary"
                      size="lg"
                    >
                      Make Reservation
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CostEstimator;

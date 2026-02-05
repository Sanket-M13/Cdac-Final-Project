import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap'
import { FaCar, FaGasPump, FaMapMarkerAlt, FaClock, FaRoute } from 'react-icons/fa'
import { vehicleService } from '../services/vehicleService'
import { locationService, sampleStations } from '../utils/locationUtils'
import { useNavigate } from 'react-router-dom'

const VehicleDashboard = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: '',
    vehicleType: 'standard',
    currentPercentage: 50
  })

  useEffect(() => {
    loadVehicles()
    getUserLocation()
  }, [])

  useEffect(() => {
    if (selectedVehicle && userLocation) {
      generateRecommendations()
    }
  }, [selectedVehicle, userLocation])

  const loadVehicles = () => {
    const savedVehicles = vehicleService.getSavedVehicles()
    setVehicles(savedVehicles)
    if (savedVehicles.length > 0) {
      setSelectedVehicle(savedVehicles[0])
    }
  }

  const getUserLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation()
      setUserLocation(location)
    } catch (error) {
      console.error('Location error:', error)
    }
  }

  const handleSaveVehicle = () => {
    if (!newVehicle.vehicleNumber) return
    
    const vehicleData = {
      ...newVehicle,
      currentRange: vehicleService.calculateRange(newVehicle.currentPercentage, newVehicle.vehicleType),
      lastUpdated: new Date().toISOString()
    }
    
    vehicleService.saveVehicle(vehicleData)
    loadVehicles()
    setNewVehicle({ vehicleNumber: '', vehicleType: 'standard', currentPercentage: 50 })
  }

  const generateRecommendations = () => {
    if (!selectedVehicle || !userLocation) return
    
    const recs = vehicleService.findBestStations(userLocation, sampleStations, selectedVehicle)
    setRecommendations(recs.slice(0, 5))
  }

  const getStatusColor = (station) => {
    if (!station.canReach) return 'danger'
    if (station.waitTime === 0) return 'success'
    if (station.waitTime <= 30) return 'warning'
    return 'danger'
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5><FaCar className="me-2" />Add Vehicle</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={newVehicle.vehicleNumber}
                    onChange={(e) => setNewVehicle({...newVehicle, vehicleNumber: e.target.value})}
                    placeholder="DL01AB1234"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Select
                    value={newVehicle.vehicleType}
                    onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
                  >
                    <option value="standard">Standard (300km)</option>
                    <option value="premium">Premium (450km)</option>
                    <option value="luxury">Luxury (600km)</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Current Battery: {newVehicle.currentPercentage}%</Form.Label>
                  <Form.Range
                    value={newVehicle.currentPercentage}
                    onChange={(e) => setNewVehicle({...newVehicle, currentPercentage: parseInt(e.target.value)})}
                    min={5}
                    max={100}
                  />
                </Form.Group>
                
                <Button onClick={handleSaveVehicle} className="w-100">
                  Save Vehicle
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>My Vehicles</h5>
            </Card.Header>
            <Card.Body>
              {vehicles.map((vehicle, index) => (
                <Card 
                  key={index} 
                  className={`mb-2 cursor-pointer ${selectedVehicle?.vehicleNumber === vehicle.vehicleNumber ? 'border-primary' : ''}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="py-2">
                    <strong>{vehicle.vehicleNumber}</strong>
                    <br />
                    <small>Range: {vehicle.currentRange}km | {vehicle.currentPercentage}%</small>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {selectedVehicle && (
            <>
              <Card className="mb-4">
                <Card.Header>
                  <h5><FaRoute className="me-2" />Vehicle Status: {selectedVehicle.vehicleNumber}</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h3 className="text-primary">{selectedVehicle.currentRange}km</h3>
                        <small>Current Range</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h3 className="text-success">{selectedVehicle.currentPercentage}%</h3>
                        <small>Battery Level</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h3 className="text-info">{selectedVehicle.vehicleType}</h3>
                        <small>Vehicle Type</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h5><FaGasPump className="me-2" />Recommended Stations</h5>
                </Card.Header>
                <Card.Body>
                  {recommendations.length === 0 ? (
                    <Alert variant="info">Getting location and calculating recommendations...</Alert>
                  ) : (
                    recommendations.map((station, index) => (
                      <Card key={station.id} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={8}>
                              <h6>
                                {station.name}
                                <Badge bg={getStatusColor(station)} className="ms-2">
                                  {!station.canReach ? 'Out of Range' : 
                                   station.waitTime === 0 ? 'Available Now' : 
                                   `${station.waitTime}min wait`}
                                </Badge>
                              </h6>
                              <p className="mb-1">
                                <FaMapMarkerAlt className="me-1" />
                                {station.distance}km away • {station.chargerType} • ₹{station.pricePerHour}/hr
                              </p>
                              <p className="mb-0">
                                <FaClock className="me-1" />
                                Wait: {station.waitTime}min • Charging: {station.chargingTime.hours}h {station.chargingTime.minutes}m
                              </p>
                            </Col>
                            <Col md={4} className="text-end">
                              <div className="mb-2">
                                <small>Available Slots</small>
                                <br />
                                <strong>{station.availableSlots}/{station.totalSlots}</strong>
                              </div>
                              <Button 
                                size="sm" 
                                variant={station.canReach ? "primary" : "secondary"}
                                disabled={!station.canReach}
                                onClick={() => navigate(`/book-station/${station.id}`)}
                              >
                                {station.canReach ? 'Book Now' : 'Too Far'}
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default VehicleDashboard
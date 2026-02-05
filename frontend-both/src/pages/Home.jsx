import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Alert } from 'react-bootstrap'
import { FaChargingStation, FaBolt, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { stationService } from '../services/stationService'

const Home = () => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      const data = await stationService.getAllStations()
      setStations(data || [])
    } catch (error) {
      console.error('Error fetching stations:', error)
      setError('Failed to load stations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading stations...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2><FaChargingStation className="me-2" />EV Charging Stations</h2>
          <p className="text-muted">Find and book charging stations near you</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {stations.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FaChargingStation size={50} className="text-muted mb-3" />
                <h5>No stations available</h5>
                <p className="text-muted">Please check back later or contact support.</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          stations.map((station) => (
            <Col md={6} lg={4} key={station.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title className="h5">{station.name}</Card.Title>
                  <Card.Text>
                    <small className="text-muted">
                      <FaMapMarkerAlt className="me-1" />
                      {station.address}
                    </small>
                    <br />
                    <small>
                      <FaBolt className="me-1" />
                      {station.chargerType} ({station.chargingPower}) | ₹{station.pricePerHour}/hour
                    </small>
                    <br />
                    <small className={station.availableSlots > 0 ? 'text-success' : 'text-danger'}>
                      <FaClock className="me-1" />
                      {station.availableSlots}/{station.totalSlots} slots available
                    </small>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Link to={`/book/${station.id}`} className="w-100">
                    <button 
                      className={`btn w-100 ${
                        station.availableSlots === 0 ? 'btn-secondary' : 'btn-primary'
                      }`}
                      disabled={station.availableSlots === 0}
                    >
                      {station.availableSlots === 0 ? 'Fully Booked' : 'Book Now'}
                    </button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  )
}

export default Home
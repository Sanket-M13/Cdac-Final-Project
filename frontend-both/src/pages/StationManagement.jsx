import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa'
import { sampleStations } from '../utils/locationUtils'

const StationManagement = () => {
  const [stations, setStations] = useState(sampleStations)
  const [showModal, setShowModal] = useState(false)
  const [editingStation, setEditingStation] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    chargerType: 'AC',
    pricePerHour: '',
    isAvailable: true,
    totalSlots: 4,
    chargingPower: '22kW'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (editingStation) {
        setStations(stations.map(s => s.id === editingStation.id ? { ...formData, id: editingStation.id } : s))
      } else {
        const newStation = { ...formData, id: Date.now(), availableSlots: formData.totalSlots }
        setStations([...stations, newStation])
      }
      setShowModal(false)
      resetForm()
    } catch (error) {
      setError('Failed to save station')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (station) => {
    setEditingStation(station)
    setFormData(station)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      setStations(stations.filter(s => s.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      chargerType: 'AC',
      pricePerHour: '',
      isAvailable: true,
      totalSlots: 4,
      chargingPower: '22kW'
    })
    setEditingStation(null)
    setError('')
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Station Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" />
              Add Station
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Price/Hour</th>
                <th>Slots</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id}>
                  <td>{station.name}</td>
                  <td>{station.address}</td>
                  <td>{station.chargerType} ({station.chargingPower})</td>
                  <td>₹{station.pricePerHour}</td>
                  <td>{station.availableSlots}/{station.totalSlots}</td>
                  <td>
                    <span className={`badge ${station.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                      {station.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(station)}>
                      <FaEdit />
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(station.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStation ? 'Edit Station' : 'Add New Station'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Station Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Charger Type</Form.Label>
              <Form.Select name="chargerType" value={formData.chargerType} onChange={handleChange}>
                <option value="AC Charger">AC Charger</option>
                <option value="DC Fast Charger">DC Fast Charger</option>
                <option value="Supercharger">Supercharger</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Charging Power</Form.Label>
              <Form.Select name="chargingPower" value={formData.chargingPower} onChange={handleChange}>
                <option value="22kW">22kW</option>
                <option value="50kW">50kW</option>
                <option value="60kW">60kW</option>
                <option value="120kW">120kW</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price per Hour (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Total Slots</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isAvailable"
                label="Available"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Station'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default StationManagement
import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Modal, Badge } from 'react-bootstrap'
import { FaCar, FaBatteryHalf, FaPlus, FaEdit } from 'react-icons/fa'
import { carService } from '../services/carService'

const CarProfile = () => {
  const [cars, setCars] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    batteryCapacity: '',
    range_km: '',
    currentBatteryPercentage: 50,
    isDefault: false
  })

  const carBrands = [
    { brand: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y'] },
    { brand: 'Tata', models: ['Nexon EV', 'Tigor EV'] },
    { brand: 'MG', models: ['ZS EV', 'Comet EV'] },
    { brand: 'Hyundai', models: ['Kona Electric', 'Ioniq 5'] },
    { brand: 'Mahindra', models: ['eXUV300', 'eVerito'] }
  ]

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      const data = await carService.getUserCars()
      setCars(data)
    } catch (error) {
      console.error('Error loading cars:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCar) {
        await carService.updateCar(editingCar.id, formData)
      } else {
        await carService.addCar(formData)
      }
      setShowModal(false)
      setEditingCar(null)
      resetForm()
      loadCars()
    } catch (error) {
      console.error('Error saving car:', error)
    }
  }

  const handleEdit = (car) => {
    setEditingCar(car)
    setFormData({
      brand: car.brand,
      model: car.model,
      batteryCapacity: car.batteryCapacity,
      range_km: car.range_km,
      currentBatteryPercentage: car.currentBatteryPercentage,
      isDefault: car.isDefault
    })
    setShowModal(true)
  }

  const updateBattery = async (carId, percentage) => {
    try {
      await carService.updateCar(carId, { currentBatteryPercentage: percentage })
      loadCars()
    } catch (error) {
      console.error('Error updating battery:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      batteryCapacity: '',
      range_km: '',
      currentBatteryPercentage: 50,
      isDefault: false
    })
  }

  const getBatteryColor = (percentage) => {
    if (percentage > 60) return 'success'
    if (percentage > 30) return 'warning'
    return 'danger'
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2><FaCar className="me-2" />My Cars</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" />Add Car
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {cars.map((car) => (
          <Col md={6} lg={4} key={car.id} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5>{car.brand} {car.model}</h5>
                  {car.isDefault && <Badge bg="primary">Default</Badge>}
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small>Battery Level</small>
                    <small>{car.currentBatteryPercentage}%</small>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className={`progress-bar bg-${getBatteryColor(car.currentBatteryPercentage)}`}
                      style={{ width: `${car.currentBatteryPercentage}%` }}
                    />
                  </div>
                  <Form.Range
                    value={car.currentBatteryPercentage}
                    onChange={(e) => updateBattery(car.id, parseInt(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="mb-2">
                  <small className="text-muted">
                    <FaBatteryHalf className="me-1" />
                    {car.batteryCapacity}kWh • {carService.calculateRange(car.currentBatteryPercentage, car.range_km)}km range
                  </small>
                </div>

                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleEdit(car)}
                >
                  <FaEdit className="me-1" />Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingCar(null); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCar ? 'Edit Car' : 'Add New Car'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Select
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value, model: ''})}
                    required
                  >
                    <option value="">Select Brand</option>
                    {carBrands.map(brand => (
                      <option key={brand.brand} value={brand.brand}>{brand.brand}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Model</Form.Label>
                  <Form.Select
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                    disabled={!formData.brand}
                  >
                    <option value="">Select Model</option>
                    {formData.brand && carBrands
                      .find(b => b.brand === formData.brand)?.models
                      .map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))
                    }
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Battery Capacity (kWh)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={formData.batteryCapacity}
                    onChange={(e) => setFormData({...formData, batteryCapacity: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Range (km)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.range_km}
                    onChange={(e) => setFormData({...formData, range_km: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Current Battery: {formData.currentBatteryPercentage}%</Form.Label>
              <Form.Range
                value={formData.currentBatteryPercentage}
                onChange={(e) => setFormData({...formData, currentBatteryPercentage: parseInt(e.target.value)})}
                min="0"
                max="100"
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Set as default car"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingCar(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCar ? 'Update' : 'Add'} Car
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default CarProfile
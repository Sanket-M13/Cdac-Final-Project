import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FaChargingStation, FaRupeeSign, FaClock, FaBolt } from 'react-icons/fa'
import { sampleStations } from '../utils/locationUtils'
import { chargingCalculator } from '../utils/locationUtils'
import { paymentService } from '../services/paymentService'
import { bookingService } from '../services/bookingService'
import { vehicleService } from '../services/vehicleService'

const BookStation = () => {
  const { stationId } = useParams()
  const navigate = useNavigate()
  const [station, setStation] = useState(null)
  const [chargingData, setChargingData] = useState({
    currentPercentage: 20,
    targetPercentage: 80,
    vehicleNumber: '',
    selectedSlot: null
  })
  const [savedVehicles, setSavedVehicles] = useState([])
  const [chargingTime, setChargingTime] = useState(null)
  const [timeSlots, setTimeSlots] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const foundStation = sampleStations.find(s => s.id === parseInt(stationId))
    if (foundStation) {
      setStation(foundStation)
    } else {
      setError('Station not found')
    }
    
    // Load saved vehicles
    const vehicles = vehicleService.getSavedVehicles()
    setSavedVehicles(vehicles)
  }, [stationId])

  useEffect(() => {
    if (station && chargingData.currentPercentage && chargingData.targetPercentage) {
      const time = chargingCalculator.calculateChargingTime(
        chargingData.currentPercentage,
        chargingData.targetPercentage,
        station.chargingPower
      )
      setChargingTime(time)
      
      const slots = chargingCalculator.generateTimeSlots(time)
      setTimeSlots(slots)
      
      const amount = Math.ceil((time.totalMinutes / 60) * station.pricePerHour)
      setTotalAmount(amount)
    }
  }, [station, chargingData.currentPercentage, chargingData.targetPercentage])

  const handleChange = (e) => {
    setChargingData({
      ...chargingData,
      [e.target.name]: e.target.value
    })
  }

  const handleSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setChargingData({ ...chargingData, selectedSlot: slot })
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const orderData = await paymentService.createOrder(totalAmount * 100)
      
      paymentService.processPayment(
        orderData,
        async (response) => {
          // Payment successful - create booking
          try {
            const today = new Date()
            const startDateTime = new Date(today)
            const endDateTime = new Date(today)
            
            // Parse time from slot and set to today's date
            const [startHour, startMinute] = chargingData.selectedSlot.startTime.split(':')
            const [endHour, endMinute] = chargingData.selectedSlot.endTime.split(':')
            
            startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0)
            endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0)
            
            const bookingData = {
              stationId: parseInt(stationId),
              vehicleNumber: chargingData.vehicleNumber,
              startTime: startDateTime.toISOString().slice(0, 19).replace('T', ' '),
              endTime: endDateTime.toISOString().slice(0, 19).replace('T', ' '),
              currentPercentage: parseInt(chargingData.currentPercentage),
              targetPercentage: parseInt(chargingData.targetPercentage),
              totalAmount: totalAmount,
              paymentId: response.razorpay_payment_id
            }
            
            await bookingService.createBooking(bookingData)
            alert('Booking confirmed! Payment ID: ' + response.razorpay_payment_id)
            navigate('/my-bookings')
          } catch (error) {
            setError('Booking failed: ' + error.message)
          }
        },
        (error) => {
          setError('Payment failed: ' + error)
        }
      )
    } catch (error) {
      setError('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSelect = (vehicleNumber) => {
    const vehicle = savedVehicles.find(v => v.vehicleNumber === vehicleNumber)
    if (vehicle) {
      setChargingData({
        ...chargingData,
        vehicleNumber: vehicle.vehicleNumber,
        currentPercentage: vehicle.currentPercentage
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!chargingData.selectedSlot) {
      setError('Please select a time slot')
      return
    }
    if (!chargingData.vehicleNumber) {
      setError('Please enter vehicle number')
      return
    }
    
    await paymentService.initializeRazorpay()
    handlePayment()
  }

  if (!station) {
    return (
      <Container>
        <Alert variant="danger">Station not found</Alert>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header>
              <h4><FaChargingStation className="me-2" />Book Station: {station.name}</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Card className="mb-4">
                    <Card.Body>
                      <h6>Station Details</h6>
                      <p><strong>Address:</strong> {station.address}</p>
                      <p><strong>Type:</strong> {station.chargerType}</p>
                      <p><strong>Power:</strong> {station.chargingPower}</p>
                      <p><strong>Price:</strong> ₹{station.pricePerHour}/hour</p>
                      <p><strong>Available Slots:</strong> {station.availableSlots}/{station.totalSlots}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={8}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Battery %</Form.Label>
                          <Form.Range
                            name="currentPercentage"
                            value={chargingData.currentPercentage}
                            onChange={handleChange}
                            min={5}
                            max={95}
                          />
                          <div className="text-center">{chargingData.currentPercentage}%</div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Target Battery %</Form.Label>
                          <Form.Range
                            name="targetPercentage"
                            value={chargingData.targetPercentage}
                            onChange={handleChange}
                            min={chargingData.currentPercentage}
                            max={100}
                          />
                          <div className="text-center">{chargingData.targetPercentage}%</div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {chargingTime && (
                      <Alert variant="info">
                        <FaClock className="me-2" />
                        Estimated charging time: {chargingTime.hours}h {chargingTime.minutes}m
                      </Alert>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Vehicle Number</Form.Label>
                      {savedVehicles.length > 0 && (
                        <div className="mb-2">
                          <small>Select from saved vehicles:</small>
                          <div>
                            {savedVehicles.map((vehicle, index) => (
                              <Badge 
                                key={index}
                                bg="outline-primary" 
                                className="me-2 mb-1 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleVehicleSelect(vehicle.vehicleNumber)}
                              >
                                {vehicle.vehicleNumber} ({vehicle.currentPercentage}%)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Form.Control
                        type="text"
                        name="vehicleNumber"
                        value={chargingData.vehicleNumber}
                        onChange={handleChange}
                        placeholder="e.g., DL01AB1234"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Select Time Slot</Form.Label>
                      <Row>
                        {timeSlots.map((slot) => (
                          <Col md={4} key={slot.id} className="mb-2">
                            <Card 
                              className={`text-center cursor-pointer ${
                                chargingData.selectedSlot?.id === slot.id ? 'border-primary' : ''
                              } ${!slot.isAvailable ? 'bg-light' : ''}`}
                              onClick={() => handleSlotSelect(slot)}
                              style={{ cursor: slot.isAvailable ? 'pointer' : 'not-allowed' }}
                            >
                              <Card.Body className="py-2">
                                <small>
                                  {slot.startTime} - {slot.endTime}
                                  <br />
                                  <Badge bg={slot.isAvailable ? 'success' : 'danger'}>
                                    {slot.isAvailable ? 'Available' : 'Booked'}
                                  </Badge>
                                </small>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Form.Group>

                    <Card className="mb-3">
                      <Card.Body>
                        <h6><FaRupeeSign className="me-2" />Payment Summary</h6>
                        <p>Charging Duration: {chargingTime?.hours || 0}h {chargingTime?.minutes || 0}m</p>
                        <p>Rate: ₹{station.pricePerHour}/hour</p>
                        <hr />
                        <h5>Total Amount: ₹{totalAmount}</h5>
                      </Card.Body>
                    </Card>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={loading || !station.isAvailable || !chargingData.selectedSlot}
                    >
                      {loading ? 'Processing...' : `Pay ₹${totalAmount} & Book`}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default BookStation
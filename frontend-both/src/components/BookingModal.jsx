import { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap'
import { FaClock, FaRupeeSign, FaCalendarAlt, FaBolt, FaCheckCircle } from 'react-icons/fa'
import { bookingService } from '../services/bookingService'
import { paymentService } from '../services/paymentService'
import { emailService } from '../services/emailService'
import { useAuth } from '../context/AuthContext'

const BookingModal = ({ show, onHide, station, selectedVehicle }) => {
  const { user } = useAuth()
  const [step, setStep] = useState(1) // 1: slots, 2: payment, 3: confirmation
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [bookingData, setBookingData] = useState({
    currentPercentage: 20,
    targetPercentage: 80
  })

  useEffect(() => {
    if (show && station) {
      const today = new Date().toISOString().split('T')[0]
      setSelectedDate(today)
      fetchAvailableSlots(station.id, today)
    }
  }, [show, station])

  const fetchAvailableSlots = async (stationId, date) => {
    setLoading(true)
    setError('')
    try {
      console.log('Fetching slots for station:', stationId, 'date:', date)
      
      // Use bookings API endpoint for slots
      const response = await fetch(`https://evcharger-springboot.onrender.com/api/bookings/slots/${stationId}?date=${date}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const slots = await response.json()
      console.log('Received slots:', slots)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Error fetching slots:', error)
      setError('Failed to load time slots: ' + error.message)
      // Show some default slots if API fails
      const defaultSlots = []
      for (let hour = 8; hour < 22; hour++) {
        defaultSlots.push({
          startTime: `${date} ${hour.toString().padStart(2, '0')}:00:00`,
          endTime: `${date} ${(hour + 1).toString().padStart(2, '0')}:00:00`,
          displayTime: `${hour}:00 - ${hour + 1}:00`,
          isAvailable: true
        })
      }
      setAvailableSlots(defaultSlots)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    fetchAvailableSlots(station.id, date)
  }

  const handleSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot)
    }
  }

  const calculateAmount = () => {
    if (!selectedSlot || !station) return 0
    const duration = 1 // 1 hour slot
    return Math.ceil(duration * station.pricePerHour)
  }

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      setError('Please select a time slot')
      return
    }
    setStep(2)
    setError('')
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const amount = calculateAmount()
      
      // Initialize Razorpay
      const isRazorpayLoaded = await paymentService.initializeRazorpay()
      if (!isRazorpayLoaded) {
        throw new Error('Razorpay SDK failed to load')
      }
      
      // Create order with proper amount handling
      const order = await paymentService.createOrder(amount)
      
      // Process payment
      paymentService.processPayment(
        order,
        async (response) => {
          // Payment successful - create booking
          try {
            const booking = {
              stationId: station.id,
              vehicleNumber: selectedVehicle.vehicleNumber,
              startTime: selectedSlot.startTime,
              endTime: selectedSlot.endTime,
              currentPercentage: bookingData.currentPercentage,
              targetPercentage: bookingData.targetPercentage,
              totalAmount: amount,
              paymentId: response.razorpay_payment_id
            }
            
            const createdBooking = await bookingService.createBooking(booking)
            
            // Send email confirmation
            if (user?.email) {
              try {
                await emailService.sendBookingConfirmation({
                  userEmail: user.email,
                  userName: user.name || 'User',
                  stationName: station.name,
                  stationAddress: station.address,
                  date: new Date(selectedDate).toLocaleDateString(),
                  timeSlot: selectedSlot.displayTime,
                  duration: '1 hour',
                  amount: amount,
                  paymentId: response.razorpay_payment_id,
                  bookingId: createdBooking.id || 'N/A'
                })
                setEmailSent(true)
              } catch (emailError) {
                console.warn('Email sending failed:', emailError)
              }
            }
            
            setStep(3)
            setLoading(false)
          } catch (error) {
            setError('Booking creation failed: ' + error.message)
            setLoading(false)
          }
        },
        (error) => {
          setError('Payment failed: ' + error)
          setLoading(false)
        }
      )
    } catch (error) {
      setError('Payment initialization failed: ' + error.message)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setSelectedSlot(null)
    setError('')
    setEmailSent(false)
    onHide()
  }

  const getNextTwoDays = () => {
    const dates = []
    for (let i = 0; i < 2; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString()
      })
    }
    return dates
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="dark-modal">
      <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <Modal.Title style={{ color: 'white' }}>
          {step === 1 && 'Select Time Slot'}
          {step === 2 && 'Payment Details'}
          {step === 3 && 'Booking Confirmed'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* Step 1: Time Slot Selection */}
        {step === 1 && (
          <>
            <div className="mb-4">
              <h6>{station?.name}</h6>
              <p className="text-muted">{station?.address}</p>
            </div>

            {/* Date Selection */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Select Date</Form.Label>
                <div className="d-flex gap-2">
                  {getNextTwoDays().map(date => (
                    <Button
                      key={date.value}
                      variant={selectedDate === date.value ? 'primary' : 'outline-primary'}
                      onClick={() => handleDateChange(date.value)}
                    >
                      <FaCalendarAlt className="me-1" />
                      {date.label}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>

            {/* Time Slots */}
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" />
                <p>Loading available slots...</p>
              </div>
            ) : (
              <Row>
                {availableSlots.map((slot, index) => (
                  <Col md={4} key={index} className="mb-3">
                    <Card 
                      className={`text-center ${
                        selectedSlot?.startTime === slot.startTime ? 'border-primary bg-light' : 
                        slot.isAvailable ? 'border-success' : 'border-danger'
                      }`}
                      style={{ cursor: slot.isAvailable ? 'pointer' : 'not-allowed' }}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <Card.Body className="py-2">
                        <div className="fw-bold">{slot.displayTime}</div>
                        <Badge bg={slot.isAvailable ? 'success' : 'danger'}>
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* Battery Settings */}
            <Row className="mt-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Current Battery: {bookingData.currentPercentage}%</Form.Label>
                  <Form.Range
                    value={bookingData.currentPercentage}
                    onChange={(e) => setBookingData({...bookingData, currentPercentage: parseInt(e.target.value)})}
                    min="5"
                    max="95"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Target Battery: {bookingData.targetPercentage}%</Form.Label>
                  <Form.Range
                    value={bookingData.targetPercentage}
                    onChange={(e) => setBookingData({...bookingData, targetPercentage: parseInt(e.target.value)})}
                    min={bookingData.currentPercentage}
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div>
            <Card className="mb-3">
              <Card.Body>
                <h6>Booking Summary</h6>
                <p><strong>Station:</strong> {station?.name}</p>
                <p><strong>Vehicle:</strong> {selectedVehicle?.vehicleNumber}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedSlot?.displayTime}</p>
                <p><strong>Charging:</strong> {bookingData.currentPercentage}% → {bookingData.targetPercentage}%</p>
                <hr />
                <h5><FaRupeeSign />Total Amount: ₹{calculateAmount()}</h5>
                <Alert variant="info" className="mt-3">
                  <strong>Payment Method:</strong> Cash Payment at Station
                  <br />
                  <small>Pay ₹{calculateAmount()} when you arrive at the charging station.</small>
                </Alert>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center">
            <div className="mb-4">
              <FaCheckCircle className="display-1 text-success mb-3" />
              <h4>Booking Confirmed!</h4>
              <p>Your charging slot has been successfully booked.</p>
              {emailSent && (
                <Alert variant="success" className="mt-2">
                  📧 Confirmation email sent to {user?.email}
                </Alert>
              )}
              {user?.email && !emailSent && (
                <Alert variant="warning" className="mt-2">
                  ⚠️ Booking confirmed but email notification failed. Please save your booking details.
                </Alert>
              )}
            </div>
            <Card>
              <Card.Body>
                <p><strong>Station:</strong> {station?.name}</p>
                <p><strong>Date & Time:</strong> {new Date(selectedDate).toLocaleDateString()} at {selectedSlot?.displayTime}</p>
                <p><strong>Vehicle:</strong> {selectedVehicle?.vehicleNumber}</p>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {step === 1 && (
          <>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleProceedToPayment}
              disabled={!selectedSlot}
            >
              Proceed to Payment
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button 
              variant="success" 
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </>
        )}
        {step === 3 && (
          <Button variant="primary" onClick={handleClose}>
            View My Bookings
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default BookingModal

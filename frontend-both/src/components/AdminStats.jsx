import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { FaUsers, FaChargingStation, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa'

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStations: 0,
    totalBookings: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [usersRes, stationsRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/stations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      const users = await usersRes.json()
      const stations = await stationsRes.json()
      const bookings = await bookingsRes.json()

      const revenue = bookings.reduce((sum, booking) => sum + booking.amount, 0)

      setStats({
        totalUsers: users.length,
        totalStations: stations.length,
        totalBookings: bookings.length,
        totalRevenue: revenue
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaUsers size={40} className="text-primary mb-3" />
              <Card.Title>{stats.totalUsers}</Card.Title>
              <Card.Text className="text-muted">Total Users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaChargingStation size={40} className="text-success mb-3" />
              <Card.Title>{stats.totalStations}</Card.Title>
              <Card.Text className="text-muted">Charging Stations</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaCalendarAlt size={40} className="text-info mb-3" />
              <Card.Title>{stats.totalBookings}</Card.Title>
              <Card.Text className="text-muted">Total Bookings</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaRupeeSign size={40} className="text-warning mb-3" />
              <Card.Title>₹{stats.totalRevenue.toLocaleString()}</Card.Title>
              <Card.Text className="text-muted">Total Revenue</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AdminStats
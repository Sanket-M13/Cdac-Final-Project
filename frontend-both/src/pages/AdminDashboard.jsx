import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap'
import { FaUsers, FaChargingStation, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa'
import { API_CONFIG, API_ENDPOINTS } from '../constants/apiConstants'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStations: 0,
    totalBookings: 0,
    totalRevenue: 0
  })
  const [users, setUsers] = useState([])
  const [stations, setStations] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, stationsRes, bookingsRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.USERS}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.STATIONS.BASE}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.ADMIN.BOOKINGS}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ])

      const usersData = await usersRes.json()
      const stationsData = await stationsRes.json()
      const bookingsData = await bookingsRes.json()

      const revenue = bookingsData.reduce((sum, booking) => sum + booking.amount, 0)

      setUsers(usersData)
      setStations(stationsData)
      setStats({
        totalUsers: usersData.length,
        totalStations: stationsData.length,
        totalBookings: bookingsData.length,
        totalRevenue: revenue
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">Manage your EV charging network</p>
        </Col>
      </Row>

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

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>All Users</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'}>
                          {user.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>All Stations</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map(station => (
                    <tr key={station.id}>
                      <td>{station.name}</td>
                      <td>{station.address}</td>
                      <td>
                        <Badge bg={station.status === 'Active' ? 'success' : 'danger'}>
                          {station.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
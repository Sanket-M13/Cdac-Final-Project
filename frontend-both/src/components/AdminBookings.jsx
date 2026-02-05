import { Table, Badge } from 'react-bootstrap'

const AdminBookings = () => {
  const bookings = [
    {
      id: 1,
      userName: 'John Doe',
      stationName: 'Central Mall EV Hub',
      date: '2024-12-24',
      amount: 225,
      status: 'completed'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      stationName: 'Metro Station Charger',
      date: '2024-12-25',
      amount: 80,
      status: 'active'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'success',
      'completed': 'primary',
      'cancelled': 'danger'
    }
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>User</th>
          <th>Station</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(booking => (
          <tr key={booking.id}>
            <td>{booking.userName}</td>
            <td>{booking.stationName}</td>
            <td>{new Date(booking.date).toLocaleDateString()}</td>
            <td>₹{booking.amount}</td>
            <td>{getStatusBadge(booking.status)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default AdminBookings
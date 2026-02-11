import { useState, useEffect } from 'react'
import { Table, Badge, Button } from 'react-bootstrap'

const AdminUsers = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://evcharger-springboot.onrender.com/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Vehicle</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone || 'N/A'}</td>
            <td>{user.vehicleNumber || 'N/A'}</td>
            <td>
              <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'}>
                {user.role}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default AdminUsers

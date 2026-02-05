import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner, Container } from 'react-bootstrap'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return user && user.role === 'admin' ? children : <Navigate to="/login" />
}

export default AdminRoute
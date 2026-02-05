import { Card, Badge, Button } from 'react-bootstrap'

const AdminMessages = () => {
  const messages = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      type: 'query',
      subject: 'Charging station availability',
      message: 'Is the Central Mall station available tomorrow?',
      date: '2024-12-23',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      type: 'complaint',
      subject: 'Payment issue',
      message: 'I was charged twice for the same booking.',
      date: '2024-12-22',
      status: 'resolved'
    }
  ]

  const getTypeBadge = (type) => {
    const variants = {
      'query': 'info',
      'complaint': 'danger',
      'feedback': 'success',
      'support': 'warning'
    }
    return <Badge bg={variants[type]}>{type.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'resolved': 'success',
      'in-progress': 'info'
    }
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <div>
      {messages.map(message => (
        <Card key={message.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6>{message.name}</h6>
                <small className="text-muted">{message.email}</small>
              </div>
              <div>
                {getTypeBadge(message.type)}
                <span className="ms-2">{getStatusBadge(message.status)}</span>
              </div>
            </div>
            <h6>{message.subject}</h6>
            <p>{message.message}</p>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">{new Date(message.date).toLocaleDateString()}</small>
              <Button size="sm" variant="outline-primary">
                Respond
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default AdminMessages
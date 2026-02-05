import { Card, Badge } from 'react-bootstrap'
import { FaStar } from 'react-icons/fa'

const AdminReviews = () => {
  const reviews = [
    {
      id: 1,
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent service and fast charging!',
      date: '2024-12-20'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Good experience, easy to book.',
      date: '2024-12-22'
    }
  ]

  return (
    <div>
      {reviews.map(review => (
        <Card key={review.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <h6>{review.userName}</h6>
              <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
            <div className="mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < review.rating ? 'text-warning' : 'text-muted'} />
              ))}
            </div>
            <p>{review.comment}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default AdminReviews
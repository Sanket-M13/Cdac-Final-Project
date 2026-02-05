import { mockStorage, initializeMockData } from './mockDataService'

// Initialize mock data on service load
initializeMockData()

export const reviewService = {
  createReview: async (reviewData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const reviews = mockStorage.getReviews()
    const currentUser = mockStorage.getCurrentUser()
    
    if (!currentUser) {
      throw new Error('User not authenticated')
    }
    
    const newReview = {
      id: Math.max(...reviews.map(r => r.id), 0) + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    reviews.push(newReview)
    mockStorage.setReviews(reviews)
    
    return { review: newReview }
  },

  getStationReviews: async (stationId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const reviews = mockStorage.getReviews()
    const stationReviews = reviews.filter(r => r.stationId === parseInt(stationId))
    
    return { reviews: stationReviews }
  },

  getAllReviews: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const reviews = mockStorage.getReviews()
    return { reviews }
  },

  updateReview: async (id, reviewData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const reviews = mockStorage.getReviews()
    const index = reviews.findIndex(r => r.id === parseInt(id))
    
    if (index === -1) {
      throw new Error('Review not found')
    }
    
    reviews[index] = {
      ...reviews[index],
      ...reviewData,
      updatedAt: new Date().toISOString()
    }
    
    mockStorage.setReviews(reviews)
    
    return { review: reviews[index] }
  },

  deleteReview: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const reviews = mockStorage.getReviews()
    const filteredReviews = reviews.filter(r => r.id !== parseInt(id))
    
    if (reviews.length === filteredReviews.length) {
      throw new Error('Review not found')
    }
    
    mockStorage.setReviews(filteredReviews)
    
    return { message: 'Review deleted successfully' }
  },

  submitQuery: async (queryData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const currentUser = mockStorage.getCurrentUser()
    
    // For mock service, just return success
    // In real implementation, you would store the query
    const query = {
      id: Date.now(),
      userId: currentUser?.id,
      userName: currentUser?.name,
      userEmail: currentUser?.email,
      ...queryData,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    }
    
    return { query, message: 'Query submitted successfully' }
  },

  getUserQueries: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // For mock service, return empty array
    // In real implementation, you would filter queries by user
    return { queries: [] }
  }
}
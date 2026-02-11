import { API_CONFIG, API_ENDPOINTS } from '../constants/apiConstants';

export const paymentService = {
  initializeRazorpay: async (amount) => { // NOTE: The original function signature was empty, but usage might expect args. However, checking previous file content, it was just loading script. I'll keep it as is but fix syntax if needed.
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  },

  createOrder: async (amount) => {
    try {
      // Convert amount to paise (multiply by 100) and ensure it's an integer
      const amountInPaise = Math.round(parseFloat(amount) * 100)

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PAYMENT.CREATE_ORDER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: amountInPaise })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  processPayment: (orderData, onSuccess, onFailure) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency || 'INR',
      name: 'EV Charger',
      description: 'Charging Station Booking',
      order_id: orderData.id,
      handler: function (response) {

        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PAYMENT.VERIFY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: orderData.amount // Send amount in paise for verification
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              onSuccess(response)
            } else {
              onFailure('Payment verification failed')
            }
          })
          .catch(error => {
            console.error('Payment verification error:', error)
            onFailure('Payment verification failed')
          })
      },
      prefill: {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || ''
      },
      theme: {
        color: '#007bff'
      },
      modal: {
        ondismiss: function () {
          onFailure('Payment cancelled by user')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }
}


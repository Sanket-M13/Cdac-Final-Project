import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'qXmPfLLE2JuNBPuuV'
const EMAILJS_SERVICE_ID = 'service_5ge65dl'
const EMAILJS_TEMPLATE_ID = 'template_haoa8eh'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export const emailService = {
  sendBookingConfirmation: async (bookingDetails) => {
    try {
      console.log('Sending email with details:', bookingDetails)
      
      const templateParams = {
        to_email: bookingDetails.userEmail,
        to_name: bookingDetails.userName,
        user_name: bookingDetails.userName,
        user_email: bookingDetails.userEmail,
        station_name: bookingDetails.stationName,
        station_address: bookingDetails.stationAddress,
        booking_date: bookingDetails.date,
        booking_time: bookingDetails.timeSlot,
        duration: bookingDetails.duration,
        total_amount: bookingDetails.amount,
        payment_id: bookingDetails.paymentId,
        booking_id: bookingDetails.bookingId || 'N/A'
      }

      console.log('Template params:', templateParams)
      console.log('Using service:', EMAILJS_SERVICE_ID)
      console.log('Using template:', EMAILJS_TEMPLATE_ID)

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )

      console.log('Email sent successfully:', response)
      return { success: true, response }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { success: false, error }
    }
  }
}
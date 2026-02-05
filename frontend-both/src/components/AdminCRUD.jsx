import React, { useState, useEffect } from 'react';
import { stationService } from '../services/stationService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { reviewService } from '../services/reviewService';

const AdminCRUD = () => {
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('stations');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'stations':
          const stationsData = await stationService.getAllStations();
          setStations(stationsData);
          break;
        case 'bookings':
          const bookingsData = await bookingService.getAllBookings();
          setBookings(bookingsData);
          break;
        case 'users':
          const usersData = await userService.getAllUsers();
          setUsers(usersData);
          break;
        case 'reviews':
          const reviewsData = await reviewService.getAllReviews();
          setReviews(reviewsData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      switch (type) {
        case 'station':
          await stationService.deleteStation(id);
          break;
        case 'booking':
          await bookingService.deleteBooking(id);
          break;
        case 'user':
          await userService.deleteUser(id);
          break;
        case 'review':
          await reviewService.deleteReview(id);
          break;
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateBooking(id, { status, endTime: new Date().toISOString() });
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin CRUD Operations</h1>
      
      <div className="flex space-x-4 mb-6">
        {['stations', 'bookings', 'users', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'stations' && (
        <div>
          <h2 className="text-xl mb-4">Stations</h2>
          <div className="grid gap-4">
            {stations.map(station => (
              <div key={station.id} className="border p-4 rounded">
                <h3 className="font-bold">{station.name}</h3>
                <p>{station.address}</p>
                <p>Available: {station.availableSlots}/{station.totalSlots}</p>
                <button 
                  onClick={() => handleDelete(station.id, 'station')}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl mb-4">Bookings</h2>
          <div className="grid gap-4">
            {bookings.map(booking => (
              <div key={booking.id} className="border p-4 rounded">
                <h3 className="font-bold">{booking.stationName}</h3>
                <p>User: {booking.userName}</p>
                <p>Vehicle: {booking.vehicleNumber}</p>
                <p>Status: {booking.status}</p>
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Complete
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(booking.id, 'booking')}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl mb-4">Users</h2>
          <div className="grid gap-4">
            {users.map(user => (
              <div key={user.id} className="border p-4 rounded">
                <h3 className="font-bold">{user.name}</h3>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
                {user.role !== 'admin' && (
                  <button 
                    onClick={() => handleDelete(user.id, 'user')}
                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-xl mb-4">Reviews</h2>
          <div className="grid gap-4">
            {reviews.map(review => (
              <div key={review.id} className="border p-4 rounded">
                <h3 className="font-bold">{review.stationName}</h3>
                <p>User: {review.userName}</p>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                <button 
                  onClick={() => handleDelete(review.id, 'review')}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRUD;
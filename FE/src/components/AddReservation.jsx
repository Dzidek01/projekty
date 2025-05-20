// src/components/AddReservation.js
import React, { useState, useEffect, useContext } from 'react';
import { createReservation, fetchRooms } from '../api/api';
import { AuthContext } from '../App';

const AddReservation = ({ hotelId, onReservationAdded }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    room_number: '',
    start_date: '',
    end_date: ''
  });
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !hotelId) return;

    const loadRooms = async () => {
      try {
        const data = await fetchRooms(hotelId);
        setRooms(data);
      } catch (err) {
        console.error('Failed to load rooms', err);
      }
    };
    loadRooms();
  }, [hotelId, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Walidacja dat
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      await createReservation(hotelId, {
        ...formData,
        room_number: parseInt(formData.room_number)
      });
      setSuccess('Reservation added successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        room_number: '',
        start_date: '',
        end_date: ''
      });
      if (onReservationAdded) onReservationAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add reservation');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white shadow-md rounded p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Reservation</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          
          <select
            name="room_number"
            value={formData.room_number}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.room_number}>
                Room {room.room_number} (Beds: {room.available_beds}/{room.total_beds})
              </option>
            ))}
          </select>
          
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Reservation
        </button>
      </form>
    </div>
  );
};

export default AddReservation;
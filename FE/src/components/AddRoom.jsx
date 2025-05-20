// src/components/AddRoom.js
import React, { useState, useContext } from 'react';
import { createRoom } from '../api/api';
import { AuthContext } from '../App';

const AddRoom = ({ hotelId, onRoomAdded }) => {
  const [roomData, setRoomData] = useState({
    room_number: '',
    total_beds: '',
    available_beds: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!roomData.room_number || !roomData.total_beds) {
      setError('Room number and total beds are required');
      return;
    }

    try {
      await createRoom(hotelId, {
        room_number: parseInt(roomData.room_number),
        total_beds: parseInt(roomData.total_beds),
        available_beds: parseInt(roomData.available_beds || roomData.total_beds)
      });
      setSuccess('Room added successfully!');
      setRoomData({
        room_number: '',
        total_beds: '',
        available_beds: ''
      });
      if (onRoomAdded) onRoomAdded();
    } catch (err) {
      setError('Failed to add room');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white shadow-md rounded p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Room</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="number"
            name="room_number"
            placeholder="Room Number"
            value={roomData.room_number}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="total_beds"
            placeholder="Total Beds"
            value={roomData.total_beds}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="available_beds"
            placeholder="Available Beds (optional)"
            value={roomData.available_beds}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
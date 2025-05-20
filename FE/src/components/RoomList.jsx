// src/components/RoomList.js
import React, { useState, useEffect, useContext } from 'react';
import { fetchRooms, deleteRoom } from '../api/api';
import { AuthContext } from '../App';

const RoomList = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !hotelId) return;

    const loadRooms = async () => {
      try {
        const data = await fetchRooms(hotelId);
        setRooms(data);
      } catch (err) {
        setError('Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [hotelId, isAuthenticated]);

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(hotelId, roomId);
      setRooms(rooms.filter(room => room.id !== roomId));
    } catch (err) {
      setError('Failed to delete room');
    }
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>
      
      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Room {room.room_number}</h3>
                <p>Beds: {room.available_beds}/{room.total_beds} available</p>
              </div>
              <button
                onClick={() => handleDelete(room.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
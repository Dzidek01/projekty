import React, { useState, useEffect } from 'react';
import AddRoom from '../components/rooms/AddRoom';
import RoomList from '../components/rooms/RoomList';

const Rooms = ({ hotelId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setToken(adminToken);
      setError('');
    } else {
      setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
    }
  }, []);

  const handleRoomAdded = () => {
    setRefreshTrigger((prev) => prev + 1); 
  };

  useEffect(() => {
    if (!hotelId) {
      setError('Hotel nie został wybrany. Wybierz hotel, aby zarządzać pokojami.');
    } else {
      setError('');
    }
  }, [hotelId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AddRoom hotelId={hotelId} onRoomAdded={handleRoomAdded} token={token} />
      <RoomList hotelId={hotelId} refreshTrigger={refreshTrigger} token={token} />
    </div>
  );
};

export default Rooms;

import React, { useState, useEffect } from 'react';
import { addRoom } from '../../api/api';

const AddRoom = ({ hotelId, onRoomAdded }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [totalBeds, setTotalBeds] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    
    if (!hotelId) {
      setError('Hotel nie został wybrany. Wybierz hotel, aby kontynuować.');
      return;
    }

    if (!roomNumber.trim()) {
      setError('Proszę wprowadzić numer pokoju.');
      return;
    }

    const bedsNumber = parseInt(totalBeds);
    if (isNaN(bedsNumber) || bedsNumber <= 0) {
      setError('Liczba łóżek musi być liczbą większą od 0.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await addRoom(hotelId, { 
        room_number: roomNumber.trim(), 
        total_beds: bedsNumber 
      }, token);

      console.log("odpowiedź z API:", response);
      
      onRoomAdded(); 
      setRoomNumber('');
      setTotalBeds('');
      setSuccessMessage('Pokój został dodany pomyślnie!');
    } catch (error) {
      console.error('Błąd podczas dodawania pokoju:', error);
      setError(error.response?.data?.message || 'Błąd podczas dodawania pokoju. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Dodaj Pokój</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Numer Pokoju"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Liczba Łóżek"
          value={totalBeds}
          onChange={(e) => setTotalBeds(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading || !token}
        >
          {isLoading ? 'Dodawanie...' : 'Dodaj Pokój'}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;

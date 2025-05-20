import React, { useState, useEffect } from 'react';
import { addReservation } from '../../api/api';

const AddReservation = ({ hotelId, onReservationAdded = () => {} }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setMessage('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!hotelId) {
      setMessage('Hotel nie został wybrany. Wybierz hotel, aby kontynuować.');
      return;
    }

    if (!firstName || !lastName || !roomNumber || !startDate || !endDate) {
      setMessage('Wszystkie pola są wymagane.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setMessage('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
      return;
    }

    if (!token) {
      setMessage('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await addReservation(
        hotelId,
        {
          first_name: firstName,
          last_name: lastName,
          room_number: roomNumber,
          start_date: startDate,
          end_date: endDate,
        },
        token 
      );

      setMessage('Rezerwacja została dodana!');
      onReservationAdded(response.reservation);
      setFirstName('');
      setLastName('');
      setRoomNumber('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setMessage(`Błąd podczas dodawania rezerwacji: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Dodaj Rezerwację</h2>
      {message && (
        <div className={`mb-4 ${message.includes('Błąd') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Imię"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Nazwisko"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Numer Pokoju"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading || !token}
        >
          {isLoading ? 'Dodawanie...' : 'Dodaj Rezerwację'}
        </button>
      </form>
    </div>
  );
};

export default AddReservation;

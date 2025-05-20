import React, { useState, useEffect } from 'react';
import AddReservation from '../components/reservations/AddReservation';
import ReservationList from '../components/reservations/ReservationList';

const Reservations = ({ hotelId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken'); 

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
    } else if (!hotelId) {
      setError('Hotel nie został wybrany. Wybierz hotel, aby zarządzać rezerwacjami.');
    } else {
      setError('');
    }
  }, [hotelId, token]);

  const handleReservationUpdated = () => {
    setRefreshTrigger((prev) => prev + 1); 
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AddReservation hotelId={hotelId} onReservationAdded={handleReservationUpdated} token={token} />
      <ReservationList hotelId={hotelId} refreshTrigger={refreshTrigger} token={token} />
    </div>
  );
};

export default Reservations;

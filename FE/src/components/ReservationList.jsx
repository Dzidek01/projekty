// src/components/ReservationList.js
import React, { useState, useEffect, useContext } from 'react';
import { fetchReservations, createReservation } from '../api/api';
import { AuthContext } from '../App';

const ReservationList = ({ hotelId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReservation, setNewReservation] = useState({
    first_name: '',
    last_name: '',
    room_number: '',
    start_date: '',
    end_date: ''
  });
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadReservations = async () => {
      try {
        const data = await fetchReservations(hotelId);
        setReservations(data);
      } catch (err) {
        setError('Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };
    loadReservations();
  }, [hotelId, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdReservation = await createReservation(hotelId, {
        ...newReservation,
        room_number: parseInt(newReservation.room_number)
      });
      setReservations([...reservations, createdReservation]);
      setNewReservation({
        first_name: '',
        last_name: '',
        room_number: '',
        start_date: '',
        end_date: ''
      });
    } catch (err) {
      setError('Failed to create reservation');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Reservations</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={newReservation.first_name}
            onChange={(e) => setNewReservation({...newReservation, first_name: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newReservation.last_name}
            onChange={(e) => setNewReservation({...newReservation, last_name: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Room Number"
            value={newReservation.room_number}
            onChange={(e) => setNewReservation({...newReservation, room_number: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newReservation.start_date}
            onChange={(e) => setNewReservation({...newReservation, start_date: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            placeholder="End Date"
            value={newReservation.end_date}
            onChange={(e) => setNewReservation({...newReservation, end_date: e.target.value})}
            className="p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Reservation
        </button>
      </form>

      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="border p-4 rounded hover:bg-gray-50">
            <h3 className="font-bold">{reservation.first_name} {reservation.last_name}</h3>
            <p>Room: {reservation.room_number}</p>
            <p>Dates: {reservation.start_date} to {reservation.end_date}</p>
            <p>Status: {reservation.is_paid ? 'Paid' : 'Unpaid'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
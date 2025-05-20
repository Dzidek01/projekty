import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AddReservation from '../components/AddReservation';
import ReservationList from '../components/ReservationList';

const ReservationsPage = () => {
  const { hotelId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!hotelId) return <div className="p-4 text-red-500">Please select a hotel first</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reservations Management</h1>
      <AddReservation 
        hotelId={parseInt(hotelId)} 
        onReservationAdded={() => setRefreshKey(prev => prev + 1)} 
      />
      <ReservationList 
        hotelId={parseInt(hotelId)} 
        key={refreshKey} 
      />
    </div>
  );
};

export default ReservationsPage;
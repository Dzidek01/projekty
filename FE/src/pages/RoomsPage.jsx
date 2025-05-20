import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AddRoom from '../components/AddRoom';
import RoomList from '../components/RoomList';

const RoomsPage = () => {
  const { hotelId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!hotelId) return <div className="p-4 text-red-500">Please select a hotel first</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Rooms Management</h1>
      <AddRoom 
        hotelId={parseInt(hotelId)} 
        onRoomAdded={() => setRefreshKey(prev => prev + 1)} 
      />
      <RoomList 
        hotelId={parseInt(hotelId)} 
        key={refreshKey} 
      />
    </div>
  );
};

export default RoomsPage;
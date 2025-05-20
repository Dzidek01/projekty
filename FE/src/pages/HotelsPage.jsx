import React from 'react';
import HotelList from '../components/HotelList';

const HotelsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hotels Management</h1>
      <HotelList />
    </div>
  );
};

export default HotelsPage;
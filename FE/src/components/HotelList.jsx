// src/components/HotelList.js
import React, { useState, useEffect, useContext } from 'react';
import { fetchHotels, createHotel } from '../api/api';
import { AuthContext } from '../App';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newHotel, setNewHotel] = useState({ name: '', address: '', city: '' });
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHotels = async () => {
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (err) {
        setError('Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdHotel = await createHotel(newHotel);
      setHotels([...hotels, createdHotel]);
      setNewHotel({ name: '', address: '', city: '' });
    } catch (err) {
      setError('Failed to create hotel');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Hotels</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newHotel.name}
            onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={newHotel.address}
            onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={newHotel.city}
            onChange={(e) => setNewHotel({...newHotel, city: e.target.value})}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Hotel
        </button>
      </form>

      <div className="space-y-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border p-4 rounded hover:bg-gray-50">
            <h3 className="font-bold">{hotel.name}</h3>
            {hotel.address && <p>Address: {hotel.address}</p>}
            {hotel.city && <p>City: {hotel.city}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelList;
import React, { useState, useEffect } from 'react';
import { fetchHotels } from '../../api/api';

const HotelSelector = ({ onHotelSelect, initialSelectedHotelId }) => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(initialSelectedHotelId || null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getHotels = async () => {
      try {
        const response = await fetchHotels();
        const hotelsData = response.data?.data || response.data || response;
        setHotels(hotelsData);
      } catch (error) {
        console.error('Błąd podczas pobierania listy hoteli:', error);
        setError('Nie udało się pobrać listy hoteli.');
      }
    };

    getHotels();
  }, []);

  const handleHotelClick = (hotelId) => {
    setSelectedHotelId(hotelId);
    onHotelSelect(hotelId);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-lg font-semibold mb-4">Wybierz hotel:</h3>
      <ul className="grid gap-2">
        {hotels.map((hotel) => (
          <li
            key={hotel.id}
            onClick={() => handleHotelClick(hotel.id)}
            className={`p-4 border rounded cursor-pointer transition ${
              selectedHotelId === hotel.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {hotel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelSelector;

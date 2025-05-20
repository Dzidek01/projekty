import React, { useState, useEffect } from 'react';
import { fetchRooms, updateRoom, deleteRoom } from '../../api/api';

const RoomList = ({ hotelId, refreshTrigger }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [updatedRoomNumber, setUpdatedRoomNumber] = useState('');
  const [updatedTotalBeds, setUpdatedTotalBeds] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
      setIsLoading(false);
      return;
    }

    const getRooms = async () => {
      if (!hotelId) {
        setError('Hotel nie został wybrany.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetchRooms(hotelId, token);
        const data = response.data;
        setRooms(data.filter((room) => room.room_number && room.total_beds && room.available_beds));
      } catch (error) {
        setError('Błąd podczas pobierania pokoi.');
        console.error('Błąd podczas pobierania pokoi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getRooms();
  }, [hotelId, refreshTrigger, token]);

  const handleEdit = (room) => {
    setEditingRoom(room.id);
    setUpdatedRoomNumber(room.room_number);
    setUpdatedTotalBeds(room.total_beds);
    setError('');
    setSuccessMessage('');
  };

  const handleUpdate = async (id) => {
    try {
      if (!token) {
        setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
        return;
      }

      const totalBeds = parseInt(updatedTotalBeds, 10);

      if (isNaN(totalBeds) || totalBeds <= 0) {
        setError('Liczba łóżek musi być większa od 0.');
        return;
      }

      const currentRoom = rooms.find((room) => room.id === id);
      if (!currentRoom) {
        setError('Pokój nie został znaleziony.');
        return;
      }

      const oldTotalBeds = currentRoom.total_beds;
      const oldAvailableBeds = currentRoom.available_beds;

      const updatedAvailableBeds = oldAvailableBeds + (totalBeds - oldTotalBeds);

      await updateRoom(hotelId, id, { room_number: updatedRoomNumber, total_beds: totalBeds }, token);

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === id
            ? {
                ...room,
                room_number: updatedRoomNumber,
                total_beds: totalBeds,
                available_beds: updatedAvailableBeds,
              }
            : room
        )
      );
      setEditingRoom(null);
      setSuccessMessage('Pokój został zaktualizowany.');
    } catch (error) {
      setError('Błąd podczas aktualizacji pokoju.');
      console.error('Błąd podczas aktualizacji pokoju:', error.response?.data || error);
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    try {
      if (!token) {
        setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
        return;
      }

      await deleteRoom(hotelId, id, token);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      setSuccessMessage('Pokój został usunięty.');
    } catch (error) {
      setError('Błąd podczas usuwania pokoju.');
      console.error('Błąd podczas usuwania pokoju:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Lista Pokoi</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {isLoading ? (
        <p className="text-gray-500">Ładowanie...</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500">Brak dostępnych pokoi.</p>
      ) : (
        <ul className="grid gap-1">
          {rooms.map((room) => (
            <li key={room.id} className="bg-blue-100 p-4 rounded shadow">
              {editingRoom === room.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={updatedRoomNumber}
                    onChange={(e) => setUpdatedRoomNumber(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={updatedTotalBeds}
                    onChange={(e) => setUpdatedTotalBeds(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(room.id)} className="bg-green-500 text-white px-4 py-2 rounded">
                      Zapisz
                    </button>
                    <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>
                    Pokój {room.room_number} - Łóżka: {room.available_beds}/{room.total_beds}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(room)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                      Edytuj
                    </button>
                    <button onClick={() => handleDelete(room.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                      Usuń
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;

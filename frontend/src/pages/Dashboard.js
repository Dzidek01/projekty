import React, { useEffect, useState } from 'react';
import { fetchRooms } from '../api/api';
import HotelSelector from '../components/hotels/HotelSelector';

const Dashboard = ({ selectedHotelId, setSelectedHotelId }) => {
    const [reservationsCount, setReservationsCount] = useState(0);
    const [roomsCount, setRoomsCount] = useState(0);
    const [bedsCount, setBedsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hotelDataLoaded, setHotelDataLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedHotelId) {
                setError('Proszę wybrać hotel, aby wyświetlić dane.');
                setHotelDataLoaded(false);
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                // Pobieranie rezerwacji
                const reservationsResponse = await fetch(`http://192.168.18.2:5000/reservations/${selectedHotelId}`);
                if (!reservationsResponse.ok) {
                    throw new Error('Błąd podczas pobierania rezerwacji');
                }
                const reservationsData = await reservationsResponse.json();
                setReservationsCount(reservationsData.activeReservations || 0); 

                // Pobieranie pokoi
                const roomsResponse = await fetchRooms(selectedHotelId);
                const rooms = Array.isArray(roomsResponse?.data) ? roomsResponse.data : [];
                setRoomsCount(rooms.length);

                // Obliczanie liczby łóżek
                const totalBeds = rooms.reduce((sum, room) => sum + (room.total_beds || 0), 0);
                setBedsCount(totalBeds);

                setHotelDataLoaded(true);
            } catch (err) {
                console.error('Błąd podczas pobierania danych:', err);
                setError('Nie udało się pobrać danych. Spróbuj ponownie później.');
                setReservationsCount(0);
                setRoomsCount(0);
                setBedsCount(0);
                setHotelDataLoaded(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedHotelId]);

    const handleHotelSelect = (id) => {
        setSelectedHotelId(id);
        setError('');
        setHotelDataLoaded(false);
    };

    return (
        <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-bold mb-4">Strona Główna</h2>

            <HotelSelector
                onHotelSelect={handleHotelSelect}
                initialSelectedHotelId={selectedHotelId}
            />

            {isLoading ? (
                <p className="text-gray-500">Ładowanie danych...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : selectedHotelId && hotelDataLoaded ? (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Podsumowanie dla hotelu:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-40 p-4 rounded">
                            <p className="font-bold">Aktywne rezerwacje</p>
                            <p className="text-2xl">{reservationsCount}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                            <p className="font-bold">Liczba pokoi</p>
                            <p className="text-2xl">{roomsCount}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded">
                            <p className="font-bold">Liczba łóżek</p>
                            <p className="text-2xl">{bedsCount}</p>
                        </div>
                    </div>

                    {reservationsCount === 0 && (
                        <p className="text-gray-500 mt-4">Brak aktywnych rezerwacji dla tego hotelu.</p>
                    )}
                    {roomsCount === 0 && (
                        <p className="text-gray-500 mt-2">Brak pokoi dla tego hotelu.</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">
                    {selectedHotelId ? 'Ładowanie danych hotelu...' : 'Wybierz hotel, aby zobaczyć szczegóły.'}
                </p>
            )}
        </div>
    );
};

export default Dashboard;
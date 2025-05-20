import React, { useState, useEffect } from 'react';
import {
  fetchReservations,
  updateReservation,
  deleteReservation,
  fetchNote,
  updateNote,
} from '../../api/api';

const ReservationList = ({ hotelId, refreshTrigger }) => {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [updatedStartDate, setUpdatedStartDate] = useState('');
  const [updatedEndDate, setUpdatedEndDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [note, setNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setError('Brak tokenu autoryzacyjnego. Zaloguj się ponownie.');
      return;
    }

    const getReservations = async () => {
      if (!hotelId) {
        setError('Hotel nie został wybrany.');
        return;
      }
      try {
        const response = await fetchReservations(hotelId, token);
        
        // Dodaj zabezpieczenie przed nieoczekiwaną strukturą danych
        if (!response || !response.data) {
          throw new Error('Nieprawidłowa struktura odpowiedzi z API');
        }

        // Sprawdź czy response.data jest tablicą
        const reservationsData = Array.isArray(response.data) ? response.data : [response.data];
        
        const formattedData = reservationsData.map((res) => ({
          ...res,
          start_date: res.start_date ? res.start_date.split('T')[0] : '',
          end_date: res.end_date ? res.end_date.split('T')[0] : '',
          paid: res.end_date ? new Date(res.end_date) >= new Date() : false,
        }));
        setReservations(formattedData);
      } catch (error) {
        setError('Błąd podczas pobierania rezerwacji.');
        console.error('Błąd podczas pobierania rezerwacji:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getReservations();
  }, [hotelId, refreshTrigger, token]);

  const handleTogglePayment = async (id) => {
  try {
    setIsLoading(true);
    const reservation = reservations.find((res) => res.id === id);
    if (!reservation) {
      throw new Error('Rezerwacja nie została znaleziona');
    }
    const currentEndDate = new Date(reservation.end_date);
    const isPaid = reservation.paid;
    const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1));
    const newEndDateString = newEndDate.toISOString().split('T')[0];
    await updateReservation(
        hotelId,
        id,
        { end_date: newEndDateString },
        token
      );

    setReservations((prev) =>
      prev.map((res) =>
        res.id === id
          ? {
              ...res,
              end_date: newEndDateString,
              paid: isPaid,
            }
          : res
      )
    );
    setSuccessMessage('Rezerwacja została przedłużona o miesiąc.');
  } catch (error) {
    console.error('Błąd przedłużania rezerwacji:', error);
    setError(error.response?.data?.message || 'Błąd przedłużania rezerwacji.');
  } finally {
    setIsLoading(false);
  }
};

  const handleEdit = (reservation) => {
    setEditingReservation(reservation.id);
    setUpdatedStartDate(reservation.start_date);
    setUpdatedEndDate(reservation.end_date);
  };

  const handleUpdate = async (id) => {
    try {
      if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
        setError('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
        return;
      }
      await updateReservation(
        hotelId,
        id,
        { start_date: updatedStartDate, end_date: updatedEndDate },
        token
      );

      setReservations((prev) =>
        prev.map((res) =>
          res.id === id
            ? {
                ...res,
                start_date: updatedStartDate.split('T')[0],
                end_date: updatedEndDate.split('T')[0],
                paid: new Date(updatedEndDate) >= new Date(),
              }
            : res
        )
      );
      
      setSuccessMessage('Rezerwacja została zaktualizowana.');
      setEditingReservation(null);
    } catch (error) {
      setError('Błąd podczas aktualizacji rezerwacji.');
      console.error('Błąd podczas aktualizacji rezerwacji:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReservation(hotelId, id, token);
      setReservations((prev) => prev.filter((res) => res.id !== id));
      setSuccessMessage('Rezerwacja została usunięta.');
    } catch (error) {
      setError('Błąd podczas usuwania rezerwacji.');
      console.error('Błąd podczas usuwania rezerwacji:', error);
    }
  };

  const handleNoteToggle = async (id) => {
  if (selectedReservationId === id) {
    setSelectedReservationId(null);
    setNote('');
    return;
  }

  try {
    setIsLoading(true);
    const response = await fetchNote(hotelId, id, token);
    
    // Bezpośredni odczyt z response.data.note
    const noteContent = response.data.note || '';
    console.log('Pobrana notatka:', noteContent);
    
    setSelectedReservationId(id);
    setNote(noteContent);
  } catch (error) {
    console.error('Błąd pobierania notatki:', error.response?.data || error);
    setError('Nie udało się załadować notatki');
  } finally {
    setIsLoading(false);
  }
};

  const handleSaveNote = async () => {
    try {
      setIsSavingNote(true);
      await updateNote(hotelId, selectedReservationId, note, token);
      setSuccessMessage('Notatka została zapisana!');
    } catch (error) {
      console.error('Błąd podczas zapisywania notatki:', error);
      setError('Nie udało się zapisać notatki.');
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-bold mb-4">Lista Rezerwacji</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {isLoading ? (
        <p className="text-gray-500">Ładowanie rezerwacji...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">Brak dostępnych rezerwacji.</p>
      ) : (
        <ul className="grid gap-3">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="bg-blue-100 p-4 rounded shadow flex flex-col md:flex-row justify-between items-center gap-4"
            >
              {editingReservation === res.id ? (
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <input
                    type="date"
                    value={updatedStartDate}
                    onChange={(e) => setUpdatedStartDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="date"
                    value={updatedEndDate}
                    onChange={(e) => setUpdatedEndDate(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={() => handleUpdate(res.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditingReservation(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Anuluj
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>
                    {res.first_name} {res.last_name} - Pokój {res.room_number} (
                    {res.start_date} do {res.end_date})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePayment(res.id)}
                      className={`${
                        res.paid ? 'bg-green-500' : 'bg-red-500'
                      } text-white px-4 py-2 rounded`}
                    >
                      {res.paid ? 'Opłacone' : 'Nieopłacone'}
                    </button>
                    <button
                      onClick={() => handleEdit(res)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Usuń
                    </button>
                    <button
                      onClick={() => handleNoteToggle(res.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Notatka
                    </button>
                  </div>
                </div>
              )}
              {selectedReservationId === res.id && (
                <div className="mt-2 p-2 bg-gray-50 border rounded w-full">
                  <textarea
                    value={note || ''}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Dodaj notatkę..."
                  />
                  <button
                    onClick={handleSaveNote}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isSavingNote}
                  >
                    {isSavingNote ? 'Zapisywanie...' : 'Zapisz Notatkę'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;

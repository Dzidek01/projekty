import React, { useEffect, useState } from 'react';
import { fetchReservations } from '../api/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const Calendar = ({ hotelId }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    const getReservations = async () => {
      const token = localStorage.getItem('adminToken');
  
      if (!hotelId) {
        setError('Wybierz hotel aby zobaczyć rezerwacje');
        setIsLoading(false);
        return;
      }
  
      if (!token) {
        setError('Wymagane ponowne logowanie');
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        const data = await fetchReservations(hotelId);
        const response = data.data;
        const formattedEvents = response.flatMap((reservation) => {
          const startDate = new Date(reservation.start_date);
          const endDate = new Date(reservation.end_date);
          const events = [];

          // Dodaj wydarzenia dla pierwszego dnia i ostatniego dnia
          events.push({
            id: `${reservation.id}-start`,
            title: `Start: Pokój ${reservation.room_number}`,
            start: startDate,
            allDay: true,
            color: '#10b981', // Zielony
            extendedProps: {
              roomNumber: reservation.room_number,
              guest: reservation.first_name + ' ' + reservation.last_name,
              startDate: reservation.start_date,
              endDate: reservation.end_date,
            },
          });

          events.push({
            id: `${reservation.id}-end`,
            title: `Koniec: Pokój ${reservation.room_number}`,
            start: endDate,
            allDay: true,
            color: '#ef4444', // Czerwony
            extendedProps: {
              roomNumber: reservation.room_number,
              guest: reservation.first_name + ' ' + reservation.last_name,
              startDate: reservation.start_date,
              endDate: reservation.end_date,
            },
          });

          // Jeśli różnica między start a end jest większa niż 40 dni, dodaj wydarzenia co miesiąc
          const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          if (diffInDays > 40) {
            let currentDate = new Date(startDate);
            currentDate.setMonth(currentDate.getMonth() + 1);
            while (currentDate < endDate) {
              events.push({
                id: `${reservation.id}-monthly-${currentDate.toISOString()}`,
                title: `Pokój ${reservation.room_number}`,
                start: new Date(currentDate),
                allDay: true,
                color: '#f59e0b', // Pomarańczowy
                extendedProps: {
                  roomNumber: reservation.room_number,
                  guest: reservation.first_name + ' ' + reservation.last_name,
                  startDate: reservation.start_date,
                  endDate: reservation.end_date,
                },
              });
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
          }

          return events;
        });
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Błąd pobierania rezerwacji:', error);
        setError('Nie udało się załadować rezerwacji');
      } finally {
        setIsLoading(false);
      }
    };
  
    getReservations();
  }, [hotelId]);

  if (isLoading) {
    return <div className="text-center py-4">Ładowanie kalendarza...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Kalendarz Rezerwacji</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="pl"
        firstDay={1} // Poniedziałek jako pierwszy dzień tygodnia
        eventClick={(info) => {
          const { extendedProps } = info.event;
          alert(`
            Pokój: ${extendedProps.roomNumber}
            Gość: ${extendedProps.guest}
            Od: ${extendedProps.startDate}
            Do: ${extendedProps.endDate}
          `);
        }}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventContent={(arg) => (
          <div className="fc-event-content">
            <div className="text-xs font-medium truncate">
              {arg.event.title}
            </div>
          </div>
        )}
        eventClassNames="cursor-pointer"
        dayMaxEvents={3}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
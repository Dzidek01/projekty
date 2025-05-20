import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Rooms from './pages/Rooms';
import Calendar from './pages/Calendar';
import AdminLogin from './pages/AdminLogin';

console.log('API URL:', process.env.REACT_APP_API_URL);


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  
  const handleLogin = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setSelectedHotelId(null); 
  };

  
  const withHotelCheck = (Component, props = {}) => {
    if (!selectedHotelId) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Component {...props} hotelId={selectedHotelId} />;
  };

  
  const requireAuth = (Component, props = {}) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <Component {...props} />;
  };

  return (
    <Router>
      <div className="container mx-auto p-4">
        {}
        {isAuthenticated && (
          <nav className="flex justify-between items-center bg-blue-600 text-white p-4 rounded mb-4">
            <h1 className="text-xl font-bold">Hostel Booking App</h1>
            <div className="flex gap-4">
              <Link to="/dashboard" className="hover:underline">Strona Główna</Link>
              <Link to="/reservations" className="hover:underline">Rezerwacje</Link>
              <Link to="/rooms" className="hover:underline">Pokoje i Łóżka</Link>
              <Link to="/calendar" className="hover:underline">Kalendarz</Link>
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Wyloguj</button>
            </div>
          </nav>
        )}

        
        <Routes>
          {/* Strona logowania */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={requireAuth(Dashboard, {
              selectedHotelId,
              setSelectedHotelId,
            })}
          />

          {/* Rezerwacje */}
          <Route
            path="/reservations"
            element={requireAuth(() =>
              withHotelCheck(Reservations)
            )}
          />

          {/* Pokoje */}
          <Route
            path="/rooms"
            element={requireAuth(() =>
              withHotelCheck(Rooms)
            )}
          />

          {/* Kalendarz */}
          <Route
            path="/calendar"
            element={requireAuth(() =>
              withHotelCheck(Calendar)
            )}
          />         
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

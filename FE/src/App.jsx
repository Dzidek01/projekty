// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage.jsx';
import HotelsPage from './pages/HotelsPage';
import RoomsPage from './pages/RoomsPage';
import ReservationsPage from './pages/ReservationsPage';
import Navbar from './components/Navbar';

export const AuthContext = React.createContext();
export const useAuth = () => React.useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {isAuthenticated && <Navbar />}
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/hotels" element={isAuthenticated ? <HotelsPage /> : <Navigate to="/login" />} />
              <Route path="/rooms" element={isAuthenticated ? <RoomsPage /> : <Navigate to="/login" />} />
              <Route path="/reservations" element={isAuthenticated ? <ReservationsPage /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Dashboard
            </Link>
            <Link 
              to="/hotels" 
              className="px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Hotels
            </Link>
            <Link 
              to="/rooms" 
              className="px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Rooms
            </Link>
            <Link 
              to="/reservations" 
              className="px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Reservations
            </Link>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Brak tokenu. Przekierowanie na stronę logowania.');
    return <Navigate to="/admin/login" />;
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));

    if (role && decoded.role !== role) {
      console.error('Nieprawidłowa rola użytkownika. Przekierowanie na stronę główną.');
      return <Navigate to="/" />;
    }

    const tokenExpiration = decoded.exp * 1000;
    if (Date.now() > tokenExpiration) {
      console.error('Token wygasł. Przekierowanie na stronę logowania.');
      return <Navigate to="/admin/login" />;
    }

    return children;
  } catch (error) {
    console.error('Błąd podczas weryfikacji tokenu:', error);
    return <Navigate to="/admin/login" />;
  }
};

export default ProtectedRoute;

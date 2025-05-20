import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { fetchAdminLogin } from '../api/api';

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetchAdminLogin(username, password);
      console.log('Odpowiedź z serwera:', response.data);
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        onLogin();
        navigate('/dashboard');
      } else {
        throw new Error('Brak tokenu w odpowiedzi serwera');
      }
    } catch (err) {
      // Obsługa błędów Axiosa
      if (err.response) {
        // Błąd z serwera (np. 401 Unauthorized)
        setError(err.response.data?.error || 'Nieprawidłowe dane logowania');
      } else if (err.request) {
        // Brak odpowiedzi z serwera
        setError('Brak połączenia z serwerem');
      } else {
        // Inne błędy
        setError(err.message || 'Wystąpił błąd podczas logowania');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Logowanie Administratora</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Logowanie...' : 'Zaloguj'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

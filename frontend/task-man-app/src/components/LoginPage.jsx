import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // Importujeme náš nový CSS soubor
import { useTranslation } from 'react-i18next'; 

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await axios.post('http://localhost:8000/token', params);

      console.log('Úspěšné přihlášení! Token:', response.data.access_token);
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('loginTimestamp', Date.now());
      // alert('Přihlášení proběhlo úspěšně! Můžeme pokračovat na hlavní stránku.');
      // V budoucnu zde bude přesměrování
      // window.location.href = '/dashboard';
      navigate('/');

    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Přihlášení selhalo. Zkontrolujte údaje.';
      console.error('Chyba při přihlašování:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>{t('loginTitle')}</h1> {/* POUŽITÍ PŘEKLADU */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autocomplete="username" 
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autocomplete="current-password" 
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">{t('loginButton')}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
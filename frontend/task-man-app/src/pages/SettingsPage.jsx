import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { profile, setProfile } = useUser();
  const [smtp, setSmtp] = useState({ host: '', port: '', user: '', password: '' });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSmtpChange = (e) => {
    setSmtp({ ...smtp, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Ukládání profilu:', profile);
    alert('Profilové údaje uloženy (viz konzole).');
  };

  const handleSmtpSubmit = (e) => {
    e.preventDefault();
    console.log('Ukládání SMTP:', smtp);
    alert('SMTP nastavení uloženo (viz konzole).');
  };

  return (
    <div className="settings-page">
      <h1>{t('menuSettings')}</h1>
      <div className="settings-container">
        <div className="settings-card">
          <h2>{t('personalInfo')}</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">{t('firstName')}</label>
              <input type="text" id="firstName" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">{t('lastName')}</label>
              <input type="text" id="lastName" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">{t('phone')}</label>
              <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} autocomplete="phone"/>
            </div>
            <button type="submit" className="form-button">{t('saveProfile')}</button>
          </form>
        </div>

        <div className="settings-card">
          <h2>{t('smtpSettingsTitle')}</h2>
          <form onSubmit={handleSmtpSubmit}>
            <div className="form-group">
              <label htmlFor="host">{t('smtpHost')}</label>
              <input type="text" id="host" name="host" value={smtp.host} onChange={handleSmtpChange} placeholder="smtp.example.com" autocomplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="port">{t('port')}</label>
              <input type="number" id="port" name="port" value={smtp.port} onChange={handleSmtpChange} placeholder="587" />
            </div>
             <div className="form-group">
              <label htmlFor="user">{t('user')}</label>
              <input type="text" id="user" name="user" value={smtp.user} onChange={handleSmtpChange} placeholder="user@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t('passwordLabel')}</label>
              <input type="password" id="password" name="password" value={smtp.password} onChange={handleSmtpChange} />
            </div>
            <button type="submit" className="form-button">{t('saveSmtpSettings')}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
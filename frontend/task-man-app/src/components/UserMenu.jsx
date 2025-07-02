import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IoMdSettings, IoMdContact } from "react-icons/io";
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import './Switcher.css';

const UserMenu = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  useOnClickOutside(ref, () => setIsOpen(false));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsOpen(false);
    navigate('/login');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="switcher-container" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="switcher-button" title="Uživatelské menu">
        <FaUserCircle />
      </button>

      {isOpen && (
        <ul className="switcher-dropdown">
          {/* Přidali jsme onClick={handleLinkClick} na každý Link */}
          <li><Link to="/profile" onClick={handleLinkClick}><FaUserCircle className="switcher-icon"/>{t('menuProfile')}</Link></li>
          <li><Link to="/settings" onClick={handleLinkClick}><IoMdSettings className="switcher-icon"/>{t('menuSettings')}</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}><IoMdContact className="switcher-icon"/>{t('footerContact')}</Link></li>
          
          <li className="separator"><ThemeSwitcher /></li>
          <li className="separator"><LanguageSwitcher /></li>
          
          <li onClick={handleLogout}>
            <span className="switcher-icon"><RiLogoutBoxRLine /></span>{t('logoutButton')}
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
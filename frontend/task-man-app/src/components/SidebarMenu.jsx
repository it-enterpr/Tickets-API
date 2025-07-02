import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../contexts/MenuContext'; // <-- TENTO ŘÁDEK CHYBĚL
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const { isMenuOpen, toggleMenu } = useMenu();
  const { t } = useTranslation();
  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (isMenuOpen) toggleMenu();
  });

  const handleLinkClick = () => {
    if (isMenuOpen) toggleMenu();
  }

  return (
    <div ref={ref} className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><Link to="/" onClick={handleLinkClick}>{t('dashboardTitle')}</Link></li>
          <li><Link to="/profile" onClick={handleLinkClick}>{t('menuProfile')}</Link></li>
          <li><Link to="/settings" onClick={handleLinkClick}>{t('menuSettings')}</Link></li>
          <hr className="sidebar-divider" />
          <li><Link to="/about" onClick={handleLinkClick}>{t('footerAbout')}</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}>{t('footerContact')}</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarMenu;
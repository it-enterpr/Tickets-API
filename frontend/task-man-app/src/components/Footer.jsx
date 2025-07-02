import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} <a href="https://it-enterprise.cz" target="_blank" rel="noopener noreferrer" className="footer-company-link">IT Enterprise</a>. {t('footerCopyright')}
        </p>
        <nav className="footer-links">
          <Link to="/about">{t('footerAbout')}</Link>
          <Link to="/contact">{t('footerContact')}</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
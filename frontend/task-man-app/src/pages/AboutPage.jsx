import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';
import placeholderImage from '../assets/placeholder.jpg';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <div className="about-card">
        <div className="about-image">
            <img src={placeholderImage} alt={t('aboutUsTitle')} />
        </div>
        <div className="about-text">
            <h2>{t('aboutUsTitle')}</h2>
            <p>{t('aboutUsText')}</p>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
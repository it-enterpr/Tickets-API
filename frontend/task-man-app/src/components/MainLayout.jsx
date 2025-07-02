import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import Logo from '../assets/logo.svg';
import Footer from './Footer';
import SidebarMenu from './SidebarMenu';
import { useMenu } from '../contexts/MenuContext';
import { useTranslation } from 'react-i18next';
import './MainLayout.css';

// Nově importujeme ActivityIndicator místo SessionTimer a UserMenu
import ActivityIndicator from './ActivityIndicator';

const MainLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { toggleMenu } = useMenu();

  const getTitle = () => {
    // ... (tato funkce zůstává stejná)
    switch (location.pathname) {
        case '/': return t('dashboardTitle');
        case '/profile': return t('menuProfile');
        case '/settings': return t('menuSettings');
        case '/contact': return t('footerContact');
        case '/about': return t('footerAbout');
        default: return 'Ent-Man';
    }
  };

  return (
    <>
      <SidebarMenu />
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-left">
            <button onClick={toggleMenu} className="menu-button" title="Hlavní menu">
              <HiMenu />
            </button>
            <Link to="/" className="logo-container">
                <img src={Logo} alt="Ent-Man Logo" className="logo-img" />
            </Link>
          </div>
          <div className="nav-center">
            <h1 className="page-title">{getTitle()}</h1>
          </div>
          <div className="nav-right">
            {/* Zde bude aktivní úkol a jeho časovač */}
            <div className="active-task-timer">
                <span className="task-name-header">Žádný aktivní úkol</span>
                <span className="task-timer">00:00</span>
            </div>
            {/* Zde je naše nová komponenta, která v sobě skrývá vše ostatní */}
            <ActivityIndicator />
          </div>
        </nav>
        <main className="content-area">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
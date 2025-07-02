import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import MainLayout from './components/MainLayout';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Všechny stránky nyní sdílí MainLayout */}
        <Route element={<MainLayout />}>
          {/* Tyto stránky jsou veřejné, ale mají stejný vzhled */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Tyto stránky jsou chráněné PrivateRoute */}
          <Route index element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
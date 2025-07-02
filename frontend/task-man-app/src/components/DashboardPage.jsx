import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/tasks/odoo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Chyba při načítání úkolů:', err);
        setError(t('errorLoadingTasks'));
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate, t]);

  if (loading) return <p>{t('loadingTasks')}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    // Celý <header> byl odstraněn a přesunut do MainLayout.jsx
    <ul className="task-list">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <li key={task.id} className="task-item">
            <span className="task-name">{task.name}</span>
            <span className="task-stage">{task.stage}</span>
          </li>
        ))
      ) : (
        <p>{t('noTasks')}</p>
      )}
    </ul>
  );
};

export default DashboardPage;
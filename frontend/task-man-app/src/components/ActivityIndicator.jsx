import React, { useState, useEffect, useCallback } from 'react';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import UserMenu from './UserMenu';
import './ActivityIndicator.css';

const ActivityIndicator = () => {
    const navigate = useNavigate();
    const [idleTime, setIdleTime] = useState(0);

    // Callback pro varování po 30 minutách
    const handleWarning = useCallback(() => {
        console.log("Uživatel je neaktivní déle než 30 minut. Zaznamenáno.");
        // Zde by v budoucnu bylo volání API pro záznam do logu
    }, []);

    // Callback pro odhlášení po 60 minutách
    const handleIdle = useCallback(() => {
        console.log("Uživatel neaktivní 60 minut. Odhlašuji.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('loginTimestamp');
        navigate('/login');
    }, [navigate]);

    // Použití hooku s objektem obsahujícím naše funkce
    const { resetTimer } = useIdleTimer({ 
        onWarning: handleWarning, 
        onIdle: handleIdle, 
        warningTimeout: 30 * 60 * 1000, 
        idleTimeout: 60 * 60 * 1000 
    });

    // Lokální časovač pro vizuální aktualizaci kruhu každou vteřinu
    useEffect(() => {
        const interval = setInterval(() => {
            setIdleTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Funkce, která se zavolá při jakékoliv aktivitě
    const handleActivity = () => {
        setIdleTime(0); // Vynuluje vizuální časovač
        resetTimer();   // Vynuluje hlavní časovače v hooku
    };

    // Přidání globálních posluchačů pro reset
    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, handleActivity));
        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [handleActivity]);

    // Výpočty pro barvu a procenta
    const WARNING_TIME = 15 * 60; // 15 min
    const CRITICAL_TIME = 25 * 60; // 25 min
    const MAX_VISUAL_TIME = 30 * 60; // 30 min je 100% kruhu
    const percentage = Math.min((idleTime / MAX_VISUAL_TIME) * 100, 100);
    
    let pathColor;
    if (idleTime < WARNING_TIME) pathColor = '#2ecc71'; // Zelená
    else if (idleTime < CRITICAL_TIME) pathColor = '#f39c12'; // Oranžová
    else pathColor = '#e74c3c'; // Červená

    return (
        <div className="activity-indicator-wrapper">
            <CircularProgressbar 
                value={percentage} 
                strokeWidth={50}
                styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: pathColor,
                    trailColor: 'transparent',
                })}
            />
            <div className="user-menu-on-top">
                <UserMenu />
            </div>
        </div>
    );
};

export default ActivityIndicator;
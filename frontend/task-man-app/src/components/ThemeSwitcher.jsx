import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaPaintBrush, FaPalette } from 'react-icons/fa';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import './Switcher.css';

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));

  const themes = {
    'dark-theme': { name: 'Tmavé', icon: <FiMoon /> },
    'light-theme': { name: 'Světlé', icon: <FiSun /> },
    'blue-theme': { name: 'Modré', icon: <FaPalette style={{ color: '#1976d2' }}/> },
    'green-theme': { name: 'Zelené', icon: <FaPalette style={{ color: '#388e3c' }}/> },
    'pink-theme': { name: 'Růžové', icon: <FaPalette style={{ color: '#ec407a' }}/> },
    'brown-theme': { name: 'Hnědé', icon: <FaPalette style={{ color: '#795548' }}/> },
    'orange-theme': { name: 'Oranžové', icon: <FaPalette style={{ color: '#fb8c00' }}/> },
  };

  return (
    <div className="switcher-container" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="switcher-button" title="Změnit téma">
        <FaPaintBrush />
      </button>
      {isOpen && (
        <ul className="switcher-dropdown">
          {Object.keys(themes).map((themeKey) => (
            <li key={themeKey} onClick={() => { setTheme(themeKey); setIsOpen(false); }}>
              <span className="switcher-icon">{themes[themeKey].icon}</span>
              {themes[themeKey].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThemeSwitcher;
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import './Switcher.css';

const languages = [
    { code: 'cz', name: 'Česky' },
    { code: 'en', name: 'English' },
    { code: 'uk', name: 'Українська' },
    { code: 'sk', name: 'Slovensky' },
    { code: 'fr', name: 'Français' },
    { code: 'ru', name: 'Русский' },
    { code: 'he', name: 'עברית' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsOpen(false));

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Toto zavře menu po výběru
  };

  return (
    <div className="switcher-container" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="switcher-button" title="Změnit jazyk">
        <MdLanguage />
      </button>

      {isOpen && (
        <ul className="switcher-dropdown">
          {languages.map((lang) => (
            // Oprava: funkce se volá správně
            <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
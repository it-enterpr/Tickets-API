import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import VŠECH překladových souborů
import translationCZ from './locales/cz/translation.json';
import translationEN from './locales/en/translation.json';
import translationUK from './locales/uk/translation.json';
import translationSK from './locales/sk/translation.json';
import translationFR from './locales/fr/translation.json';
import translationRU from './locales/ru/translation.json';
import translationHE from './locales/he/translation.json';

// Definice zdrojů pro i18next
const resources = {
  cz: { translation: translationCZ },
  en: { translation: translationEN },
  uk: { translation: translationUK },
  sk: { translation: translationSK },
  fr: { translation: translationFR },
  ru: { translation: translationRU },
  he: { translation: translationHE }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'cz', // Výchozí jazyk, pokud jiný selže
    interpolation: {
      escapeValue: false
    },
    // Pomůže při ladění, pokud nějaký klíč chybí
    debug: true, 
  });

export default i18n;
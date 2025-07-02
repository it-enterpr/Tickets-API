import { useEffect, useCallback, useRef } from 'react';

// Upravený hook, který přijímá objekt s callbacky
export const useIdleTimer = ({ onIdle, onWarning, warningTimeout, idleTimeout }) => {
  const timeoutId = useRef();
  const warningTimerId = useRef();

  const resetTimer = useCallback(() => {
    // Vyčistíme staré časovače
    clearTimeout(warningTimerId.current);
    clearTimeout(timeoutId.current);
    
    // Nastavíme nové
    warningTimerId.current = setTimeout(onWarning, warningTimeout);
    timeoutId.current = setTimeout(onIdle, idleTimeout);
  }, [onIdle, onWarning, warningTimeout, idleTimeout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Přidání posluchačů pro resetování časovače
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    // První spuštění časovače
    resetTimer();

    // Uklidíme po sobě
    return () => {
      clearTimeout(timeoutId.current);
      clearTimeout(warningTimerId.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);

  return { resetTimer }; // Vracíme funkci pro manuální reset
};
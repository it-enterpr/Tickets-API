import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip' // Budeme muset nainstalovat

const SessionTimer = () => {
  const [sessionStart] = useState(localStorage.getItem('loginTimestamp'));
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - sessionStart) / 1000);
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setElapsedTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStart]);

  return (
    <>
      <span data-tooltip-id="session-tooltip" data-tooltip-content="Čas od přihlášení">
        {elapsedTime}
      </span>
      <Tooltip id="session-tooltip" />
    </>
  );
};

export default SessionTimer;
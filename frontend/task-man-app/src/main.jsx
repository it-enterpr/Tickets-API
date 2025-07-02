import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import globálních stylů a témat
import './index.css';
import './themes/dark.css';
import './themes/light.css';
import './themes/blue.css';
import './themes/green.css';
import './themes/pink.css';
import './themes/brown.css';
import './themes/orange.css';

// Import pro Tooltip
import 'react-tooltip/dist/react-tooltip.css'; // <-- TENTO ŘÁDEK JE KLÍČOVÁ OPRAVA

// Import Context Providerů
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { MenuProvider } from './contexts/MenuContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';

// Import pro překlady
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <MenuProvider>
        <UserProvider> {/* <-- OBALENÍ */}
          <App />
        </UserProvider>
      </MenuProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
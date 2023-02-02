import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { theme } from './contexts/theme';
import { ThemeContext } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeContext.Provider value={theme}>
      <App />
    </ThemeContext.Provider>
  </React.StrictMode>
);

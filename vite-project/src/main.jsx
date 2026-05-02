import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DataProvider } from './stores/DataContext';
import React from 'react';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <DataProvider>  {/* ← ДОЛЖЕН БЫТЬ ЗДЕСЬ */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DataProvider>
    </React.StrictMode>
);

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DataProvider } from './stores/DataContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DataProvider>
      <App />
    </DataProvider>
  </BrowserRouter>
);

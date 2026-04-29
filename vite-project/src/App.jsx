import { Routes, Route, useNavigate } from 'react-router-dom';
import CalcBlock from './CalcBlock'
import InputNum from './InputNum'
import './App.css'

function App() {
    return (
        <Routes>
    {/* Главная страница с вводом */}
      <Route path="/" element={<InputNum />} />
      
      {/* Страница вычислений */}
      <Route path="/calc" element={<CalcBlock />} />
      
        </Routes>
    );
       
         
  };

export default App

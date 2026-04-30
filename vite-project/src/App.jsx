import { Routes, Route} from 'react-router-dom';
import CalcBlock from './CalcBlock'
import InputNum from './InputForm'
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

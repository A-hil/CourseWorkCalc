import { Routes, Route} from 'react-router-dom';
import InputNum from './InputNum'
import './App.css'
import ResultsBlock from './ResultsBlock'

function App() {
    return (
      <Routes>
    {/* Главная страница с вводом */}
        <Route path="/" element={<InputNum />} />
        <Route path="/calc" element={<ResultsBlock />} />
      </Routes>
    );
       
         
  };

export default App

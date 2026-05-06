import InputNum from './InputNum'
import './App.css'
import ResultsBlock from './ResultsBlock'
import YChart from './components/YChart';
import { Toaster } from 'react-hot-toast';
function App() {

    return (
        <>
            <Toaster 
  position="bottom-right"
  gutter={8} // расстояние между тостами
  containerStyle={{
    bottom: 40, 
    right: 40,  
  }}
  toastOptions={{
    duration: 3000,
  }}
/>
            <InputNum />
            <ResultsBlock />
            <YChart />
        </>
    );
  };

export default App

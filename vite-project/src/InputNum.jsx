import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

    function InputNum () {
         // 1. Состояние для размера матрицы
        const [matrixSize, setMatrixSize] = useState(2);
        
       const navigate = useNavigate();

        // 2. Обработчик изменения
        const handleChange = (event) => {
        const value = Number(event.target.value);
        setMatrixSize(value);

        
         
};

const handleSubmit = () => {
       
        if (matrixSize >= 5 || matrixSize < 2) {
            alert("Введите число от 2 до 4");
            return;
        }
         navigate('/calc', { state: { size: matrixSize } });
    };

    return (
    <>
   <div className='w-full h-screen bg-linear-65 from-purple-500 to-pink-500 flex justify-center items-center relative overflow-hidden'>
    <div className="relative z-10">
        {/* Сама карточка */}
        <div className='bg-white p-8 rounded-3xl shadow-2xl w-[450px]'>
            
            {/* Заголовок внутри карточки */}
            <h2 className="text-xl font-bold mb-6 text-center text-black">Ввод данных</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-gray-600">Введите размерность матрицы A</p>
                    
                    <input type="text" className="bg-gray-100 border border-gray-200 p-2 rounded-lg focus:outline-blue-500 transition-all"  
            value={matrixSize} 
            onChange={handleChange} 
            min="0"
            max="5"/>

                </div>

                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-gray-600">Массив C</p>
                    <input type="text" className="bg-gray-100 border border-gray-200 p-2 rounded-lg focus:outline-blue-500 transition-all" />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-gray-600">Массив X</p>
                    <input type="text" className="bg-gray-100 border border-gray-200 p-2 rounded-lg focus:outline-blue-500 transition-all" />
                </div>

                <div className="flex flex-col">
                    <p className="text-sm mb-1 text-gray-600">Массив Y</p>
                    <input type="text" className="bg-gray-100 border border-gray-200 p-2 rounded-lg focus:outline-blue-500 transition-all" />
                </div>

                {/* Кнопка внутри карточки на всю ширину (2 колонки) */}
                <div className="col-span-2 mt-6">
                    <p className="text-xs mb-2 text-center text-gray-400">Вычислить</p>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl w-full font-semibold shadow-lg transition-all active:scale-95'
                    onClick={handleSubmit}>
                        Вычислить 
                    </button>
                </div>
            </div>
        </div>
    </div>
    </div>
    </>
  )
}

export default InputNum;
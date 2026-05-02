import { useState, useCallback, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { useAppData } from './stores/DataContext';



export default function InputNum() {
    const { updateData } = useAppData(); //Сохран данные
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState({ A: [], C: [], size: 3 });
    const [isOn, setIsOn] = useState(true); // Состояние для монтирования/размонтирования
    const [isOdd, setIsOdd] = useState(true); //четность или не четность
    const [formData, setFormData] = useState({
        m: 3,
        b: 0,
        rangeMin: 0,
        rangeMax: 10,
        C0: 1,
        r: 1
    });

    //Обработчик изменения полей 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };
    console.log('Saving to context:', {
    formData: formData,
    matrixA: previewData.A,  // должен быть массив
    vectorC: previewData.C,  // должен быть массив
    isOdd: isOdd
});
     const handleCalculate = () => {
        console.log('🟣 previewData в момент вызова:', previewData);
        setIsOn(false); // размонтируем текущий компонент
        if (!previewData.A.length || !previewData.C.length) {
        console.log('⚠️ Данные еще не готовы, генерируем сейчас...');
        // Генерируем только если данные пустые (первый раз или ошибка)
        const freshData = generatePreviewData();
        setPreviewData(freshData);
        
        // Используем свежие данные
        const inputData = {
            m: formData.m,
            b: formData.b,
            rangeMin: formData.rangeMin,
            rangeMax: formData.rangeMax,
            C0: formData.C0,
            r: formData.r,
            isOdd: isOdd
        };
        
        updateData(inputData, {
            A: freshData.A,
            C: freshData.C
        });
    } else {
        // Данные уже есть — используем их
        const inputData = {
            m: formData.m,
            b: formData.b,
            rangeMin: formData.rangeMin,
            rangeMax: formData.rangeMax,
            C0: formData.C0,
            r: formData.r,
            isOdd: isOdd
        };
        
        updateData(inputData, {
            A: previewData.A,
            C: previewData.C
        });
    }
    
    setTimeout(() => {
        navigate('/calc');
    }, 100);
};
    

const generatePreviewData = useCallback(() => {
    const m = Math.min(formData.m, 8);
    
    // Генерация матрицы A
    const previewA = [];
    for (let i = 0; i < m; i++) {
        previewA[i] = [];
        for (let j = 0; j < m; j++) {
            const randomValue = formData.rangeMin + 
                Math.random() * (formData.rangeMax - formData.rangeMin);
            previewA[i][j] = parseFloat(randomValue.toFixed(2));
        }
    }
    
    // Генерация вектора C
    const previewC = [];
    if (isOdd) {
        previewC[0] = 1;
        previewC[1] = 1;
        for (let i = 2; i < m; i++) {
            previewC[i] = previewC[i-1] + previewC[i-2];
        }
    } else {
        for (let i = 0; i < m; i++) {
            previewC[i] = parseFloat((formData.C0 + i * formData.r).toFixed(2));
        }
    }
    
    return { A: previewA, C: previewC, size: m };
}, [formData.m, formData.rangeMin, formData.rangeMax, isOdd, formData.C0, formData.r]);

        // Генерируем данные при монтировании и при изменении параметров
        useEffect(() => {
            setPreviewData(generatePreviewData());
        }, [generatePreviewData]);

    

    return isOn ? (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-pink-700 p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* ЗАГОЛОВОК */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        Ввод данных
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Вариант 28 · Канонический полином · Сортировка Шелла
                    </p>
                </div>
                    
            <div className="w-full mb-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        Параметры расчета
                    </h2>
                    
                    <div className="space-y-5">
                        {/* Размерность матрицы */}
                        <div className="group">
                            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                
                                Размерность матрицы A (m)
                            </label>
                            <input
                                type="number"
                                name="m"
                                value={formData.m}
                                onChange={handleChange}
                                min="2"
                                max="10"
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                            />
                            <p className="text-gray-500 text-xs mt-1">Диапазон: от 2 до 10</p>
                        </div>

                        {/* Переменная b */}
                        <div className="group">
                            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                Переменная b
                            </label>
                            <input
                                type="number"
                                name="b"
                                value={formData.b}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                            />
                        </div>

                        {/* Диапазон генерации матрицы A */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    Мин граница
                                </label>
                                <input
                                    type="number"
                                    name="rangeMin"
                                    value={formData.rangeMin}
                                    onChange={handleChange}
                                    step="0.5"
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                                    Макс граница
                                </label>
                                <input
                                    type="number"
                                    name="rangeMax"
                                    value={formData.rangeMax}
                                    onChange={handleChange}
                                    step="0.5"
                                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Тип варианта (переключатель) */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <label className="block text-gray-700 text-sm font-semibold mb-3">Тип варианта</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsOdd(true)}
                                    className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        isOdd 
                                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Нечетный (Фибоначчи)
                                </button>
                                <button
                                    onClick={() => setIsOdd(false)}
                                    className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        !isOdd 
                                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Четный (Прогрессия)
                                </button>
                            </div>
                        </div>

                        {/* Дополнительные поля для четного варианта */}
                        <div className={`overflow-hidden transition-all duration-500 ${!isOdd ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        C[0] (первый член прогрессии)
                                    </label>
                                    <input
                                        type="number"
                                        name="C0"
                                        value={formData.C0}
                                        onChange={handleChange}
                                        step="0.5"
                                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        r (разность прогрессии)
                                    </label>
                                    <input
                                        type="number"
                                        name="r"
                                        value={formData.r}
                                        onChange={handleChange}
                                        step="0.5"
                                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Кнопка расчета */}
                        <button
                            onClick={handleCalculate}
                            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl mt-6 flex items-center justify-center gap-2 group"
                        >
                            Рассчитать
                        </button>
                    </div>
                </div>
            </div>

            {/* НИЖНЯЯ КОЛОНКА - ПРЕДПРОСМОТР (на всю ширину) */}
            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Предпросмотр данных
                    </h2>
                    
                    <div className="flex gap-4">
                        {/* VIEWPORT - область просмотра */}
                        <div className="flex-1">
                            <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-300">
                                    <div className="p-4 space-y-6">
                                        {/* Матрица A */}
                                        <div>
                                            <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                                                <span>🔲</span>
                                                Матрица A ({previewData.size}×{previewData.size})
                                            </h3>
                                            <div className="bg-gray-200 rounded-lg p-3">
                                                {previewData.A.map((row, i) => (
                                                    <div key={i} className="flex justify-center gap-2 my-1">
                                                        {row.map((val, j) => (
                                                            <span key={j} className="bg-purple-200 px-3 py-1 rounded text-purple-900 font-mono text-sm">
                                                                {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Массив C */}
                                        <div>
                                            <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                                                Массив C
                                            </h3>
                                            <div className="bg-gray-200 rounded-lg p-3 flex flex-wrap gap-2">
                                                {previewData.C.map((val, i) => (
                                                    <span key={i} className="bg-blue-200 px-3 py-1 rounded text-blue-900 font-mono text-sm">
                                                        C[{i}] = {val}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-gray-600 text-xs mt-2">
                                                {isOdd ? 'Последовательность Фибоначчи' : 'Арифметическая прогрессия'}
                                            </p>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>  
    ): null;
}
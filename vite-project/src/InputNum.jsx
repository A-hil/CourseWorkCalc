import { useState, useCallback, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { useAppData } from './stores/DataContext';



export default function InputNum() {
    const navigate = useNavigate();
    const [previewData, setPreviewData] = useState({ A: [], C: [], size: 3 });
    const [isOdd, setIsOdd] = useState(true); //четность или не четность
    const { updateData} = useAppData();
    
    const [formData, setFormData] = useState({
        m: 3,
        b: 0,
        rangeMin: 0,
        rangeMax: 10,
        C0: 1,
        r: 1
    });

    const INITIAL_FORM_DATA = {
        m: 3,
        b: 0,
        rangeMin: 0,
        rangeMax: 10,
        C0: 1,
        r: 1
    };

    //Обработчик изменения полей 
    const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
        ...prev,
        // Если строка пустая, оставляем её пустой, иначе преобразуем в число
        [name]: value === '' ? '' : Number(value)
    }));
};
    console.log('Saving to context:', {
    formData: formData,
    matrixA: previewData.A,  // должен быть массив
    vectorC: previewData.C,  // должен быть массив
    isOdd: isOdd
});

    const ResetData = () => {
        setFormData(INITIAL_FORM_DATA);
        setIsOdd(true);
        const m = INITIAL_FORM_DATA.m;
        const rangeMin = INITIAL_FORM_DATA.rangeMin;
        const rangeMax = INITIAL_FORM_DATA.rangeMax;
        const freshA = [];
        for (let i = 0; i < m; i++) {
            freshA[i] = [];
            for (let j = 0; j < m; j++) {
                const randomValue = rangeMin + Math.random() * (rangeMax - rangeMin);
                freshA[i][j] = parseFloat(randomValue.toFixed(2));
            }
        }
        
        // Генерация вектора C (Фибоначчи для isOdd = true)
        const freshC = [];
        freshC[0] = 1;
        freshC[1] = 1;
        for (let i = 2; i < m; i++) {
            freshC[i] = freshC[i-1] + freshC[i-2];
        }
        
        // Обновляем предпросмотр
        setPreviewData({ A: freshA, C: freshC, size: m });
        // очищаем контекст (чтобы результаты не висели)
        updateData(null, null);
    };


     const handleCalculate = () => {
        if (!previewData.A.length || !previewData.C.length) {
        console.log('Данные еще не готовы, генерируем сейчас...');
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

    const m = Math.min(Number(formData.m) || 2, 8);
    const rMin = Number(formData.rangeMin) || 0;
    const rMax = Number(formData.rangeMax) || 0;

    // Генерация матрицы A
    const previewA = [];
    for (let i = 0; i < m; i++) {
        previewA[i] = [];
        for (let j = 0; j < m; j++) {
            const randomValue = rMin + Math.random() * (rMax - rMin);
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

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* ЗАГОЛОВОК */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
    {/* Загаловок */}
    <div className="text-left">
        <h1 className="text-lg text-gray-800 fonst-bold drop-shadow-lg">
            Преобразование и сортировка матриц
        </h1>
        <p className="text-purple-200 text-sm">
            Вариант 28 · Канонический полином · Сортировка Шелла
        </p>
    </div>

    {/* ПРАВАЯ ЧАСТЬ: Группа кнопок */}
<div className="flex items-center gap-2">
    <button className="px-4 py-2 bg-white border
  border-gray-200 rounded-lg font-semibold text-gray-600
    hover:bg-gray-300 hover:text-white hover:border-gray-100
    transition-all duration-300 text-xs" onClick={()=>{
        ResetData()
    }}>
        Перезагрузить
    </button>

    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-300 hover:text-white hover:border-gray-100 transition-all duration-300 text-xs">
        Контрольный пример
    </button>

    <button 
        onClick={handleCalculate}
        className="px-6 py-2 bg-black/80 border border-white/20 rounded-lg 
                font-bold text-white shadow-lg text-xs 
                hover:bg-white/80 hover:text-black 
                active:scale-95 transition-all duration-300"
    >        
        Рассчитать
    </button>
</div>
            </div>
                    
            <div className="w-full mb-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-white">
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        Параметры расчета
                    </h2>
                    
                    <div className="space-y-5">
                        {/* Размерность матрицы */}
                        <div className='grid grid-cols-2 gap-5'>
                        <div className="group">
                            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2 ">
                                
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
                                className="w-full bg-gray-50 border
                              border-gray-300 rounded-xl px-4
                                py-3 text-gray-900 focus:outline-none
                                focus:ring-2 focus:ring-purple-500 
                                transition-all duration-300"
                            />
                        </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-end bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
    
                        {/* ЛЕВАЯ ЧАСТЬ: Тип варианта (Выпадающий список или переключатель) */}
                        <div className="flex-1 w-full">
                            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 text-left">
                                Тип варианта
                            </label>
                            <select 
                                value={isOdd} 
                                onChange={(e) => setIsOdd(e.target.value === 'true')}
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
                            >
                                <option value="true">Фибоначчи</option>
                                <option value="false">Арифметическая прогрессия</option>
                            </select>
                        </div>

                        {/* ПРАВАЯ ЧАСТЬ: Диапазон (Инпуты в ряд) */}
                        <div className="flex-[1.5] w-full">
                            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 text-left md:text-left mr-4">
                                Диапазон
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    name="rangeMin"
                                    value={formData.rangeMin}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="text-gray-400 font-light">—</span>
                                <input
                                    type="number"
                                    name="rangeMax"
                                    value={formData.rangeMax}
                                    onChange={handleChange}
                                    placeholder="10"
                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-center text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                        {/*Сортировка по Шеллу - задача перенести логику
                    
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-gray-700 font-semibold">Сортировка Шелла</span>
                                <input
                                    type="checkbox"
                                    checked={enableSorting}
                                    onChange={toggleSorting}
                                    className="w-5 h-5 text-purple-600"
                                />
                            </label>
                            <p className="text-gray-500 text-xs mt-1 left-0 flex">
                                {enableSorting ? 'Массив Y будет отсортирован' : 'Массив Y останется в исходном порядке'}
                            </p>
                        </div>

                        */}

                        {/* Дополнительные поля для четного варианта */}
                        <div className={`overflow-hidden
                            transition-all duration-500
                            ${!isOdd ? 'max-h-48 opacity-100'
                            :
                            'max-h-0 opacity-0'}`}>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block
                                    text-gray-700 text-sm
                                    font-semibold mb-2">
                                        C[0] (первый член прогрессии)
                                    </label>
                                    <input
                                        type="number"
                                        name="C0"
                                        value={formData.C0}
                                        onChange={handleChange}
                                        step="0.5"
                                        className="w-full
                                        bg-gray-50 border
                                        border-gray-300 rounded-xl
                                        px-4 py-3 text-gray-900
                                        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block
                                    text-gray-700 text-sm
                                    font-semibold mb-2">
                                        r (разность прогрессии)
                                    </label>
                                    <input
                                        type="number"
                                        name="r"
                                        value={formData.r}
                                        onChange={handleChange}
                                        step="0.5"
                                        className="w-full
                                        bg-gray-50 border
                                        border-gray-300 rounded-xl
                                        px-4 py-3 text-gray-900
                                        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>


    <div className="space-y-10">
        {/* БЛОК МАТРИЦЫ A */}
        <div className="flex flex-col items-start">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">
                Матрица A ({previewData.size}×{previewData.size})
            </h3>
            
            <div className="bg-blue-50 p-4 rounded-2xl border border-gray-100 inline-block зч">
                {previewData.A.map((row, i) => (
                    <div key={i} className="flex gap-3 mb-3 last:mb-0">
                        {row.map((val, j) => (
                            <div key={j} className="w-16 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-center font-mono text-sm text-gray-700">
                                {val}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>

        {/* БЛОК МАССИВА C */}
        <div className="flex flex-col items-start">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">
                Массив C
            </h3>
            
            <div className="flex flex-wrap gap-3">
                {previewData.C.map((val, i) => (
                    <div key={i} className="px-4 py-2 bg-blue-50 border border-gray-200 rounded-lg shadow-sm text-center font-mono text-sm text-gray-700">
                        {val}
                    </div>
                ))}
            </div>
        </div>
    </div>

</div>
</div>                              
</div>
</div>
</div> 
        );
}
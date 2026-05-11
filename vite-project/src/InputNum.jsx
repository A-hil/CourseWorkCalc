import { useState, useCallback, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { useAppData } from './stores/DataContext';
import toast from 'react-hot-toast';
import 'tailwindcss';

    
    const INITIAL_FORM_DATA = {
        m: 3,
        b: 0,
        rangeMin: 0,
        rangeMax: 10,
        C0: 1,
        r: 1,
        g: 0.1
    };

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
        r: 1,
        g: 0.5
    });

    const fillExample = () => {
    const randomIsOdd = Math.random() < 0.5;
    setIsOdd(randomIsOdd);
    const m = Math.floor(Math.random() * 4) + 2;
    let b;
    do {
        b = Math.floor(Math.random() * 21) - 10;
    } while (b === 0);

    const rangeMin = Math.floor(Math.random() * 5);
    const rangeMax = rangeMin + Math.floor(Math.random() * 10) + 5;
    const C0 = parseFloat((Math.random() * 5 + 0.5).toFixed(1));
    const r = parseFloat((Math.random() * 3 + 0.5).toFixed(1));
    const steps = [0.1, 0.25, 0.5, 1];
    const g = steps[Math.floor(Math.random() * steps.length)];
    
    setFormData({
        m,
        b,
        rangeMin,
        rangeMax,
        C0,
        r,
        g
    });
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

        console.log("Текущее значение b:", formData.b, "Тип:", typeof formData.b)

        if (formData.b === '' || formData.b === null || isNaN(formData.b)) {
        toast.error('Введите число b!', {
            duration: 4000,
            id: 'b-error',
        });
        return; 
    }
        // 2. Если b в порядке, готовим данные
    const inputData = {
        ...formData,
        isOdd: isOdd
    };

    const dataA = previewData.A.length ? previewData.A : generatePreviewData().A;
    const dataC = previewData.C.length ? previewData.C : generatePreviewData().C;

        const freshData = generatePreviewData();
        setPreviewData(freshData);

    updateData(inputData, { A: dataA, C: dataC });

if(inputData.b === 0){
            toast.error('Введите значение переменной b');
        }else{
                toast.success('Расчет запущен...');
    setTimeout(() => {
        navigate('/calc');
    }, 500); 
        }
    // 3. Переход 

};
    

const generatePreviewData = useCallback(() => {

    const m = Math.min(Number(formData.m) || 2, 8);
    const rMin = Number(formData.rangeMin) || 0;
    const rMax = Number(formData.rangeMax) || 0;

    const C0 = Number(formData.C0) || 0;
    const r = Number(formData.r) || 1;

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
        previewC[i] = parseFloat((C0 + i * r).toFixed(2));
    }
}
    
    return { A: previewA, C: previewC, size: m };
}, [formData.m, formData.rangeMin, formData.rangeMax, isOdd, formData.C0, formData.r]);

        // Генерируем данные при монтировании и при изменении параметров
        useEffect(() => {
            setPreviewData(generatePreviewData());
        }, [generatePreviewData]);

    return (
        <div className=" bg-blue-50 px-8">
            <div className="max-w-7xl mx-auto pt-4">
                {/* ЗАГОЛОВОК */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
    {/* ЛЕВАЯ ЧАСТЬ: Заголовок */}
    <div className="text-left">
        <h1 className="text-lg text-gray-800 font-bold drop-shadow-lg leading-tight">
            Преобразование и сортировка матриц
        </h1>
        <p className="text-purple-400 text-sm"> {/* Заменил text-purple-200 на 400, чтобы было видно на светлом фоне */}
            Вариант 28 · Канонический полином · Сортировка Шелла
        </p>
    </div>
</div>

    {/* ПРАВАЯ ЧАСТЬ: Группа кнопок */}
    <div className="grid grid-cols-2 md:flex items-center gap-2">
        <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-300 hover:text-white hover:border-gray-100 transition-all duration-300 text-xs" onClick={ResetData}>
            Перезагрузить
        </button>

        <button onClick={fillExample} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-300 hover:text-white hover:border-gray-100 transition-all duration-300 text-xs">
            Пример
        </button>

        <button 
            onClick={handleCalculate}
            className="col-span-2 w-full md:w-auto px-6 py-2 bg-black/80 border border-white/20 rounded-lg font-bold text-white shadow-lg text-xs hover:bg-white/80 hover:text-black active:scale-95 transition-all duration-300"
        >        
            Рассчитать
        </button>
    </div>
</div>
                    
            <div className="w-full mb-0 ">
                <div className="card-glass p-6 ">
                    <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                        Параметры расчета
                    </h2>
                    
                    <div className="space-y-5">
                        {/* Размерность матрицы */}
                        {/* grid-cols-3 остается всегда */}
<div className='grid grid-cols-3 gap-2 sm:gap-5 items-start'>
    
    <div className="group flex flex-col">
        <label htmlFor="input-m" className="block text-gray-700 text-[10px] sm:text-sm font-semibold mb-2 flex items-center gap-1 min-h-[32px] sm:min-h-[40px] leading-tight">
            Размерность A (m)
        </label>
        <input
            id="input-m"
            type="number"
            name="m"
            value={formData.m}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <p className="text-gray-400 text-[9px] mt-1 hidden sm:block">2-10</p>
    </div>

    <div className="group flex flex-col">
        <label htmlFor="input-b" className="block text-gray-700 text-[10px] sm:text-sm font-semibold mb-2 flex items-center gap-1 min-h-[32px] sm:min-h-[40px] leading-tight">
            Переменная b
        </label>
        <input
            id="input-b"
            type="number"
            name="b"
            value={formData.b}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
    </div>

    <div className="group flex flex-col">
        <label  htmlFor="input-g" className="block text-gray-700 text-[10px] sm:text-sm font-semibold mb-2 flex items-center gap-1 min-h-[32px] sm:min-h-[40px] leading-tight">
            Шаг (g)
        </label>
        <input
            id="input-g"
            type="number"
            name="g"
            value={formData.g}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
    </div>
</div>


                        <div className="flex flex-col md:flex-row gap-8 items-end bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
    
                        {/* ЛЕВАЯ ЧАСТЬ: Тип варианта (Выпадающий список или переключатель) */}
                        <div className="flex-1 w-full">
                            <label htmlFor="variant-select" className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-3 text-left">
                                Тип варианта
                            </label>
                            <select 
                                id="variant-select"
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

                        {/* Дополнительные поля для четного варианта */}
                        <div className={`overflow-hidden
                            transition-all duration-500
                            ${!isOdd ? 'max-h-48 opacity-100'
                            :
                            'max-h-0 opacity-0'}`}>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label htmlFor="input-C0" className="block
                                    text-gray-700 text-sm
                                    font-semibold mb-2">
                                        C[0] (первый член прогрессии)
                                    </label>
                                    <input
                                        id="input-C0"
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
                                    <label htmlFor="input-r" className="block
                                    text-gray-700 text-sm
                                    font-semibold mb-2">
                                        r (разность прогрессии)
                                    </label>
                                    <input
                                        id="input-r"
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
            
                    <div className="bg-blue-50 p-4 rounded-2xl border border-gray-100 overflow-x-auto max-w-full">
                        <div className="inline-flex flex-col min-w-max">
                            {previewData.A.map((row, i) => (
                                <div key={i} className="flex gap-2 mb-2 last:mb-0">
                                    {row.map((val, j) => (
                                        <div key={j} className="w-12 sm:w-16 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-center font-mono text-sm text-gray-700">
                                            {val}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
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
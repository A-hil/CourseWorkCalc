import { useAppData } from './stores/DataContext';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss';

export default function ResultsBlock() {
    const navigate = useNavigate();

    const { appData } = useAppData();
    const { results, isLoading, formData} = appData;

    if (isLoading) return <div>Загрузка...</div>;
    if (!results) return <div>Нет данных</div>;

    const { intermediate, final, input } = results;

    // Используем данные
    console.log(appData.formData);
    console.log(appData.matrixA);
    console.log(appData.vectorC);
    
    // Если данных нет, показать сообщение
    if (!formData) {
        return (
            <div className="text-center p-8">
                <h2>Нет данных для отображения</h2>
                <button onClick={() => navigate('/')}>
                    Вернуться к вводу данных
                </button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-pink-700 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="w-full mb-8">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                        <h1 className='text-black'>Результаты расчетов</h1>
                        <h2 className="font-bold">Матрица A</h2>
                        <pre>{JSON.stringify(intermediate.A, null, 2)}</pre>
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">Параметры расчета</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>m = {input.m}</div>
                                <div>b = {input.b}</div>
                                <div>C0 = {input.C0}</div>
                                <div>r = {input.r}</div>
                                <div>Диапазон: [{input.rangeMin}, {input.rangeMax}]</div>
                                <div>Вариант: {input.isOdd ? 'Нечетный' : 'Четный (28)'}</div>
                                <div>Тип: {input.isOdd ? 'Фибоначчи' : 'Арифметическая прогрессия'}</div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Массив X (результат формулы)</h2>
                <div className="flex gap-2">
                    {final.X.map((val, i) => (
                        <span key={i} className="bg-green-200 px-2 py-1 rounded">
                            X[{i}] = {val}
                        </span>
                    ))}
                </div>
            </div>

                            <div className='w-full flex justify-end mt-6'> 
                                <button 
                                    onClick={() => navigate('/')}
                                    /* Уменьшаем padding до p-3 или p-4 и шрифт до 14px */
                                    className='bg-linear-to-br from-indigo-900 via-purple-800 to-pink-700 px-6 
                                    py-2 rounded-xl text-[14px] text-white hover:scale-105'
                                >

                                    Назад
                                    
                                </button>
                            </div>

                            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Массив Y (отсортированный)</h2>
                <div className="flex gap-2 flex-wrap">
                    {final.Ysorted.map((val, i) => (
                        <span key={i} className="bg-blue-200 px-2 py-1 rounded">
                            Ys[{i}] = {val}
                        </span>
                    ))}
                </div>
            </div>

                        </div>
                    </div>
                </div>
            </div>
            );
        }

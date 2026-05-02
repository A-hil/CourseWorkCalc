import { useAppData } from './stores/DataContext';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss';

export default function ResultsBlock() {
    const navigate = useNavigate();
    const { appData } = useAppData();

    console.log('📊 ResultsBlock appData:', appData); 

    const { results, isLoading, formData, pregeneratedData } = appData;

    console.log('📊 results:', results);
    console.log('📊 pregeneratedData:', pregeneratedData);

    if (isLoading) return <div>Загрузка...</div>;
    if (!results) return <div>Нет данных</div>;

    const { final, input } = results;
    const matrixA = pregeneratedData?.A;
    const vectorC = pregeneratedData?.C;

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
                        <h1 className="text-black text-2xl font-bold mb-6">Результаты расчетов</h1>
                        
                        {/* ✅ ИСПОЛЬЗУЕМ matrixA из generatedData */}
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">📊 Исходная матрица A (из предпросмотра)</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border">
                                    <tbody>
                                        {matrixA?.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((val, j) => (
                                                    <td key={j} className="border p-2 text-center">
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ✅ ИСПОЛЬЗУЕМ vectorC из generatedData */}
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">📊 Исходный массив C (из предпросмотра)</h2>
                            <div className="flex gap-2 flex-wrap">
                                {vectorC?.map((val, i) => (
                                    <span key={i} className="bg-blue-200 px-3 py-1 rounded">
                                        C[{i}] = {val}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Параметры расчета */}
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">⚙️ Параметры расчета</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>m = {input?.m}</div>
                                <div>b = {input?.b}</div>
                                <div>C0 = {input?.C0}</div>
                                <div>r = {input?.r}</div>
                                <div>Диапазон: [{input?.rangeMin}, {input?.rangeMax}]</div>
                                <div>Вариант: {input?.isOdd ? 'Нечетный' : 'Четный (28)'}</div>
                                <div>Тип: {input?.isOdd ? 'Фибоначчи' : 'Арифметическая прогрессия'}</div>
                            </div>
                        </div>

                        {/* Массив X */}
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">✨ Массив X (результат формулы)</h2>
                            <div className="flex gap-2 flex-wrap">
                                {final?.X?.map((val, i) => (
                                    <span key={i} className="bg-green-200 px-2 py-1 rounded">
                                        X[{i}] = {val}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Массив Y (отсортированный) */}
                        <div className="bg-gray-100 p-4 rounded mb-6">
                            <h2 className="font-bold text-lg mb-2">🔄 Массив Y (сортировка Шелла ↑)</h2>
                            <div className="flex gap-2 flex-wrap">
                                {final?.Ysorted?.map((val, i) => (
                                    <span key={i} className="bg-blue-200 px-2 py-1 rounded">
                                        Ys[{i}] = {val}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Кнопка назад */}
                        <div className="w-full flex justify-end mt-6">
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-linear-to-br from-indigo-900 via-purple-800 to-pink-700 px-6 py-2 rounded-xl text-white hover:scale-105 transition"
                            >
                                Назад
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

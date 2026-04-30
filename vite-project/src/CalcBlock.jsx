import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { computeAll, exportToTxt } from "./core/Calculations.js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CalcBlock() {
    const location = useLocation();
    const navigate = useNavigate();
    const [dan, setDan] = useState(null);
    const [activeTab, setActiveTab] = useState('results');
    const [isLoading, setIsLoading] = useState(true); // Добавили состояние загрузки
    const [error, setError] = useState(null); // Добавили состояние ошибки

    // Исправленный эффект с обработкой ошибок и отменой
    useEffect(() => {
        let isMounted = true; // Флаг для предотвращения утечек памяти
        
        const loadData = async () => {
            const inputData = location.state?.dan;
            
            if (!inputData) {
                navigate('/');
                return;
            }
            
            try {
                setIsLoading(true);
                const computed = computeAll(inputData);
                
                if (isMounted) {
                    setDan(computed);
                    setError(null);
                }
            } catch (error) {
                console.error('Ошибка вычислений:', error);
                if (isMounted) {
                    setError(error.message);
                    alert(`Ошибка вычислений: ${error.message}`);
                    navigate('/');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        loadData();
        
        return () => {
            isMounted = false; // Cleanup function
        };
    }, [location, navigate]); // Зависимости остались те же

    // Мемоизированная функция генерации контента
    const generateFileContent = useCallback(() => {
        if (!dan) return '';
        const { m, b, s, A, C, X, Y, Ysorted } = dan;
        return `
══════════════════════════════════════
РЕЗУЛЬТАТЫ РАСЧЕТОВ (Вариант 28)
══════════════════════════════════════

📊 ПАРАМЕТРЫ:
Размерность m = ${m}
Переменная b = ${b}
Вариант: ${dan.isOdd ? 'нечетный' : 'четный'}
s = ${s.toFixed(4)}
Диапазон A: [${dan.rangeMin}, ${dan.rangeMax}]

📈 МАТРИЦА A (${m}x${m}):
┌${'─'.repeat(m * 11)}┐
${A.map(row => `│ ${row.map(v => v.toFixed(4).padStart(10)).join(' ')} │`).join('\n')}
└${'─'.repeat(m * 11)}┘

📊 МАССИВ C (${dan.isOdd ? 'Фибоначчи' : 'Арифметическая прогрессия'}):
[${C.map(v => v.toFixed(4)).join(', ')}]

🔢 МАССИВ X (По формуле варианта 28):
[${X.map(v => v.toFixed(6)).join(', ')}]

📉 МАССИВ Y (Интерполяция каноническим полиномом):
Шаг интерполяции: 0.5
Количество точек: ${Y.length}
[${Y.map(v => v.toFixed(6)).join(', ')}]

📊 МАССИВ Y (ОТСОРТИРОВАННЫЙ - Шелл по возрастанию):
[${Ysorted.map(v => v.toFixed(6)).join(', ')}]

══════════════════════════════════════
КОНЕЦ РАСЧЕТОВ
══════════════════════════════════════
        `;
    }, [dan]);

    // Мемоизированные данные для графика
    const getChartData = useCallback(() => {
        if (!dan) return [];
        return dan.Y.map((val, idx) => ({
            index: idx,
            original: val,
            sorted: dan.Ysorted[idx]
        }));
    }, [dan]);

    // Улучшенный компонент загрузки
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-pink-500">
                <div className="text-white text-xl animate-pulse">Загрузка данных...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-600 to-purple-500">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка!</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        );
    }

    if (!dan) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
            <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-10 shadow-lg">
                <div className="container mx-auto px-4 flex gap-2 py-3 flex-wrap">
                    {['results', 'file', 'chart'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-xl font-semibold transition-all ${activeTab === tab ? 'bg-white text-purple-700' : 'text-white hover:bg-white/20'}`}
                        >
                            {tab === 'results' ? '📊 Результаты' : tab === 'file' ? '📄 Файл' : '📈 График'}
                        </button>
                    ))}
                    <button 
                        onClick={() => navigate('/')} 
                        className="ml-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg transition-all"
                    >
                        ← Новый расчет
                    </button>
                </div>
            </nav>

            <main className="container mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[500px]">
                    {activeTab === 'results' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                                <h2 className="text-2xl font-bold text-purple-800">Вариант 28</h2>
                                <pre className="text-gray-700 mt-2 whitespace-pre-wrap font-mono text-sm">
                                    {generateFileContent()}
                                </pre>
                            </div>
                        </div>
                    )}
                    {activeTab === 'file' && (
                        <div className="space-y-4">
                            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
                                {generateFileContent()}
                            </pre>
                            <button
                                onClick={() => exportToTxt(generateFileContent())}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all"
                            >
                                💾 Скачать .TXT
                            </button>
                        </div>
                    )}
                    {activeTab === 'chart' && (
                        <div className="h-[500px] w-full">
                            <ResponsiveContainer>
                                <LineChart data={getChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="index" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="original" stroke="#8884d8" name="Оригинал" />
                                    <Line type="monotone" dataKey="sorted" stroke="#82ca9d" name="Сортировка" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
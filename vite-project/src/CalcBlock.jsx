import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { computeAll } from '../core/calculations';
import { exportToTxt } from '../core/fileExport';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CalcBlock() {
    const location = useLocation();
    const navigate = useNavigate();
    const [dan, setDan] = useState(null);
    const [activeTab, setActiveTab] = useState('results');

    useEffect(() => {
        const inputData = location.state?.dan;
        if (!inputData) {
            navigate('/');
            return;
        }
        try {
            const computed = computeAll(inputData);
            setDan(computed);
        } catch (error) {
            alert(`Ошибка вычислений: ${error.message}`);
            navigate('/');
        }
    }, [location, navigate]);

    // Текст файла генерируем "на лету", чтобы не плодить лишние состояния
    const fileContent = useMemo(() => {
        if (!dan) return '';
        const { m, b, s, A, C, X, Y, Ysorted } = dan;
        let c = '═══════════════════════════════════════\n';
        c += '     РЕЗУЛЬТАТЫ РАСЧЕТОВ (Вариант 28)\n';
        c += '═══════════════════════════════════════\n\n';
        c += `m = ${m}, b = ${b}, s = ${s.toFixed(4)}\n\n`;
        c += 'Матрица A:\n' + A.map(row => row.map(v => v.toFixed(4).padStart(12)).join('')).join('\n') + '\n\n';
        c += `Массив C: ${C.map(v => v.toFixed(4)).join(', ')}\n`;
        c += `Массив X: ${X.map(v => v.toFixed(6)).join(', ')}\n`;
        c += `Массив Y: ${Y.map(v => v.toFixed(6)).join(', ')}\n`;
        c += `Сортировка: ${Ysorted.map(v => v.toFixed(6)).join(', ')}\n`;
        return c;
    }, [dan]);

    const chartData = useMemo(() => 
        dan ? dan.Y.map((val, idx) => ({ index: idx, original: val, sorted: dan.Ysorted[idx] })) : []
    , [dan]);

    if (!dan) return (
        <div className="flex items-center justify-center h-screen bg-linear-to-br from-purple-600 to-pink-500">
            <div className="text-white text-xl animate-pulse">Загрузка данных...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-800 to-pink-700">
            {/* Меню */}
            <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-10 shadow-lg">
                <div className="container mx-auto px-4 flex gap-2 py-3 flex-wrap">
                    {['results', 'file', 'chart'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                                activeTab === tab ? 'bg-white text-purple-700' : 'text-white hover:bg-white/20'
                            }`}
                        >
                            {tab === 'results' ? '📊 Результаты' : tab === 'file' ? '📄 Файл' : '📈 График'}
                        </button>
                    ))}
                    <button onClick={() => navigate('/')} className="ml-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all">
                        ← Новый расчет
                    </button>
                </div>
            </nav>
            
            <main className="container mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[400px]">
                    {activeTab === 'results' && (
                        <div className="space-y-6">
                            <div className="bg-linear-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                                <h2 className="text-2xl font-bold text-purple-800">Вариант 28</h2>
                                <code className="block text-gray-700 mt-2">Xi = (b + s)·C_i + Σ (A[i,k] + C_k) / (|A[i,k] - p| + 1)</code>
                            </div>
                            {/* Здесь были ошибки, теперь блок закрыт корректно */}
                        </div>
                    )}

                    {activeTab === 'file' && (
                        <div className="space-y-4">
                            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
                                {fileContent}
                            </pre>
                            <button 
                                onClick={() => exportToTxt(fileContent)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all"
                            >
                                💾 Скачать .TXT
                            </button>
                        </div>
                    )}

                    {activeTab === 'chart' && (
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer>
                                <LineChart data={chartData}>
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

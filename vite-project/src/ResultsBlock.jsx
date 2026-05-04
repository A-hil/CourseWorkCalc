
import YChart from './components/YChart';
import { useAppData } from './stores/DataContext';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss';

export default function ResultsBlock() {
    const navigate = useNavigate();
    const { appData, toggleSorting } = useAppData();
    const { enableSorting, formData, results, isLoading } = appData;

    if (isLoading) return <div className="p-8 text-center text-gray-500">Загрузка...</div>;
    if (!results || !results.final) return null;

     const { final, input } = results;
     const { Y, Ysorted } = final; 

        const report = {
        parameters: input,
        results: final,
        generatedAt: new Date().toISOString()
    };

    
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
        <div className="min-h-screen bg-blue-50 p-8">
            <div className="card-glass p-6">
            {/* ШАПКА БЛОКА */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Результаты расчетов</h2>
                </div>
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded border border-green-100 uppercase tracking-wider">
                    Рассчитано
                </span>
            </div>

            {/* ИСХОДНЫЙ МАССИВ X */}
            <div className="mb-6">
                <div className="flex justify-between mb-3">
                    <span className="label-caps">Исходный массив X</span>
                    <span className="text-[10px] text-gray-300">n={final?.X?.length}</span>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400">
                                <th className="px-6 py-2 font-bold w-16">#</th>
                                <th className="px-6 py-2 font-bold">Значение</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {final?.X?.map((val, i) => (
                                <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">{i}</td>
                                    <td className="px-6 py-3 text-gray-700 font-mono text-sm tracking-tight">{val.toFixed(5)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
    <div className={`flex items-center gap-3 border rounded-full px-4 py-1.5 transition-all duration-300 ${
        enableSorting ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-dashed border-gray-300 opacity-70'
    }`}>
        
        {/* Иконка меняет цвет в зависимости от флага */}
        <svg 
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            strokeWidth="2.5" className={enableSorting ? "text-blue-500" : "text-gray-400"}
        >
            <path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h4"/><path d="M11 8h7"/><path d="M11 12h10"/>
        </svg>

        <p className="text-gray-500 text-sm font-medium tracking-tight">
            {enableSorting ? 'Shell Сортировка' : 'Сортировка отключена'}
        </p>

        {/* Шаги показываем только если true */}
        {enableSorting && (
            <div className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 animate-in fade-in zoom-in duration-300">
                <span className="text-slate-400 text-[10px] font-mono uppercase">
                    шаги: <span className="text-slate-600 font-bold">4, 2, 1</span>
                </span>
            </div>
        )}

        {/* Кнопка-переключатель */}
        <button 
            onClick={() => toggleSorting()} // Вызывает смену true <-> false в контексте
            className={`ml-2 text-lg leading-none transition-transform duration-300 hover:scale-125 ${
                enableSorting ? 'text-gray-400 hover:text-red-500' : 'text-blue-500 rotate-45'
            }`}
        >
            ×
        </button>
    </div>
</div>


            {/* ОТСОРТИРОВАННЫЙ МАССИВ Y */}
            <div>
                <div className="flex justify-between mb-3">
                    <span className="label-caps">Отсортированный массив Y</span>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase text-gray-400">
                                <th className="px-6 py-2 font-bold w-16">#</th>
                                <th className="px-6 py-2 font-bold">Значение</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {final?.Ysorted?.map((val, i) => (
                                <tr key={i} className="hover:bg-green-50/20 transition-colors">
                                    <td className="px-6 py-3 text-gray-400 font-mono text-xs">{i}</td>
                                    <td className="px-6 py-3 text-gray-700 font-mono text-sm tracking-tight">{val.toFixed(5)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
        
        
<div className="card-glass p-6 mt-6">
    <YChart 
        yOriginal={Y}   
        ySorted={Ysorted}  

    />
        </div>
        </div>
    );
}

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function YChart({ yOriginal, ySorted }) {

        if (!yOriginal || !Array.isArray(yOriginal)) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Ожидание данных для графика...</p>
            </div>
        );
    }

    // 2. Форматируем данные: объединяем два массива в один для Recharts
    const chartData = yOriginal.map((val, i) => ({
        index: i,
        "Исходный Y": parseFloat(val.toFixed(4)),
        "Отсортированный Y": ySorted ? parseFloat(ySorted[i]?.toFixed(4)) : null
    }));

    return (
        <div className="h-full w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="label-caps mb-6">График распределения Y</h3>
            
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis 
                            dataKey="index" 
                            tick={{fontSize: 10}} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        
                        <YAxis 
                            tick={{fontSize: 10}} 
                            tickLine={false} 
                            axisLine={false} 
                            stroke="#94a3b8"
                        />
                        
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        
                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle" 
                            wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} 
                        />
                        
                        <Line
                            type="monotone"
                            dataKey="Исходный Y"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            dot={{ r: 2, fill: '#94a3b8' }}
                            activeDot={{ r: 4 }}
                        />
                        
                        <Line
                            type="monotone"
                            dataKey="Отсортированный Y"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 2, fill: '#3b82f6' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

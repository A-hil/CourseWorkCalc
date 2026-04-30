import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dan } from '../core/Dan';

export default function InputForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        m: 3,
        b: 1,
        rangeMin: 0,
        rangeMax: 10,
        isOdd: true,
        C0: 1,
        r: 1
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    };

    const handleSubmit = () => {
        if (formData.m < 2 || formData.m > 10) {
            alert('Размерность m должна быть от 2 до 10');
            return;
        }
        if (!formData.isOdd && formData.r === 0) {
            alert('Для четного варианта r не может быть 0');
            return;
        }
        
        const dan = new Dan();
        Object.assign(dan, formData);
        
        navigate('/calc', { state: { dan } });
    };

    const loadExample = () => {
        setFormData({
            m: 4,
            b: 2.5,
            rangeMin: 1,
            rangeMax: 20,
            isOdd: true,
            C0: 1,
            r: 2
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Вариант 28
                    </h1>
                    <p className="text-gray-600 mt-2">Расчет по формуле канонического полинома</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Размерность m (2-10)
                        </label>
                        <input
                            type="number"
                            name="m"
                            value={formData.m}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Переменная b
                        </label>
                        <input
                            type="number"
                            name="b"
                            value={formData.b}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Мин граница A
                        </label>
                        <input
                            type="number"
                            name="rangeMin"
                            value={formData.rangeMin}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Макс граница A
                        </label>
                        <input
                            type="number"
                            name="rangeMax"
                            value={formData.rangeMax}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                        />
                    </div>
                    
                    <div className="col-span-2">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Тип варианта:</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={formData.isOdd === true}
                                        onChange={() => setFormData(prev => ({ ...prev, isOdd: true }))}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <span>Нечетный (Фибоначчи)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={formData.isOdd === false}
                                        onChange={() => setFormData(prev => ({ ...prev, isOdd: false }))}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <span>Четный (Прогрессия)</span>
                                </label>
                            </div>
                        </label>
                    </div>
                    
                    {!formData.isOdd && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    C[0] (первый член)
                                </label>
                                <input
                                    type="number"
                                    name="C0"
                                    value={formData.C0}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    r (разность)
                                </label>
                                <input
                                    type="number"
                                    name="r"
                                    value={formData.r}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </>
                    )}
                </div>
                
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={loadExample}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105"
                    >
                        📋 Контрольный пример
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
                    >
                        Вычислить →
                    </button>
                </div>
            </div>
        </div>
    );
}
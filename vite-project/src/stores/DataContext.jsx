import { createContext, useContext, useState } from 'react';
import { calculateAll } from '../core/calculations';

const DataContext = createContext(null);


export function DataProvider({ children }) {
    const [appData, setAppData] = useState({
        formData: null,
        matrixA: null,
        vectorC: null,
        isOdd: null,
        results: null,
        isLoading: false,
        error: null,
        lastUpdated: null
    });

    // 1. Валидация (вынесена отдельно)
    const validateData = (data) => {
        const { m, b, rangeMin, rangeMax, isOdd, C0, r } = data;
        
        if (m < 2 || m > 10) throw new Error('m от 2 до 10');
        if (isNaN(b) || b === 0) throw new Error('b должно быть ненулевым числом');
        if (rangeMin >= rangeMax) throw new Error('min < max');
        
        if (!isOdd) {
            if (isNaN(C0)) throw new Error('C0 должно быть числом');
            if (r === 0) throw new Error('r не может быть 0');
        }
        return true;
    };

    // 2. Расчеты
    const calculate = (inputData) => {
        setAppData(prev => ({ ...prev, isLoading: true, error: null }));
        
        try {
            const results = calculateAll(inputData);
            setAppData(prev => ({
                ...prev,
                results,
                isLoading: false,
                lastUpdated: results.meta?.timestamp || new Date().toISOString()
            }));
        } catch (error) {
            setAppData(prev => ({ ...prev, error: error.message, isLoading: false }));
        }
    };

    // 3. Обновление данных из формы
    const updateData = (newData) => {
        try {
            validateData(newData);
            // Если валидация прошла, сохраняем данные и запускаем расчет
            setAppData(prev => ({
                ...prev,
                formData: newData,
                lastUpdated: new Date().toISOString()
            }));
            calculate(newData); 
        } catch (error) {
            setAppData(prev => ({ ...prev, error: error.message }));
        }
    };

    return (
        <DataContext.Provider value={{ appData, updateData, calculate }}>
            {children}
        </DataContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useAppData must be used within DataProvider');
    }
    return context;
}

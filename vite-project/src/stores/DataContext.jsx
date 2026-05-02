import { createContext, useContext, useState } from 'react';
import { calculateAll } from '../core/calculations';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [appData, setAppData] = useState({
        formData: null,
        results: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
        pregeneratedData: null
    });

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

    const updateData = (newData, pregeneratedData) => {
        console.log('🟡 updateData:', { newData, pregeneratedData });
        
        try {
            validateData(newData);
            
            // Проверка перед расчетом
            if (!pregeneratedData?.A || !pregeneratedData?.C) {
                throw new Error('pregeneratedData не содержит A или C');
            }
            
            const results = calculateAll(newData, pregeneratedData);
            console.log('🟢 Results:', results);
            
            setAppData({
                formData: newData,
                pregeneratedData: pregeneratedData,
                results: results,
                isLoading: false,
                error: null,
                lastUpdated: results.meta?.timestamp || new Date().toISOString()
            });
        } catch (error) {
            console.log('🔴 Ошибка:', error.message);
            setAppData(prev => ({ 
                ...prev, 
                error: error.message, 
                isLoading: false,
                results: null 
            }));
        }
    };

    return (
        <DataContext.Provider value={{ appData, updateData }}>
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
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [appData, setAppData] = useState({
        formData: null,
        matrixA: null,
        vectorC: null,
        isOdd: null,
        lastUpdated: null
    });

    const updateData = (newData) => {
        setAppData(prev => ({
            ...prev,
            ...newData,
            lastUpdated: new Date().toISOString()
        }));
    };

    return (
        <DataContext.Provider value={{ appData, updateData }}>
            {children}
        </DataContext.Provider>
    );
}

// ✅ Хук для использования данных
export function useAppData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useAppData must be used within DataProvider');
    }
    return context;
}
// vite-project/src/core/Calculations.js

import Dan from './Dan';
import { generateMatrixA, generateArrayC, calculateS } from './Generators.js';

/**
 * ФОРМУЛА ВАРИАНТА 28
 * Xi = (b + s) * C_i + Σ(k=0..m-1) (A[i][k] + C_k) / (|A[i][k] - p| + 1)
 * 
 * @param {Dan} dan - Экземпляр класса Dan с данными
 * @returns {number[]} Массив X
 */
export function calculateX(dan) {
    // Проверяем, что dan - экземпляр Dan
    if (!(dan instanceof Dan)) {
        throw new Error('calculateX expects an instance of Dan class');
    }
    
    const { A, C, b, m, s } = dan;
    
    if (!A || !C || !m) {
        throw new Error('Missing required properties: A, C, or m');
    }
    
    const X = new Array(m);
    let p = 1;  // p = 1 для X[0]
    
    for (let i = 0; i < m; i++) {
        let sum = 0;
        
        // Вычисляем сумму по k
        for (let k = 0; k < m; k++) {
            const numerator = A[i][k] + C[k];
            const denominator = Math.abs(A[i][k] - p) + 1;
            
            // Защита от деления на ноль (хотя denominator всегда >= 1)
            if (denominator === 0) {
                console.warn(`Denominator is zero at i=${i}, k=${k}, using 1 instead`);
                sum += numerator;
            } else {
                sum += numerator / denominator;
            }
        }
        
        // Основная формула варианта 28
        X[i] = (b + s) * C[i] + sum;
        
        // Для следующей итерации p = X[i]
        p = X[i];
    }
    
    // Округляем до 6 знаков и возвращаем
    return X.map(v => Number(v.toFixed(6)));
}

/**
 * КАНОНИЧЕСКИЙ ПОЛИНОМ (интерполяция)
 * Для вариантов: 2,8,11,13,16,19,23,25,28,29
 * 
 * @param {number[]} X - Исходный массив для интерполяции
 * @param {number} pointsCount - Количество точек интерполяции (опционально)
 * @returns {number[]} Интерполированный массив Y
 */
export function canonicalPolynomial(X, pointsCount = null) {
    if (!X || X.length === 0) {
        throw new Error('X array is empty or undefined');
    }
    
    const n = X.length;
    
    // Если всего 1 точка, возвращаем её (нет смысла интерполировать)
    if (n === 1) {
        return [X[0]];
    }
    
    // Интерполируем с шагом 0.5, получаем (n-1)*2 + 1 точек
    const step = 0.5;
    const result = [];
    
    // Количество точек интерполяции
    const numPoints = pointsCount || (n - 1) * 2 + 1;
    
    for (let t = 0; t < numPoints; t++) {
        const x = t * step; // x от 0 до n-1 с шагом 0.5
        
        // Линейная интерполяция между соседними точками
        const index = Math.min(Math.floor(x), n - 2);
        const frac = x - index;
        
        if (index < n - 1) {
            const y = X[index] + frac * (X[index + 1] - X[index]);
            result.push(Number(y.toFixed(6)));
        } else {
            result.push(Number(X[index].toFixed(6)));
        }
    }
    
    return result;
}

/**
 * СОРТИРОВКА ШЕЛЛА (по возрастанию)
 * Для вариантов: 1,4,7,10,13,16,19,22,25,28
 * 
 * @param {number[]} arr - Исходный массив
 * @param {boolean} ascending - Сортировать по возрастанию (true) или убыванию (false)
 * @returns {number[]} Отсортированный массив
 */
export function shellSort(arr, ascending = true) {
    if (!arr || arr.length === 0) {
        return [];
    }
    
    const result = [...arr];
    const n = result.length;
    
    // Оптимизированная последовательность шагов для сортировки Шелла
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = result[i];
            let j = i;
            
            // Сортировка вставками с заданным шагом
            while (j >= gap && ((ascending && result[j - gap] > temp) || 
                               (!ascending && result[j - gap] < temp))) {
                result[j] = result[j - gap];
                j -= gap;
            }
            result[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    
    return result.map(v => Number(v.toFixed(6)));
}

/**
 * Главная функция вычислений
 * 
 * @param {Object|Dan} inputData - Plain object или экземпляр Dan
 * @returns {Dan} Обогащенный экземпляр Dan
 */
export function computeAll(inputData) {
    // Преобразуем plain object в экземпляр Dan, если нужно
    const dan = inputData instanceof Dan ? inputData : new Dan(inputData);
    
    // Валидируем входные данные
    try {
        dan.validate();
    } catch (error) {
        // Сохраняем причину ошибки (cause)
        throw new Error(`Validation failed: ${error.message}`, { cause: error });
    }
    
    // 1. Генерируем матрицу A
    try {
        dan.A = generateMatrixA(dan);
        if (!dan.A || dan.A.length !== dan.m) {
            throw new Error('Matrix A generation failed');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`Matrix A generation error: ${error.message}`, { cause: error });
    }
    
    // 2. Генерируем массив C (Фибоначчи или прогрессия)
    try {
        dan.C = generateArrayC(dan);
        if (!dan.C || dan.C.length !== dan.m) {
            throw new Error('Array C generation failed');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`Array C generation error: ${error.message}`, { cause: error });
    }
    
    // 3. Вычисляем s (сумма диагонали)
    try {
        dan.s = calculateS(dan.A, dan.isOdd);
        if (isNaN(dan.s)) {
            throw new Error('S calculation returned NaN');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`S calculation error: ${error.message}`, { cause: error });
    }
    
    // 4. Вычисляем X по формуле варианта 28
    try {
        dan.X = calculateX(dan);
        if (!dan.X || dan.X.length !== dan.m) {
            throw new Error('X calculation failed');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`X calculation error: ${error.message}`, { cause: error });
    }
    
    // 5. Интерполяция каноническим полиномом → Y
    try {
        dan.Y = canonicalPolynomial(dan.X);
        if (!dan.Y || dan.Y.length === 0) {
            throw new Error('Y interpolation failed');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`Y interpolation error: ${error.message}`, { cause: error });
    }
    
    // 6. Сортировка Шелла по возрастанию
    try {
        dan.Ysorted = shellSort(dan.Y, true);
        if (!dan.Ysorted || dan.Ysorted.length !== dan.Y.length) {
            throw new Error('Y sorting failed');
        }
    } catch (error) {
        // Сохраняем причину ошибки
        throw new Error(`Y sorting error: ${error.message}`, { cause: error });
    }
    
    // Вычисляем диапазон для матрицы A (если не задан)
    if (!dan.rangeMin && dan.A.length > 0) {
        dan.rangeMin = Math.min(...dan.A.flat());
        dan.rangeMax = Math.max(...dan.A.flat());
    }
    
    return dan;
}

/**
 * Экспорт результатов в текстовый файл
 * 
 * @param {string} content - Содержимое для экспорта
 * @param {string} filename - Имя файла (опционально)
 */
export function exportToTxt(content, filename = null) {
    if (!content || typeof content !== 'string') {
        throw new Error('Invalid content for export');
    }
    
    // Создаем blob с UTF-8 кодировкой для поддержки русских символов
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const defaultFilename = `calculation_results_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    link.href = url;
    link.download = filename || defaultFilename;
    
    // Добавляем в DOM, кликаем и удаляем
    document.body.appendChild(link);
    link.click();
    
    // Очистка
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Вспомогательная функция для отладки (не используется в production)
 */
export function debugDan(dan) {
    // Проверяем, что мы не в production среде
    // Используем try-catch для определения окружения без process
    const isDevelopment = (() => {
        try {
            // Для Vite используем import.meta.env
            if (typeof import.meta !== 'undefined' && import.meta.env) {
                return import.meta.env.DEV === true;
            }
            // Fallback: всегда возвращаем true для отладки в开发 режиме
            return true;
        } catch {
            // Если не можем определить, возвращаем false для production
            return false;
        }
    })();
    
    if (isDevelopment) {
        console.group('Dan Debug Info');
        console.log('m:', dan.m);
        console.log('b:', dan.b);
        console.log('s:', dan.s);
        console.log('isOdd:', dan.isOdd);
        console.log('A shape:', dan.A?.length, 'x', dan.A?.[0]?.length);
        console.log('C length:', dan.C?.length);
        console.log('X length:', dan.X?.length);
        console.log('Y length:', dan.Y?.length);
        console.log('Ysorted length:', dan.Ysorted?.length);
        console.groupEnd();
    }
}

// Экспорт по умолчанию для удобства
export default {
    calculateX,
    canonicalPolynomial,
    shellSort,
    computeAll,
    exportToTxt,
    debugDan
};
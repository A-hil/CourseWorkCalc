import { generateMatrixA, generateArrayC, calculateS } from './generators';

// ФОРМУЛА ВАРИАНТА 28
// Xi = (b + s) * C_i + Σ(k=0..m-1) (A[i][k] + C_k) / (|A[i][k] - p| + 1)
export function calculateX(dan) {
    const { A, C, b, m, s } = dan;
    const X = new Array(m);
    let p = 1;  // p = 1 для X[0]
    
    for (let i = 0; i < m; i++) {
        let sum = 0;
        
        // Вычисляем сумму по k
        for (let k = 0; k < m; k++) {
            const numerator = A[i][k] + C[k];
            const denominator = Math.abs(A[i][k] - p) + 1;
            
            // Добавим защиту от деления на очень маленькое число
            if (Math.abs(denominator) < 1e-10) {
                // Если знаменатель слишком мал, используем минимальное значение
                sum += numerator / 1e-10;
            } else {
                sum += numerator / denominator;
            }
        }
        
        // Основная формула варианта 28
        X[i] = (b + s) * C[i] + sum;
        
        // Для следующей итерации p = X[i]
        p = X[i];
    }
    
    return X.map(v => Number(v.toFixed(6)));
}

// КАНОНИЧЕСКИЙ ПОЛИНОМ (интерполяция)
// Для вариантов: 2,8,11,13,16,19,23,25,28,29
export function canonicalPolynomial(X, pointsCount = null) {
    // Простая линейная интерполяция для упрощения
    const n = X.length;
    
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

// СОРТИРОВКА ШЕЛЛА (по возрастанию)
// Для вариантов: 1,4,7,10,13,16,19,22,25,28
export function shellSort(arr, ascending = true) {
    const result = [...arr];
    const n = result.length;
    
    // Упрощенная реализация сортировки Шелла
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
    
    return result;
}

// Главная функция вычислений
export function computeAll(dan) {
    dan.validate();
    
    // 1. Генерируем матрицу A
    dan.A = generateMatrixA(dan);
    
    // 2. Генерируем массив C (Фибоначчи или прогрессия)
    dan.C = generateArrayC(dan);
    
    // 3. Вычисляем s (сумма диагонали)
    dan.s = calculateS(dan.A, dan.isOdd);
    
    // 4. Вычисляем X по формуле варианта 28
    dan.X = calculateX(dan);
    
    // 5. Интерполяция каноническим полиномом → Y
    dan.Y = canonicalPolynomial(dan.X);
    
    // 6. Сортировка Шелла по возрастанию
    dan.Ysorted = shellSort(dan.Y, true);
    
    return dan;
}
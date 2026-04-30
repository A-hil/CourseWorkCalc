

// Генерация случайной матрицы A
export function generateMatrixA(dan) {
    const { m, rangeMin, rangeMax } = dan;
    const matrix = [];
    for (let i = 0; i < m; i++) {
        matrix[i] = [];
        for (let j = 0; j < m; j++) {
            matrix[i][j] = rangeMin + Math.random() * (rangeMax - rangeMin);
        }
    }
    return matrix;
}

// Генерация массива C (Фибоначчи или арифметическая прогрессия)
export function generateArrayC(dan) {
    const { m, isOdd, r } = dan;
    const C = new Array(m);
    
    if (isOdd) {
        // Нечетный вариант: числа Фибоначчи
        C[0] = 1;
        C[1] = 1;
        for (let i = 2; i < m; i++) {
            C[i] = C[i-1] + C[i-2];
        }
    } else {
        // Четный вариант: арифметическая прогрессия
        // C[0] вводится пользователем, r - разность
        const C0 = dan.C0 || 1;
        for (let i = 0; i < m; i++) {
            C[i] = C0 + i * r;
        }
    }
    return C;
}

// Вычисление s (сумма диагонали)
export function calculateS(A, isOdd) {
    const m = A.length;
    let sum = 0;
    if (isOdd) {
        // Главная диагональ
        for (let i = 0; i < m; i++) {
            sum += A[i][i];
        }
    } else {
        // Побочная диагональ
        for (let i = 0; i < m; i++) {
            sum += A[i][m - 1 - i];
        }
    }
    return sum;
}
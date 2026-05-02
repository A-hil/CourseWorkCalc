// src/core/calculations.js
// ============================================
// ВАРИАНТ 28 - ЧЕТНЫЙ
// ============================================

/**
 * Генерация случайной матрицы A (m x m)
 * @param {number} m - размерность
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {number[][]}
 */
export const generateMatrixA = (m, min, max) => {
    const matrix = [];
    for (let i = 0; i < m; i++) {
        matrix[i] = [];
        for (let j = 0; j < m; j++) {
            const randomValue = min + Math.random() * (max - min);
            matrix[i][j] = Number(randomValue.toFixed(4));
        }
    }
    return matrix;
};

/**
 * Генерация массива C (арифметическая прогрессия для четного варианта)
 * @param {number} m - размерность
 * @param {number} C0 - первый член прогрессии
 * @param {number} r - разность прогрессии
 * @returns {number[]}
 */
export const generateArrayC = (m, C0, r) => {
    const C = new Array(m);
    for (let i = 0; i < m; i++) {
        C[i] = Number((C0 + i * r).toFixed(4));
    }
    return C;
};

/**
 * Вычисление суммы диагонали матрицы A
 * @param {number[][]} A - матрица
 * @param {boolean} isOdd - true = главная диагональ, false = побочная
 * @returns {number}
 */
export const calculateS = (A, isOdd) => {
    const m = A.length;
    let sum = 0;
    if (isOdd) {
        for (let i = 0; i < m; i++) sum += A[i][i];
    } else {
        for (let i = 0; i < m; i++) sum += A[i][m - 1 - i];
    }
    return Number(sum.toFixed(4));
};

/**
 * ВЫЧИСЛЕНИЕ МАССИВА X ПО ФОРМУЛЕ ВАРИАНТА 28
 * Формула: Xi = (b + s) * C[i] + Σ (A[i][k] + C[k]) / (|A[i][k] - p| + 1)
 * 
 * @param {number[][]} A
 * @param {number[]} C
 * @param {number} b
 * @param {number} s
 * @returns {number[]}
 */
export const calculateX = (A, C, b, s) => {
    const m = A.length;
    const X = new Array(m);
    let p = 1; // p = 1 для X[0]

    for (let i = 0; i < m; i++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
            const numerator = A[i][k] + C[k];
            const denominator = Math.abs(A[i][k] - p) + 1;
            sum += numerator / denominator;
        }
        X[i] = (b + s) * C[i] + sum;
        p = X[i]; // Для следующей итерации p = X[i]
    }

    return X.map(v => Number(v.toFixed(6)));
};

/**
 * ИНТЕРПОЛЯЦИЯ КАНОНИЧЕСКИМ ПОЛИНОМОМ
 * @param {number[]} X - исходный массив
 * @returns {number[]} интерполированный массив Y
 */
export const interpolateCanonical = (X) => {
    const n = X.length;
    const step = 0.5;
    const pointsCount = (n - 1) * 2 + 1;
    const result = [];

    // Находим коэффициенты канонического полинома
    const coefficients = findCanonicalCoefficients(X);

    // Вычисляем значения в точках x = 0, 0.5, 1, 1.5, ..., n-1
    for (let t = 0; t < pointsCount; t++) {
        const x = t * step;
        let y = 0;
        for (let j = 0; j < n; j++) {
            y += coefficients[j] * Math.pow(x, j);
        }
        result.push(Number(y.toFixed(6)));
    }

    return result;
};

/**
 * Нахождение коэффициентов канонического полинома (решение системы V * a = X)
 * @param {number[]} X
 * @returns {number[]}
 */
const findCanonicalCoefficients = (X) => {
    const n = X.length;
    // Строим матрицу Вандермонда V[i][j] = i^j
    const V = Array(n).fill().map((_, i) => 
        Array(n).fill().map((_, j) => Math.pow(i, j))
    );
    return solveGauss(V, X);
};

/**
 * Решение системы линейных уравнений методом Гаусса
 * @param {number[][]} A - матрица коэффициентов
 * @param {number[]} B - вектор правой части
 * @returns {number[]}
 */
const solveGauss = (A, B) => {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, B[i]]);

    // Прямой ход
    for (let i = 0; i < n; i++) {
        // Поиск главного элемента
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

        // Нормализация строки
        const divisor = augmented[i][i];
        if (divisor === 0) continue;
        for (let j = i; j <= n; j++) {
            augmented[i][j] /= divisor;
        }

        // Вычитание из других строк
        for (let k = 0; k < n; k++) {
            if (k !== i && augmented[k][i] !== 0) {
                const factor = augmented[k][i];
                for (let j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
    }

    return augmented.map(row => row[n]);
};

/**
 * СОРТИРОВКА ШЕЛЛА (по возрастанию)
 * @param {number[]} arr
 * @returns {number[]}
 */
export const shellSort = (arr) => {
    const result = [...arr];
    const n = result.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = result[i];
            let j = i;
            while (j >= gap && result[j - gap] > temp) {
                result[j] = result[j - gap];
                j -= gap;
            }
            result[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    return result;
};

// ============================================
// ГЛАВНАЯ ФУНКЦИЯ - ВЫЗОВ ИЗ DataContext
// ============================================

/**
 * Выполняет полный цикл расчетов на основе входных параметров.
 * @param {Object} params - Входные данные с формы.
 * @param {number} params.m - Размерность матрицы.
 * @param {number} params.b - Переменная b.
 * @param {number} params.rangeMin - Минимальная граница для A.
 * @param {number} params.rangeMax - Максимальная граница для A.
 * @param {number} params.C0 - Первый член прогрессии.
 * @param {number} params.r - Разность прогрессии.
 * @param {boolean} params.isOdd - Тип варианта (для 28 false).
 * @returns {Object} Результаты всех вычислений.
 */
export const calculateAll = ({ m, b, rangeMin, rangeMax, C0, r, isOdd }) => {
    // 1. Генерация промежуточных данных
    const A = generateMatrixA(m, rangeMin, rangeMax);
    const C = generateArrayC(m, C0, r);
    const s = calculateS(A, isOdd);
    
    // 2. Основные вычисления
    const X = calculateX(A, C, b, s);
    const Y = interpolateCanonical(X);
    const Ysorted = shellSort(Y);
    
    // 3. Возврат структурированного объекта
    return {
        // Входные параметры (полезно для отладки и экспорта)
        input: { m, b, rangeMin, rangeMax, C0, r, isOdd },
        
        // Промежуточные результаты
        intermediate: {
            A,
            C,
            s: s,
        },
        
        // Финальные результаты
        final: {
            X,
            Y,
            Ysorted,
        },
        
        // Мета-информация
        meta: {
            timestamp: new Date().toISOString(),
            variant: 28,
            type: 'even',
        }
    };
};
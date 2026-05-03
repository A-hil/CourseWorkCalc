//Вычисление суммы диагонали матрицы A
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

// ВЫЧИСЛЕНИЕ МАССИВА X ПО ФОРМУЛЕ ВАРИАНТА 28
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
//ИНТЕРПОЛЯЦИЯ КАНОНИЧЕСКИМ ПОЛИНОМОМ
export const interpolateCanonical = (X) => {
    const n = X.length;
    const step = 0.5;
    const pointsCount = (n - 1) * 2 + 1;
    const result = [];
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
const findCanonicalCoefficients = (X) => {
    const n = X.length;
    // Строим матрицу Вандермонда V[i][j] = i^j
    const V = Array(n).fill().map((_, i) => 
        Array(n).fill().map((_, j) => Math.pow(i, j))
    );
    return solveGauss(V, X);
};
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
// СОРТИРОВКА ШЕЛЛА (по возрастанию)
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
// ГЛАВНАЯ ФУНКЦИЯ - ВЫЗОВ ИЗ DataContext
export const calculateAll = (inputData, pregeneratedData) => {
    const { m, b, rangeMin, rangeMax, C0, r, isOdd } = inputData;
    
    const A = pregeneratedData.A;
    const C = pregeneratedData.C;
    
    const s = calculateS(A, isOdd);
    const X = calculateX(A, C, b, s);
    const Y = interpolateCanonical(X);
    const Ysorted = shellSort(Y);
    
    if (!pregeneratedData?.A || !pregeneratedData?.C) {
        throw new Error('pregeneratedData не содержит A или C');
    }

    return {
        input: { m, b, rangeMin, rangeMax, C0, r, isOdd },
        intermediate: { A, C, s },
        final: { X, Y, Ysorted },
        meta: { timestamp: new Date().toISOString(), variant: 28, type: 'even' }
    };
};
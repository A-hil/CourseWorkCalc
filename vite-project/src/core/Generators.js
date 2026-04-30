// vite-project/src/core/Generators.js

export function generateMatrixA(dan) {
    const { m, rangeMin = 0, rangeMax = 10, isOdd } = dan;
    const matrix = [];
    
    for (let i = 0; i < m; i++) {
        matrix[i] = [];
        for (let j = 0; j < m; j++) {
            if (isOdd) {
                matrix[i][j] = Number((rangeMin + Math.random() * (rangeMax - rangeMin)).toFixed(4));
            } else {
                matrix[i][j] = Number((rangeMin + (i * m + j) * ((rangeMax - rangeMin) / (m * m))).toFixed(4));
            }
        }
    }
    
    return matrix;
}

export function generateArrayC(dan) {
    const { m, isOdd, r = 1, C0 = 1 } = dan;
    const C = [];
    
    if (isOdd) {
        let a = C0, b = C0;
        for (let i = 0; i < m; i++) {
            C.push(Number(a.toFixed(4)));
            [a, b] = [b, a + b];
        }
    } else {
        for (let i = 0; i < m; i++) {
            C.push(Number((C0 + i * r).toFixed(4)));
        }
    }
    
    return C;
}

export function calculateS(A, isOdd) {
    if (!A || A.length === 0) return 0;
    
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
        if (A[i] && i < A[i].length) {
            sum += A[i][i];
        }
    }
    
    if (!isOdd) {
        sum = sum / A.length;
    }
    
    return Number(sum.toFixed(4));
}

export default {
    generateMatrixA,
    generateArrayC,
    calculateS
};
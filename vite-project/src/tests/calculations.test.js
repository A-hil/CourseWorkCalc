// vite-project/src/tests/calculations.test.js

// Используем ES modules вместо require
import { calculateX, canonicalPolynomial, shellSort, computeAll } from '../core/Calculations.js';
import Dan from '../core/Dan.js';

describe('Вариант 28 - Формула X', () => {
    test('X[0] использует p=1', () => {
        const dan = new Dan();
        dan.m = 3;
        dan.b = 2;
        dan.s = 5;
        dan.C = [1, 1, 2];
        dan.A = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        
        const X = calculateX(dan);
        
        // Проверяем, что X[0] вычислен с p=1
        expect(X.length).toBe(3);
        expect(typeof X[0]).toBe('number');
        expect(isNaN(X[0])).toBe(false);
        
        // Проверяем формулу для первого элемента
        // Xi = (b+s)*Ci + Σ (A[i,k]+Ck)/(|A[i,k]-p|+1)
        const expectedFirst = (2 + 5) * 1 + 
            ((1+1)/(Math.abs(1-1)+1) + (2+1)/(Math.abs(2-1)+1) + (3+2)/(Math.abs(3-1)+1));
        expect(X[0]).toBeCloseTo(expectedFirst, 5);
    });
    
    test('Переменная p обновляется после каждого X[i]', () => {
        const dan = new Dan();
        dan.m = 2;
        dan.b = 1;
        dan.s = 3;
        dan.C = [2, 3];
        dan.A = [
            [1, 2],
            [3, 4]
        ];
        
        const X = calculateX(dan);
        
        // p для X[1] должно быть равно X[0]
        // Проверяем, что X[1] использует другое p
        expect(X[0]).not.toBe(X[1]);
    });
    
    test('Защита от деления на ноль', () => {
        const dan = new Dan();
        dan.m = 2;
        dan.b = 0;
        dan.s = 1;
        dan.C = [0, 0];
        dan.A = [[0, 0], [0, 0]];
        
        // A[i][k] - p = -1, знаменатель = 2, деления на 0 нет
        expect(() => calculateX(dan)).not.toThrow();
    });
});

describe('Канонический полином (интерполяция)', () => {
    test('Возвращает массив правильной длины', () => {
        const X = [1, 2, 3, 4];
        const Y = canonicalPolynomial(X);
        
        // Для m=4, шаг 0.5 → (4-1)*2+1 = 7 точек
        expect(Y.length).toBe(7);
    });
    
    test('Интерполяция проходит через исходные точки', () => {
        const X = [1, 4, 9, 16];
        const Y = canonicalPolynomial(X);
        
        // В точках 0,1,2,3 значения должны совпадать с X
        expect(Y[0]).toBeCloseTo(X[0], 5);
        expect(Y[2]).toBeCloseTo(X[1], 5);
        expect(Y[4]).toBeCloseTo(X[2], 5);
        expect(Y[6]).toBeCloseTo(X[3], 5);
    });
    
    test('Работает с массивом из 2 элементов', () => {
        const X = [1, 5];
        const Y = canonicalPolynomial(X);
        
        // Линейная интерполяция
        expect(Y.length).toBe(3); // (2-1)*2+1 = 3
        expect(Y[0]).toBeCloseTo(1, 5);
        expect(Y[1]).toBeCloseTo(3, 5);
        expect(Y[2]).toBeCloseTo(5, 5);
    });
});

describe('Сортировка Шелла (по возрастанию)', () => {
    test('Сортировка массива по возрастанию', () => {
        const arr = [64, 25, 12, 22, 11];
        const sorted = shellSort(arr, true);
        expect(sorted).toEqual([11, 12, 22, 25, 64]);
    });
    
    test('Сортировка уже отсортированного массива', () => {
        const arr = [1, 2, 3, 4, 5];
        const sorted = shellSort(arr, true);
        expect(sorted).toEqual([1, 2, 3, 4, 5]);
    });
    
    test('Сортировка массива с отрицательными числами', () => {
        const arr = [-5, 3, -1, 0, 2];
        const sorted = shellSort(arr, true);
        expect(sorted).toEqual([-5, -1, 0, 2, 3]);
    });
    
    test('Сортировка с дробными числами', () => {
        const arr = [3.14, 1.5, 2.71, 0.5];
        const sorted = shellSort(arr, true);
        expect(sorted).toEqual([0.5, 1.5, 2.71, 3.14]);
    });
    
    test('Пустой массив', () => {
        expect(shellSort([], true)).toEqual([]);
    });
    
    test('Массив из одного элемента', () => {
        expect(shellSort([42], true)).toEqual([42]);
    });
});

describe('Интеграционный тест', () => {
    test('Полный цикл вычислений', () => {
        const dan = new Dan();
        dan.m = 3;
        dan.b = 2;
        dan.rangeMin = 0;
        dan.rangeMax = 10;
        dan.isOdd = true;
        
        const result = computeAll(dan);
        
        // Проверяем, что все массивы созданы
        expect(result.A.length).toBe(3);
        expect(result.C.length).toBe(3);
        expect(result.X.length).toBe(3);
        expect(result.Y.length).toBeGreaterThan(0);
        expect(result.Ysorted.length).toBe(result.Y.length);
        
        // Проверяем, что Y отсортирован
        for (let i = 0; i < result.Ysorted.length - 1; i++) {
            expect(result.Ysorted[i]).toBeLessThanOrEqual(result.Ysorted[i + 1]);
        }
    });
});
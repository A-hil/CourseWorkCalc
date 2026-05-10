import {
  calculateS,
  calculateX,
  interpolateCanonical,
  shellSort,
  calculateAll,
} from '../core/calculations';

// -------------------------------------------------
// 1. calculateS – уже был, немного расширил
// -------------------------------------------------
describe('calculateS', () => {
  const A = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  test.each`
    isOdd   | expected
    ${true}  | ${15}   // главная диагональ: 1+5+9
    ${false} | ${15}   // побочная: 3+5+7
  `('isOdd=$isOdd возвращает $expected', ({ isOdd, expected }) => {
    expect(calculateS(A, isOdd)).toBe(expected);
  });
});

// -------------------------------------------------
// 2. calculateX – проверяем формулу варианта 28
// -------------------------------------------------
describe('calculateX', () => {
  test('корректный расчёт для простых данных', () => {
    const A = [[1, 2], [2, 1]];
    const C = [1, 2];
    const b = 2;
    const s = 5; // например

    const result = calculateX(A, C, b, s);

    expect(result.length).toBe(2);  
    //Из Excel
    expect(result[0]).toBeCloseTo(11, 1);
    expect(result[1]).toBeCloseTo(14.572727, 5);
  });
});

// -------------------------------------------------
// 3. interpolateCanonical
// -------------------------------------------------
describe('interpolateCanonical', () => {
  test('возвращает массив правильной длины', () => {
    const X = [1, 2, 3];          // n=3
    const step = 0.5;
    const pointsCount = Math.floor((3 - 1) / step) + 1; // 5

    const Y = interpolateCanonical(X, step);
    expect(Y.length).toBe(pointsCount);
  });

  test('значения конечных точек совпадают с исходными X', () => {
    const X = [0, 2, 4];
    const Y = interpolateCanonical(X, 1);  // step=1 => точки x=0,1,2
    expect(Y[0]).toBeCloseTo(X[0], 5);
    expect(Y[2]).toBeCloseTo(X[2], 5);
  });
});

// -------------------------------------------------
// 4. shellSort
// -------------------------------------------------
describe('shellSort', () => {
  test('сортирует массив по возрастанию', () => {
    expect(shellSort([3, 1, 2])).toEqual([1, 2, 3]);
  });

  test('не мутирует исходный массив', () => {
    const arr = [5, 3, 1];
    const sorted = shellSort(arr);
    expect(arr).toEqual([5, 3, 1]);
    expect(sorted).toEqual([1, 3, 5]);
  });
});

// -------------------------------------------------
// 5. calculateAll – интеграционный тест
// -------------------------------------------------
describe('calculateAll', () => {
  const pregen = {
    A: [[1, 2], [2, 1]],
    C: [1, 2],
  };
  const input = {
    m: 2,
    b: 2,
    rangeMin: 1,
    rangeMax: 5,
    C0: 0.5,
    r: 1,
    isOdd: false,
    g: 0.5,
  };

  test('возвращает объект с нужными полями', () => {
    const result = calculateAll(input, pregen);
    expect(result).toHaveProperty('input');
    expect(result).toHaveProperty('intermediate.A');
    expect(result).toHaveProperty('intermediate.C');
    expect(result).toHaveProperty('final.X');
    expect(result).toHaveProperty('final.Y');
    expect(result).toHaveProperty('final.Ysorted');
    expect(result.meta.variant).toBe(28);
  });

  test('Ysorted должен быть отсортирован', () => {
    const result = calculateAll(input, pregen, true);
    const ys = result.final.Ysorted;
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]).toBeGreaterThanOrEqual(ys[i - 1]);
    }
  });
});
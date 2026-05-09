// calculations.test.js
import { calculateS } from '../core/calculations';

describe('calculateS', () => {
  const A = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  test.each`
    isOdd   | expected
    ${true} | ${15}   // главная диагональ 1+5+9
    ${false}| ${15}   // побочная 3+5+7
  `('isOdd=$isOdd возвращает $expected', ({ isOdd, expected }) => {
    expect(calculateS(A, isOdd)).toBe(expected);
  });
});
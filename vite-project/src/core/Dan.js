export class Dan {
    constructor() {
        this.m = 0;           // Размерность матрицы
        this.b = 0;           // Переменная b
        this.rangeMin = 0;    // Мин граница для A
        this.rangeMax = 10;   // Макс граница для A
        this.r = 0;           // Разность прогрессии (для четных)
        this.isOdd = true;    // Нечетный/четный вариант
        this.A = [];          // Матрица m×m
        this.C = [];          // Массив C
        this.X = [];          // Массив X (результат формулы)
        this.Y = [];          // Массив Y (интерполяция)
        this.Ysorted = [];    // Отсортированный Y
        this.sortMethod = 'shell'; // Метод сортировки
    }

    // Валидация входных данных
    validate() {
        if (this.m < 2 || this.m > 10) throw new Error('m должно быть от 2 до 10');
        if (isNaN(this.b)) throw new Error('b должно быть числом');
        if (this.isOdd === false && isNaN(this.r)) throw new Error('r должно быть числом');
        return true;
    }
}
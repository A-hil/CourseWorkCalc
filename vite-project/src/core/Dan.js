// vite-project/src/core/Dan.js

export class Dan {
    constructor(data = null) {
        if (data && data instanceof Dan) {
            // Копирование из существующего экземпляра
            Object.assign(this, data);
            return;
        }
        
        this.m = data?.m || 0;           // Размерность матрицы
        this.b = data?.b || 0;           // Переменная b
        this.rangeMin = data?.rangeMin || 0;    // Мин граница для A
        this.rangeMax = data?.rangeMax || 10;   // Макс граница для A
        this.r = data?.r || 0;           // Разность прогрессии (для четных)
        this.isOdd = data?.isOdd ?? true;    // Нечетный/четный вариант
        this.A = data?.A || [];          // Матрица m×m
        this.C = data?.C || [];          // Массив C
        this.X = data?.X || [];          // Массив X (результат формулы)
        this.Y = data?.Y || [];          // Массив Y (интерполяция)
        this.Ysorted = data?.Ysorted || [];    // Отсортированный Y
        this.sortMethod = data?.sortMethod || 'shell'; // Метод сортировки
        this.s = 0;                      // Добавь, если используется в расчетах
    }

    // Валидация входных данных
    validate() {
        if (this.m < 2 || this.m > 10) {
            throw new Error('m должно быть от 2 до 10');
        }
        if (isNaN(this.b)) {
            throw new Error('b должно быть числом');
        }
        if (this.isOdd === false && isNaN(this.r)) {
            throw new Error('r должно быть числом');
        }
        return true;
    }
    
    // Метод для преобразования в JSON (если нужно сохранять)
    toJSON() {
        return {
            m: this.m,
            b: this.b,
            rangeMin: this.rangeMin,
            rangeMax: this.rangeMax,
            r: this.r,
            isOdd: this.isOdd,
            A: this.A,
            C: this.C,
            X: this.X,
            Y: this.Y,
            Ysorted: this.Ysorted,
            sortMethod: this.sortMethod,
            s: this.s
        };
    }
    
    // Статический метод для создания из plain object
    static fromObject(obj) {
        return new Dan(obj);
    }
}

export default Dan; 
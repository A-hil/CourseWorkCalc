# Калькулятор для курсовой работы (CourseWorkCalc)

Веб-приложение для выполнения специализированных расчетов, разработанное в рамках курсовой работы. Построено с использованием современных инструментов для быстрой и эффективной разработки.

## О проекте

Этот проект представляет собой удобный онлайн-калькулятор, предназначенный для автоматизации сложных вычислений. Он создан, чтобы облегчить процесс расчетов и визуализации данных.

Проект написан на **React** с использованием сборщика **Vite**, что обеспечивает высокую скорость работы и мгновенную перезагрузку модулей (HMR).

## Используемые технологии

*   [React](https://reactjs.org/) — библиотека для создания пользовательских интерфейсов.
*   [Vite](https://vitejs.dev/) — быстрый инструмент сборки и сервер для разработки.
*   [JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript) — язык программирования.
*   [ESLint](https://eslint.org/) — инструмент для поиска и устранения проблем в коде.

## Установка и запуск

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/A-hil/CourseWorkCalc.git
2. Перейдите в папку с проектом:

bash
cd CourseWorkCalc/vite-project
3. Установите все необходимые зависимости
Категория	Пакеты
Фреймворк	react, react-dom (19-я версия)
Сборка	vite, @vitejs/plugin-react
Стили	tailwindcss, @tailwindcss/vite
Маршрутизация	react-router-dom
Графики	recharts
Экспорт в Excel	exceljs, file-saver
Уведомления	react-hot-toast
Тестирование	jest, @testing-library/react, @testing-library/jest-dom, babel-jest и др.
Деплой	gh-pages
Линтинг	eslint, eslint-plugin-react, eslint-plugin-react-hooks и др.

bash
npm install
4. Запустите сервер для разработки:

bash
npm run dev

5. Откройте приложение в браузере, перейдя по адресу http://localhost:5173, который отобразится в терминале.
Возможности
Выполнение ключевых расчетов для курсовой работы.
Экспорт полученных результатов в файлы.
Удобный и интуитивно понятный интерфейс.
Мгновенное обновление данных (HMR) во время разработки.

Структура проекта
vite-project/
├── public/ # статические файлы (favicon, robots.txt)
├── src/
│ ├── assets/ # изображения, шрифты
│ ├── components/
│ │ └── YChart.jsx # графики (recharts)
│ ├── core/
│ │ ├── JS/
│ │ │ ├── calculations.js # основные вычисления
│ │ │ ├── ExcelExport.js # экспорт в Excel
│ │ │ └── txtExport.js # экспорт в TXT
│ │ ├── stores/ # контекст / сторы
│ │ ├── Test/
│ │ │ ├── sum.js
│ │ │ └── sum.test.js # тест Jest
│ │ ├── DataContext.jsx
│ │ ├── InputNum.jsx
│ │ └── ResultsBlock.jsx
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

Деплой проекта
Проект размещён на GitHub Pages (настроен скрипт npm run deploy).
Перейти к работающему приложению можно по ссылке:
https://a-hil.github.io/CourseWorkCalc/

Скриншоты интерфейса
#### Главный экран с формой ввода
<img width="928" height="721" alt="{0F2884CC-D294-4BCC-A055-AB8D493E0007}" src="https://github.com/user-attachments/assets/a4619403-bc51-46f9-bcb9-4ed3e8989ffe" />

#### Результаты рассчетов
<img width="695" height="781" alt="{EE871263-1CAB-4DC8-9B2D-F049A3E15B3B}" src="https://github.com/user-attachments/assets/2143a703-efa3-4392-9c52-34f023cd663f" />

### График 
<img width="698" height="343" alt="{5C6BD860-87C7-41CE-BE14-D5509A3E7DC7}" src="https://github.com/user-attachments/assets/7513a3b7-864d-4f6c-a37e-41f66a042680" />


Планы по развитию
Подключить и настроить React Compiler для оптимизации производительности.

Добавить поддержку TypeScript для повышения надежности кода,
подключит пару математических библеотек, 
ведрить нейросети и функции обработки формул по фото

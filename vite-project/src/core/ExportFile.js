export function exportToTxt(dan) {
    let content = '═══════════════════════════════════════\n';
    content += '     РЕЗУЛЬТАТЫ РАСЧЕТОВ (Вариант 28)\n';
    content += '═══════════════════════════════════════\n\n';

    content += `📊 ПАРАМЕТРЫ:\n`;
    content += `   Размерность m = ${dan.m}\n`;
    content += `   Переменная b = ${dan.b}\n`;
    content += `   Вариант: ${dan.isOdd ? 'нечетный' : 'четный'}\n`;
    content += `   s = ${dan.s.toFixed(4)}\n`;
    content += `   Диапазон A: [${dan.rangeMin}, ${dan.rangeMax}]\n\n`;

    content += `📈 МАТРИЦА A (${dan.m}×${dan.m}):\n`;
    content += `┌${'─'.repeat(dan.m * 12)}┐\n`;
    dan.A.forEach(row => {
        content += `│ ${row.map(v => v.toFixed(4).padStart(10)).join(' ')} │\n`;
    });
    content += `└${'─'.repeat(dan.m * 12)}┘\n\n`;

    content += `📊 МАССИВ C (${dan.isOdd ? 'Фибоначчи' : 'Арифметическая прогрессия'}):\n`;
    content += `   [${dan.C.map(v => v.toFixed(4)).join(', ')}]\n\n`;

    content += `🔢 МАССИВ X (по формуле варианта 28):\n`;
    content += `   Xi = (b + s)·Ci + Σ (A[i,k] + Ck) / (|A[i,k] - p| + 1)\n`;
    content += `   [${dan.X.map(v => v.toFixed(6)).join(', ')}]\n\n`;

    content += `📉 МАССИВ Y (интерполяция каноническим полиномом):\n`;
    content += `   Шаг интерполяции: 0.5\n`;
    content += `   Количество точек: ${dan.Y.length}\n`;
    content += `   [${dan.Y.map(v => v.toFixed(6)).join(', ')}]\n\n`;

    content += `📊 МАССИВ Y (ОТСОРТИРОВАННЫЙ - Шелл по возрастанию):\n`;
    content += `   [${dan.Ysorted.map(v => v.toFixed(6)).join(', ')}]\n\n`;

    content += `═══════════════════════════════════════\n`;
    content += `         КОНЕЦ РАСЧЕТОВ\n`;
    content += `═══════════════════════════════════════\n`;

    // Скачивание файла
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `variant28_results_${new Date().toISOString().slice(0,19)}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
}
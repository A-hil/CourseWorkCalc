import { saveAs } from 'file-saver';

export function exportToTxt(report) {
  let content = '';
  
  content += '=== ПАРАМЕТРЫ ===\n';
  content += `Дата расчета: ${new Date(report.generatedAt).toLocaleString()}\n\n`;
  
  // Проверяем parameters
  if (report.parameters && typeof report.parameters === 'object') {
    Object.entries(report.parameters).forEach(([key, value]) => {
      content += `${key}: ${JSON.stringify(value)}\n`;
    });
  } else {
    content += 'Нет данных о параметрах\n';
  }

  content += '\n=== ИСХОДНЫЙ МАССИВ X ===\n';
  if (report.results?.X && Array.isArray(report.results.X)) {
    report.results.X.forEach((val, i) => {
      content += `[${i}] ${val.toFixed(5)}\n`;
    });
  } else {
    content += 'Нет данных\n';
  }

  content += '\n=== ОТСОРТИРОВАННЫЙ Y ===\n';
  if (report.results?.Ysorted && Array.isArray(report.results.Ysorted)) {
    report.results.Ysorted.forEach((val, i) => {
      content += `[${i}] ${val.toFixed(5)}\n`;
    });
  } else {
    content += 'Нет данных\n';
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `results_${Date.now()}.txt`);
}
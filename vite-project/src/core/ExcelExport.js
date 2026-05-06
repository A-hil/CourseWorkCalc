import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportToExcel(report) {
  const workbook = new ExcelJS.Workbook();
  
  // Параметры (с проверкой)
  const paramsSheet = workbook.addWorksheet('Параметры');
  paramsSheet.columns = [
    { header: 'Параметр', key: 'key', width: 20 },
    { header: 'Значение', key: 'value', width: 30 }
  ];
  
  // Проверяем, что parameters существует и это объект
  if (report.parameters && typeof report.parameters === 'object') {
    Object.entries(report.parameters).forEach(([key, value]) => {
      paramsSheet.addRow({ key, value: JSON.stringify(value) });
    });
  } else {
    paramsSheet.addRow({ key: 'Статус', value: 'Нет данных о параметрах' });
  }

  // Исходный массив X
  const xSheet = workbook.addWorksheet('Массив X');
  xSheet.columns = [
    { header: 'Индекс', key: 'index', width: 10 },
    { header: 'Значение', key: 'value', width: 20 }
  ];
  
  // Проверяем, что X существует
  if (report.results?.X && Array.isArray(report.results.X)) {
    report.results.X.forEach((val, i) => {
      xSheet.addRow({ index: i, value: val.toFixed(5) });
    });
  }

  // Отсортированный Y
  const ySheet = workbook.addWorksheet('Массив Y (отсорт.)');
  ySheet.columns = [
    { header: 'Индекс', key: 'index', width: 10 },
    { header: 'Исходный Y', key: 'y', width: 20 },
    { header: 'Отсортированный Y', key: 'ySorted', width: 20 }
  ];
  
  // Проверяем, что Y существует
  if (report.results?.Y && Array.isArray(report.results.Y)) {
    report.results.Y.forEach((_, i) => {
      ySheet.addRow({
        index: i,
        y: report.results.Y[i]?.toFixed(5) || 'N/A',
        ySorted: report.results.Ysorted?.[i]?.toFixed(5) || 'N/A'
      });
    });
  }

  // Сохраняем
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `results_${Date.now()}.xlsx`);
}
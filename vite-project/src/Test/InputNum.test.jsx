// InputNum.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DataProvider } from '../stores/DataContext';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import InputNum from '../InputNum';

test('Кнопка "Контрольный пример" заполняет поля', () => {
  render(
    <MemoryRouter>
      <DataProvider>
        <InputNum />
      </DataProvider>
    </MemoryRouter>
  );

  const button = screen.getByRole('button', { name: /пример/i });
  fireEvent.click(button);

  // Проверяем, что поля больше не пустые (точные значения неизвестны)
  const mInput = screen.getByLabelText(/размерность A \(m\)/i);
  expect(mInput.value).not.toBe('');
  
  const bInput = screen.getByLabelText(/переменная b/i);
  expect(bInput.value).not.toBe('');
  
  const gInput = screen.getByLabelText(/шаг \(g\)/i);
  expect(gInput.value).not.toBe('');
});

test('изменение типа варианта показывает/скрывает поля арифм. прогрессии', async () => {
  render(
    <MemoryRouter>
      <DataProvider>
        <InputNum />
      </DataProvider>
    </MemoryRouter>
  );

  const select = document.getElementById('variant-select');
  
  // Сброс на Фибоначчи
  await userEvent.selectOptions(select, 'true');
  expect(select.value).toBe('true');
  
  // Поля арифм. прогрессии должны быть скрыты
  const c0Input = screen.getByLabelText(/C\[0\]/i);
  const rInput = screen.getByLabelText(/r \(разность прогрессии\)/i);
  
  // Проверяем, что родительский контейнер имеет класс opacity-0
  const container = c0Input.closest('.opacity-0');
  expect(container).not.toBeNull();
  
  // Переключаем на "Арифметическая прогрессия"
  await userEvent.selectOptions(select, 'false');
  expect(select.value).toBe('false');

  // Теперь контейнер не должен иметь opacity-0
  expect(c0Input.closest('.opacity-0')).toBeNull();
  expect(rInput.closest('.opacity-0')).toBeNull();

  // Можно также проверить, что поля доступны для ввода
  await userEvent.clear(c0Input);
  await userEvent.type(c0Input, '3.5');
  expect(c0Input.value).toBe('3.5');

  // Возврат обратно
  await userEvent.selectOptions(select, 'true');
  expect(select.value).toBe('true');
  expect(c0Input.closest('.opacity-0')).not.toBeNull();
});
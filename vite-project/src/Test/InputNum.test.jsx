// InputNum.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DataProvider } from '../stores/DataContext';
import InputNum from '../components/InputNum';

test('Кнопка "Контрольный пример" заполняет поля', () => {
  render(
    <DataProvider>
      <InputNum />
    </DataProvider>
  );

  // предположим, что кнопка называется "Контрольный пример"
  const button = screen.getByRole('button', { name: /Пример/i });
  fireEvent.click(button);

  // Проверяем поле "Размерность m" (должен быть label с htmlFor)
  const mInput = screen.getByLabelText(/размерность m/i);
  expect(mInput.value).toBe('3');

  // Аналогично для других полей...
});
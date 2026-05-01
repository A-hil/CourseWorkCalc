import { useAppData } from './stores/DataContext';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss';

export default function ResultsBlock() {
    const { appData } = useAppData(); // ← получаем данные
    const navigate = useNavigate();

    // Используем данные
    console.log(appData.formData);
    console.log(appData.matrixA);
    console.log(appData.vectorC);
    
    // Если данных нет, показать сообщение
    if (!appData.formData) {
        return (
            <div className="text-center p-8">
                <h2>Нет данных для отображения</h2>
                <button onClick={() => navigate('/')}>
                    Вернуться к вводу данных
                </button>
            </div>
        );
    }
    
    return (
        <div>
            <h1>Результаты расчетов</h1>
            <p>Размер матрицы: {appData.formData.m}</p>
            
            {/* Матрица A */}
            <h2>Матрица A:</h2>
            {appData.matrixA?.map((row, i) => (
                <div key={i}>
                    {row.map((val, j) => (
                        <span key={j}>{val} </span>
                    ))}
                </div>
            ))}
            
            {/* Вектор C */}
            <h2>Вектор C:</h2>
            {appData.vectorC?.map((val, i) => (
                <div key={i}>C[{i}] = {val}</div>
            ))}
        </div>
        
    );
}

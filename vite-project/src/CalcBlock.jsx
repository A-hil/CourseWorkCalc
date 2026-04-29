import {useReducer} from 'react'
import './App.css'



const CalcBlock = () => {
    
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    function counterReducer(state, action) {
        switch (action.type) {
            case 'INCREMENT':
            return { count: state.count + 1 };
            case 'DECREMENT':
            return { count: state.count - 1 };
            default:
            return state;
        }
        }

      return (
    <>
   <div className='w-full h-screen bg-linear-65 from-purple-500 to-pink-500 flex justify-center items-center'>
    {/* Сама карточка */}
    <div className='bg-white p-8 rounded-3xl shadow-2xl w-[450px]'>
        <div>
      <h1>{state.count}</h1>
      {/* Вызываем dispatch с нужным типом действия */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
    {/*Слздам простую стрелку возврата на компонент с ввоодом чисел */}
      <div className='mb-0 w-full h-min-20px'>
            <div>Вернуться к вводу чисел</div>
      </div>
    </div>
</div>
    </>
  )
}

export default CalcBlock;
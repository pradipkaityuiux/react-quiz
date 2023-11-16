import { useState, useReducer } from "react";

function reducer(state, action){
  // if(action.type == 'inc') return state + 1;
  // if(action.type == 'dec') return state - 1;
  // if(action.type == 'setCount') return action.payload;


  switch (action.type) {
    case 'inc': 
      return {...state, count: state.count + state.step}
      break;

    case 'dec':
      return {...state, count: state.count - state.step};
      break;

    case 'setCount':
      return {...state, count: action.payload};
      break;

    case 'setStep':
      return {...state, step: action.payload};
      break;

    case 'reset':
      return {count: 0, step: 1};
      break;

    default:
      throw new Error("No State Found")
      break;
  }
}

function DateCounter() {
  const initiialState = { count: 0, step: 1 };
  const [state, dispatch] = useReducer(reducer, initiialState);

  const {count, step} = state;

  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({type: 'dec'})
  };

  const inc = function () {
    dispatch({type: 'inc'})
  };

  const defineCount = function (e) {
    dispatch({type: 'setCount', payload: Number(e.target.value)})
  };

  const defineStep = function (e) {
    dispatch({type: 'setStep', payload: Number(e.target.value)})
  };

  const reset = function () {
    dispatch({type: 'reset'})
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;

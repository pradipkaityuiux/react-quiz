import React, { useReducer } from 'react'

const initialState = { count: 0, incQuantity: 1, decQuantity: 1 };

function reducer(state, action){
    switch(action.type){
        case 'increase':
            return {
                ...state,
                count: state.count + state.incQuantity,
            }
        case 'decrease':
            return {
                ...state,
                count: state.count - state.decQuantity
            }
        case 'incQuantity':
            return{
                ...state,
                incQuantity: action.payload
            }
        case 'decQuantity':
            return{
                ...state,
                decQuantity: action.payload
            }
        default:
            throw new Error("Unknown Action")
    }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, incQuantity, decQuantity } = state;
  return (
    <div>
        <select name="select" id="select" onChange={(e)=> dispatch({type: 'incQuantity', payload: Number(e.target.value) })}>
           {Array.from({length: 20}, (_, i)=> <option key={i} value={i+1}>{i+1}</option>)}
        </select>
        <button onClick={()=>dispatch({type: 'increase'})}>Increase</button>
        <span>{count}</span>
        <button onClick={()=>dispatch({type: 'decrease'})}>Decrease</button>
        <select name="decrease" id="decrease" onChange={(e)=> dispatch({type: 'decQuantity', payload: Number(e.target.value)})}>
            {Array.from({length: 20}, (_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
    </div>
  )
}

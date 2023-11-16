import React from 'react'

export default function Options({question, answer, dispatch}) {
  return (
    <div className='options'>
        {question.options.map((option, index) => <button key={option} className={`btn btn-option ${index === answer ? "answer" : ""} ${answer != null && (index===question.correctOption ? 'correct' : "wrong")}`} disabled={answer != null} onClick={()=>dispatch(index)}>{option}</button>)}
    </div>
  )
}

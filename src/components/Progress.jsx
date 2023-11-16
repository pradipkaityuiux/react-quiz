import React from 'react'

export default function Progress({numQuestions, qIndex, totalPoints, maxPoint, answer}) {
  return (
    <header className='progress'>
        <progress value={qIndex + Number(answer !== null)} max={numQuestions}> 32% </progress>
        <p>Progress <strong>{qIndex+1}</strong>/{numQuestions}</p>
        <p><strong>{totalPoints}</strong>/{maxPoint}</p>
    </header>
  )
}

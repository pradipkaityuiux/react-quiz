import React from 'react'

export default function StartScreen({numQuestions, startQuiz}) {
  return (
    <div className='start'>
        <h2>Welcome to the React Quiz.</h2>
        <h3>{numQuestions} questions to test your react Mastery.</h3>
        <button className='btn btn-ui' onClick={startQuiz}>Let's Start</button>
    </div>
  )
}

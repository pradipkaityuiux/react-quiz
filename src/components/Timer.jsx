import React, { useEffect } from 'react'

export default function Timer({timeRemaining, updateTimer}) {
    let min = Math.floor(timeRemaining / 60);
    let secs = timeRemaining % 60;
    useEffect(function(){
        const timerRemain = setInterval(() => {
            updateTimer()
        }, 1000);
        return () => clearInterval(timerRemain)
    }, [timeRemaining])
  return (
    <div className='timer'>
        {min < 10 ? '0' : null}{min}:
        {secs < 10 ? '0' : null}{secs}
    </div>
  )
}

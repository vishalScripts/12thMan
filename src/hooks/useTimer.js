import React, { useEffect, useState } from 'react';

const useTimer = ({mins=30}) => {

  
  const [timeLeft, setTimeLeft] = useState(mins * 60)

  useEffect(()=>{
    if (timeLeft <= 0 ) return;

    const interval = setInterval(()=>{
      setTimeLeft(prev => prev - 1)
    }, 10)

    return() => clearInterval(interval)
  },[timeLeft])

  const minutes = Math.floor(timeLeft / 60);

  return{minutes,timeLeft}
  
};

export default useTimer;
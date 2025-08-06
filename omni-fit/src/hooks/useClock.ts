import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const useClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    time: format(time, 'HH:mm:ss'),
    date: format(time, 'EEEE dd MMMM', { locale: fr }),
    fullDate: time,
  };
};

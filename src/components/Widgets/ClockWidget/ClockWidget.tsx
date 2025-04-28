import { useState, useEffect } from "react";

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Update date every minute
    const dateInterval = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dateInterval);
    };
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Format date as Day, Month Date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full w-full rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-lg p-4 flex flex-col justify-center items-center">
      <div className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight">
        {formatTime(time)}
      </div>
      <div className="text-sm sm:text-base text-white/70 mt-2">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default ClockWidget; 
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
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Format date as Day, Month Date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full w-full rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-center items-center">
      <div className="text-2xl sm:text-3xl font-medium text-white/95">
        {formatTime(time)}
      </div>
      <div className="text-xs sm:text-sm text-white/85 mt-1.5 font-medium">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default ClockWidget;

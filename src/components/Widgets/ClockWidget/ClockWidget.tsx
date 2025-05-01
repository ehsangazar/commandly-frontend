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
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-full w-full rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col">
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="text-4xl font-medium text-white tracking-wide">
          {formatTime(time)}
        </div>
        <div className="text-base text-white/70 mt-3 font-medium">
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;

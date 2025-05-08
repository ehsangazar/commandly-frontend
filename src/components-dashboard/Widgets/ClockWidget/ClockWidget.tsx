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

  // Get hours and minutes as two-digit strings
  const getHours = (date: Date) => date.getHours().toString().padStart(2, '0');
  const getMinutes = (date: Date) => date.getMinutes().toString().padStart(2, '0');

  // Get day of week (short) and date (e.g., May 4)
  const getDay = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" });
  const getMonthDay = (date: Date) => {
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className="h-full w-full rounded-xl bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col">
      {/* Content */}
      <div className="flex-1 p-6 flex items-center justify-center">
        {/* Time (left) */}
        <div className="flex flex-col items-end mr-4">
          <span className="text-5xl font-medium text-white leading-none">{getHours(time)}</span>
          <span className="text-5xl font-medium text-white leading-none mt-1">{getMinutes(time)}</span>
        </div>
        {/* Date (right) */}
        <div className="flex flex-col items-start ml-2">
          <span className="text-xl text-white/80 font-medium">{getDay(date)},</span>
          <span className="text-xl text-white/80 font-medium">{getMonthDay(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default ClockWidget;

import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";

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
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
            <FiClock className="h-5 w-5 text-[var(--commandly-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white/90">
              Current Time
            </h3>
            <p className="text-sm text-white/60">Local time and date</p>
          </div>
        </div>
      </div>

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

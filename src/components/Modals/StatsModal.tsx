import { createPortal } from "react-dom";
import {
  FiClock,
  FiGlobe,
  FiRefreshCw,
  FiX,
  FiExternalLink,
  FiBarChart2,
} from "react-icons/fi";
import {
  startOfDay,
  endOfWeek,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  intervalToDuration,
} from "date-fns";

interface DomainStats {
  domain: string;
  time: number;
}

interface TimeStats {
  daily: DomainStats[];
  weekly: DomainStats[];
  monthly: DomainStats[];
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TimeStats;
  activePeriod: "daily" | "weekly" | "monthly";
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const StatsModal = ({
  isOpen,
  onClose,
  stats,
  activePeriod,
  onPeriodChange,
  isLoading,
  onRefresh,
}: StatsModalProps) => {
  if (!isOpen) return null;

  const getPeriodDateRange = () => {
    const now = new Date();
    switch (activePeriod) {
      case "daily":
        return `${format(startOfDay(now), "MMM d, yyyy")}`;
      case "weekly":
        return `${format(startOfWeek(now), "MMM d")} - ${format(
          endOfWeek(now),
          "MMM d, yyyy"
        )}`;
      case "monthly":
        return `${format(startOfMonth(now), "MMM d")} - ${format(
          endOfMonth(now),
          "MMM d, yyyy"
        )}`;
    }
  };

  const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const { hours, minutes } = duration;
    return `${hours}h ${minutes}m`;
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl sm:h-[700px] z-50">
        <div className="h-full w-full rounded-2xl bg-black backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <FiGlobe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-white">
                    Browsing Statistics
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    {getPeriodDateRange()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50"
                  title="Refresh statistics"
                >
                  <FiRefreshCw
                    className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 rounded-lg bg-white/5 p-1">
              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    activePeriod === period
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => onPeriodChange(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {stats[activePeriod].map((item, index) => (
              <div
                key={item.domain}
                className="flex items-center justify-between rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium text-white shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm mb-0.5 truncate">
                      {item.domain}
                    </p>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <FiClock className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs">{formatTime(item.time)}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://${item.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 shrink-0 ml-2"
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}

            {stats[activePeriod].length === 0 && !isLoading && (
              <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <FiBarChart2 className="h-6 w-6" />
                </div>
                <p className="!text-sm">No browsing data available for this period</p>
                <p className="!text-xs text-white/40">Start browsing to see your statistics</p>
              </div>
            )}

            {isLoading && (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default StatsModal;

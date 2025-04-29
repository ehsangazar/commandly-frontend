import { createPortal } from "react-dom";
import {
  FiClock,
  FiGlobe,
  FiRefreshCw,
  FiX,
  FiExternalLink,
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
        <div className="h-full w-full rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                  <FiGlobe className="h-6 w-6 text-[var(--commandly-primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white/90">
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

            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePeriod === period
                      ? "bg-[var(--commandly-primary)] text-white shadow-lg shadow-[var(--commandly-primary)]/20"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => onPeriodChange(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {stats[activePeriod].map((item, index) => (
              <div
                key={item.domain}
                className="group flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center text-lg font-semibold text-[var(--commandly-primary)]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white/90 mb-1">
                      {item.domain}
                    </p>
                    <div className="flex items-center gap-2 text-white/60">
                      <FiClock className="h-4 w-4" />
                      <span>{formatTime(item.time)}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://${item.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 group-hover:translate-x-0 -translate-x-2 opacity-0 group-hover:opacity-100"
                >
                  <FiExternalLink className="w-5 h-5" />
                </a>
              </div>
            ))}

            {stats[activePeriod].length === 0 && !isLoading && (
              <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                  <FiGlobe className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium mb-1">No Data Available</p>
                  <p className="text-sm">
                    No browsing activity recorded for this period
                  </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="h-[300px] flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
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

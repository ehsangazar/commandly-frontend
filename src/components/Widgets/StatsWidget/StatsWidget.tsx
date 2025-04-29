import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FiClock,
  FiGlobe,
  FiAlertCircle,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  intervalToDuration,
} from "date-fns";
import StatsModal from "@/components/Modals/StatsModal";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface DomainStats {
  domain: string;
  time: number;
}

interface TimeStats {
  daily: DomainStats[];
  weekly: DomainStats[];
  monthly: DomainStats[];
}

const StatsWidget = () => {
  const [stats, setStats] = useState<TimeStats>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [activePeriod, setActivePeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const token = Cookies.get("commandly_token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const fetchPeriodStats = async (startDate: Date, endDate: Date) => {
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        const response = await fetch(
          `${API_BASE_URL}/domain-time/stats?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        if (data.success) {
          return data.stats.map(
            (item: { domain: string; totalTime: number }) => ({
              domain: item.domain,
              time: item.totalTime,
            })
          );
        }
        return [];
      };

      const [dailyStats, weeklyStats, monthlyStats] = await Promise.all([
        fetchPeriodStats(startOfDay(new Date()), endOfDay(new Date())),
        fetchPeriodStats(startOfWeek(new Date()), endOfWeek(new Date())),
        fetchPeriodStats(startOfMonth(new Date()), endOfMonth(new Date())),
      ]);

      setStats({
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      console.error("Failed to fetch domain time stats:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
  };

  const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const { hours, minutes } = duration;

    if (hours && hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      <div className="h-full w-full rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                <FiGlobe className="h-5 w-5 text-[var(--commandly-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">
                  Top Websites
                </h3>
                <p className="text-sm text-white/60">
                  Track your browsing activity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white transition-all duration-200 flex items-center gap-2 group shadow-lg shadow-[var(--commandly-primary)]/20"
                title="View detailed statistics"
              >
                <span className="text-sm font-medium">Details</span>
                <FiExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50"
                title="Refresh stats"
              >
                <FiRefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-1.5 rounded-lg bg-white/5 p-1.5">
            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <button
                key={period}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  activePeriod === period
                    ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setActivePeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-h-0 overflow-hidden">
          {error ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <FiAlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <p className="text-white/70">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-full pr-2">
              {stats[activePeriod].slice(0, 3).map((item, index) => (
                <button
                  key={item.domain}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center text-lg font-semibold text-[var(--commandly-primary)]">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white/90 text-base mb-1 truncate max-w-[150px] sm:max-w-[200px]">
                        {item.domain}
                      </p>
                      <div className="flex items-center gap-2 text-white/60">
                        <FiClock className="h-4 w-4" />
                        <span className="text-sm">{formatTime(item.time)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform group-hover:translate-x-0 -translate-x-2 text-white/60">
                    <FiExternalLink className="h-5 w-5" />
                  </div>
                </button>
              ))}
              {stats[activePeriod].length > 3 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-[var(--commandly-primary)]/20"
                >
                  <span>View All Statistics</span>
                  <FiExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
              {stats[activePeriod].length === 0 && !isLoading && (
                <div className="h-[200px] flex flex-col items-center justify-center text-white/50 gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <FiGlobe className="h-6 w-6" />
                  </div>
                  <p className="text-sm">No data available for this period</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <StatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stats={stats}
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
        isLoading={isLoading || isRefreshing}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default StatsWidget;

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiClock, FiGlobe, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  intervalToDuration,
} from "date-fns";

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
          return data.stats
            .slice(0, 3)
            .map((item: { domain: string; totalTime: number }) => ({
              domain: item.domain,
              time: item.totalTime,
            }));
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
    <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiGlobe className="h-5 w-5 text-[var(--commandly-primary)]" />
          <h3 className="text-lg font-semibold text-white/90">Top Websites</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50"
            title="Refresh stats"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <div className="flex gap-1 rounded-lg bg-white/5 p-1">
            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <button
                key={period}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  activePeriod === period
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setActivePeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex h-[calc(100%-4rem)] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center p-4">
            <FiAlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-white/70">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-sm transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex h-[calc(100%-4rem)] items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {stats[activePeriod].map((item, index) => (
            <div
              key={item.domain}
              className="flex items-center justify-between rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-3 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--commandly-primary)]/80 text-white backdrop-blur-sm text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white/90 text-sm md:text-base truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
                    {item.domain}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
                <FiClock className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/90 font-medium">
                  {formatTime(item.time)}
                </span>
              </div>
            </div>
          ))}
          {stats[activePeriod].length === 0 && !isLoading && (
            <div className="flex h-[calc(100%-4rem)] items-center justify-center text-white/50 text-sm">
              No data available for this period
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsWidget;

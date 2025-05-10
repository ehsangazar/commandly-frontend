import { useEffect, useState } from "react";
import {
  FiClock,
  FiGlobe,
  FiRefreshCw,
  FiExternalLink,
  FiBarChart2,
  FiAlertCircle,
} from "react-icons/fi";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { getAuthToken } from "@/utils/auth";

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

export default function BrowserStatistics() {
  const [stats, setStats] = useState<TimeStats>({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [activePeriod, setActivePeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getMaxTime = (period: "daily" | "weekly" | "monthly") => {
    return Math.max(...stats[period].map((item) => item.time));
  };

  const getBarWidth = (
    time: number,
    period: "daily" | "weekly" | "monthly"
  ) => {
    const maxTime = getMaxTime(period);
    return `${(time / maxTime) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
              <FiGlobe className="h-6 w-6 text-[var(--commandly-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white/90">
                Browser Statistics
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Track your browsing activity and time spent
              </p>
            </div>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-1 mb-6">
          {(["daily", "weekly", "monthly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activePeriod === period
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center">
              <FiAlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1 text-red-400">{error}</p>
              <p className="text-sm text-white/50">Please try again later</p>
            </div>
          </div>
        ) : stats[activePeriod].length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
              <FiBarChart2 className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1">No Data Available</p>
              <p className="text-sm text-white/50">
                Start browsing to see your statistics
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats[activePeriod].map((item, index) => (
              <div
                key={item.domain}
                className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white/90">
                        {item.domain}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/60">
                        <FiClock className="h-3.5 w-3.5" />
                        <span className="text-sm">{formatTime(item.time)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200">
                    <FiExternalLink className="h-4 w-4" />
                  </button>
                </div>
                {/* Bar Chart */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--commandly-primary)]/50 rounded-full transition-all duration-500"
                    style={{ width: getBarWidth(item.time, activePeriod) }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiClock, FiGlobe } from "react-icons/fi";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  intervalToDuration,
} from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

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
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("commandly_token");
        if (!token) return;

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
      } catch (err) {
        console.error("Failed to fetch domain time stats:", err);
      }
    };

    fetchStats();
  }, []);

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
          <h3 className="text-lg font-semibold text-white/90">
            Top Websites
          </h3>
        </div>
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {(["daily", "weekly", "monthly"] as const).map((period) => (
            <button
              key={period}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
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

      <div className="space-y-3">
        {stats[activePeriod].map((item, index) => (
          <div
            key={item.domain}
            className="flex items-center justify-between rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-3 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--commandly-primary)]/80 text-white backdrop-blur-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-white/90">
                  {item.domain}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70">
                {formatTime(item.time)}
              </span>
            </div>
          </div>
        ))}
        {stats[activePeriod].length === 0 && (
          <div className="flex h-24 items-center justify-center text-white/50">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsWidget;

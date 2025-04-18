import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  intervalToDuration,
} from "date-fns";
import { FiClock } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface DashboardStats {
  totalTime: number;
  topDomains: Array<{ domain: string; time: number }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatsWidget = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">(
    "today"
  );

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = Cookies.get("commandly_token");
        if (!token) return;

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (timeRange === "today") {
          startDate = startOfDay(new Date());
          endDate = endOfDay(new Date());
        } else if (timeRange === "week") {
          startDate = startOfWeek(new Date());
          endDate = endOfWeek(new Date());
        } else if (timeRange === "month") {
          startDate = startOfMonth(new Date());
          endDate = endOfMonth(new Date());
        }

        const params = new URLSearchParams({
          startDate: startDate?.toISOString() || "",
          endDate: endDate?.toISOString() || "",
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
          const sortedStats = {
            ...data.stats,
            topDomains: data.stats
              .slice(0, 10)
              .map((item: { domain: string; totalTime: number }) => ({
                domain: item.domain,
                time: item.totalTime,
              })),
            totalTime: data.totalTime,
          };
          setStats(sortedStats);
        }
      } catch (err) {
        console.error("Failed to fetch domain time stats:", err);
      }
    };

    fetchDashboardStats();
  }, [timeRange]);

  const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const { hours, minutes, seconds: secondsDuration } = duration;

    let formattedDuration = ``;
    if (hours && hours > 0) {
      formattedDuration += `${hours}h`;
    }
    if (minutes && minutes > 0) {
      formattedDuration += ` ${minutes}m`;
    }

    if (secondsDuration && secondsDuration > 0) {
      formattedDuration += ` ${secondsDuration}s`;
    }

    return formattedDuration;
  };

  return (
    <div className="rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
          Screen Time Statistics
        </h3>
        <div className="flex gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              timeRange === "today"
                ? "bg-[var(--commandly-primary)] text-white"
                : "text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-hover)]"
            }`}
            onClick={() => setTimeRange("today")}
          >
            Today
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              timeRange === "week"
                ? "bg-[var(--commandly-primary)] text-white"
                : "text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-hover)]"
            }`}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              timeRange === "month"
                ? "bg-[var(--commandly-primary)] text-white"
                : "text-[var(--commandly-text-secondary)] hover:bg-[var(--commandly-hover)]"
            }`}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-4">
          <div className="rounded-full bg-[var(--commandly-primary)] p-3">
            <FiClock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
              Total Time
            </h4>
            <p className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
              {formatTime(stats?.totalTime || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <h4 className="mb-4 text-sm font-medium text-[var(--commandly-text-secondary)]">
          Top Domains
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats?.topDomains || []}
              dataKey="time"
              nameKey="domain"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ domain, percent }) =>
                `${domain} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {(stats?.topDomains || []).map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatTime(value)}
              contentStyle={{
                backgroundColor: "var(--commandly-background)",
                border: "1px solid var(--commandly-border)",
                borderRadius: "0.375rem",
                color: "var(--commandly-text-primary)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsWidget;

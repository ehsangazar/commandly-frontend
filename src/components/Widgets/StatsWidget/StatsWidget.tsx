import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  intervalToDuration,
} from "date-fns";
import { FiClock, FiPieChart, FiTrendingUp, FiBarChart2 } from "react-icons/fi";
import ClipsWidget from "../ClipsWidget/ClipsWidget";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface DashboardStats {
  totalTime: number;
  topDomains: Array<{ domain: string; time: number }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatsWidget = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

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
          console.log(data);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-3 shadow-lg">
          <p className="font-medium text-[var(--commandly-text-primary)]">
            {payload[0].name}
          </p>
          <p className="text-sm text-[var(--commandly-text-secondary)]">
            Time: {formatTime(payload[0].value)}
          </p>
          <p className="text-sm text-[var(--commandly-text-secondary)]">
            {((payload[0].value / (stats?.totalTime || 1)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-6 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
            Screen Time Statistics
          </h3>
          <p className="mt-1 text-sm text-[var(--commandly-text-secondary)]">
            Track your browsing habits and productivity
          </p>
        </div>
        <div className="flex gap-2 rounded-lg bg-[var(--commandly-hover)] p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              timeRange === "today"
                ? "bg-white text-[var(--commandly-primary)] shadow-sm"
                : "text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
            }`}
            onClick={() => setTimeRange("today")}
          >
            Today
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              timeRange === "week"
                ? "bg-white text-[var(--commandly-primary)] shadow-sm"
                : "text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
            }`}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              timeRange === "month"
                ? "bg-white text-[var(--commandly-primary)] shadow-sm"
                : "text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
            }`}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-4 transition-all hover:border-[var(--commandly-primary)]">
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
        <div className="flex items-center gap-4 rounded-xl border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-4 transition-all hover:border-[var(--commandly-primary)]">
          <div className="rounded-full bg-[var(--commandly-primary)] p-3">
            <FiPieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
              Top Domain
            </h4>
            <p className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
              {stats?.topDomains[0]?.domain || "No data"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-4 transition-all hover:border-[var(--commandly-primary)]">
          <div className="rounded-full bg-[var(--commandly-primary)] p-3">
            <FiTrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
              Active Domains
            </h4>
            <p className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
              {stats?.topDomains.length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-medium text-[var(--commandly-text-primary)]">
            Domain Distribution
          </h4>
          <div className="flex gap-2 rounded-lg bg-[var(--commandly-hover)] p-1">
            <button
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                chartType === "pie"
                  ? "bg-white text-[var(--commandly-primary)] shadow-sm"
                  : "text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
              }`}
              onClick={() => setChartType("pie")}
            >
              <FiPieChart className="h-4 w-4" />
              Pie Chart
            </button>
            <button
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                chartType === "bar"
                  ? "bg-white text-[var(--commandly-primary)] shadow-sm"
                  : "text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
              }`}
              onClick={() => setChartType("bar")}
            >
              <FiBarChart2 className="h-4 w-4" />
              Bar Chart
            </button>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={stats?.topDomains || []}
                  dataKey="time"
                  nameKey="domain"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={60}
                  paddingAngle={2}
                  label={({ percent }) =>
                    percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {(stats?.topDomains || []).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-[var(--commandly-text-secondary)]">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            ) : (
              <BarChart
                data={stats?.topDomains || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis
                  dataKey="domain"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: "var(--commandly-text-secondary)", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "var(--commandly-text-secondary)", fontSize: 12 }}
                  tickFormatter={(value) => formatTime(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="time"
                  fill="var(--commandly-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;

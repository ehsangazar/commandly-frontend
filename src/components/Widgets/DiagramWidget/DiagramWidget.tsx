import { useState, useEffect } from "react";
import {
  FiBarChart2,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import Cookies from "js-cookie";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  intervalToDuration,
} from "date-fns";
import { Props as DefaultLegendContentProps } from "recharts/types/component/DefaultLegendContent";
import StatsModal from "@/components/Modals/StatsModal";

interface DomainStats {
  domain: string;
  time: number;
}

interface TimeStats {
  daily: DomainStats[];
  weekly: DomainStats[];
  monthly: DomainStats[];
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const COLORS = [
  "var(--commandly-primary)",
  "#10B981", // emerald-500
  "#6366F1", // indigo-500
  "#EC4899", // pink-500
  "#F59E0B", // amber-500
];

const DiagramWidget = () => {
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
          return data.stats
            .map((item: { domain: string; totalTime: number }) => ({
              domain: item.domain,
              time: item.totalTime,
            }))
            .sort((a: DomainStats, b: DomainStats) => b.time - a.time)
            .slice(0, 5);
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

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: DomainStats;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-xl p-3 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white/90 font-medium">{data.domain}</p>
          <div className="flex items-center gap-2 text-white/70 mt-1">
            <FiClock className="w-4 h-4" />
            <span className="text-sm">{formatTime(data.time)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.15 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="h-full w-full rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
              <FiBarChart2 className="h-5 w-5 text-[var(--commandly-primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/90">
                Usage Distribution
              </h3>
              <p className="text-sm text-white/60">Time spent per website</p>
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
        ) : stats[activePeriod].length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <FiBarChart2 className="h-6 w-6" />
              </div>
              <p className="text-sm">No data available for this period</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats[activePeriod]}
                    dataKey="time"
                    nameKey="domain"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {stats[activePeriod].map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={(props: DefaultLegendContentProps) => (
                      <div className="flex flex-wrap justify-center gap-2">
                        {props.payload?.map((_, index) => (
                          <div
                            key={`legend-${index}`}
                            className="flex items-center gap-1.5"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  props.payload?.[index]?.color || "",
                              }}
                            />
                            <span className="text-xs text-white/70 truncate max-w-[80px]">
                              {props.payload?.[index]?.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-white/5 p-2 ml-4">
              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  className={`w-24 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePeriod === period
                      ? "bg-[var(--commandly-primary)] text-white shadow-lg shadow-[var(--commandly-primary)]/20"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setActivePeriod(period);
                    handleRefresh();
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <StatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stats={stats}
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default DiagramWidget;

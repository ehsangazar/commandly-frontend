import { useState, useEffect } from "react";
import { FiBarChart2, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { getAuthToken } from "@/utils/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WebsiteStats {
  hostname: string;
  timeSpent: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const DiagramWidget = () => {
  const [stats, setStats] = useState<WebsiteStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(`${API_BASE_URL}/stats/${period}?limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      if (data.success) {
        // Sort by timeSpent in descending order
        const sortedStats = data.stats
          .sort((a: WebsiteStats, b: WebsiteStats) => b.timeSpent - a.timeSpent)
          .slice(0, 5); // Only take top 5 for better visualization
        setStats(sortedStats);
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: WebsiteStats;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-xl p-3 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white/90 font-medium">{data.hostname}</p>
          <p className="text-white/70 text-sm">{formatTime(data.timeSpent)}</p>
        </div>
      );
    }
    return null;
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
                Usage Chart
              </h3>
              <p className="text-sm text-white/60">
                Website usage visualization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as typeof period)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20 transition-all duration-200"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={fetchStats}
              disabled={loading || isRefreshing}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title="Refresh stats"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <FiAlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-white/70">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
          </div>
        ) : stats.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/50">
            <p>No data available</p>
          </div>
        ) : (
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
              >
                <XAxis
                  dataKey="hostname"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  tickFormatter={(value) => `${Math.floor(value / 60)}h`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="timeSpent"
                  fill="var(--commandly-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagramWidget;

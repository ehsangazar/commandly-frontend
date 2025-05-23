import { useEffect, useState } from "react";
import {
  FiClock,
  FiGlobe,
  FiRefreshCw,
  FiExternalLink,
  FiBarChart2,
  FiMaximize,
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
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface DomainStats {
  domain: string;
  time: number;
}

const StatsWidget = () => {
  const [stats, setStats] = useState<DomainStats[]>([]);
  const [activePeriod, setActivePeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async (period: "daily" | "weekly" | "monthly") => {
    setLoading(true);
    try {
      const token = getAuthToken();
      let startDate: Date, endDate: Date;
      if (period === "daily") {
        startDate = startOfDay(new Date());
        endDate = endOfDay(new Date());
      } else if (period === "weekly") {
        startDate = startOfWeek(new Date());
        endDate = endOfWeek(new Date());
      } else {
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
      }
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
        setStats(
          data.stats.map((item: { domain: string; totalTime: number }) => ({
            domain: item.domain,
            time: item.totalTime,
          }))
        );
      } else {
        setStats([]);
      }
    } catch (err) {
      console.error("Failed to fetch domain time stats:", err);
      setStats([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(activePeriod);
  }, [activePeriod]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats(activePeriod);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getMaxTime = () => {
    return Math.max(1, ...stats.map((item) => item.time));
  };

  const getBarWidth = (time: number) => {
    const maxTime = getMaxTime();
    return `${(time / maxTime) * 100}%`;
  };

  return (
    <div className="bg-black/90 backdrop-blur-4xl border border-white/10 shadow-lg h-full w-full rounded-xl flex flex-col">
      {/* Top Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-start justify-center">
              <FiGlobe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="!text-lg font-medium text-white -mt-1">
                Top Websites
              </h3>
              <p className="!text-xs text-white/60">
                Track your browsing activity
              </p>
            </div>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigate("/dashboard.html?browser-statistics=true");
              }}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-sm font-medium">Details</span>
              <FiMaximize className="h-4 w-4" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${
                  isRefreshing || loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="mt-4 flex gap-1 rounded-lg bg-white/5 p-1">
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

      {/* Data Display */}
      <div className="flex-1 py-2 px-4 overflow-y-auto custom-scrollbar my-2">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-white/50 gap-2 animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <FiRefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <p className="!text-sm">Loading statistics...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/50 gap-1 animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <FiBarChart2 className="h-6 w-6" />
            </div>
            <p className="!text-sm">
              No browsing data available for this period
            </p>
            <p className="!text-xs text-white/40">
              Start browsing to see your statistics
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {stats.map((item, index) => (
              <div
                key={item.domain}
                className="flex items-center justify-between rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition-all duration-200"
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
                    {/* Bar Chart */}
                    <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/20 rounded-full transition-all duration-500"
                        style={{ width: getBarWidth(item.time) }}
                      />
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 shrink-0 ml-2">
                  <FiExternalLink className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsWidget;

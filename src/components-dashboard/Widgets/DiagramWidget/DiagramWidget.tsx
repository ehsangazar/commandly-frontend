import { analyseContextToJSON } from "@/utils/analyseContextToJSON";
import { getAuthToken } from "@/utils/auth";
import { getPlans } from "@/utils/fetchPlanes";
import { Plan } from "@/utils/fetchPlanes";
import { handleCheckout } from "@/utils/handleCheckout";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  FiRefreshCw,
  FiBarChart2,
  FiSettings,
  FiX,
  FiPlus,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface TimeStats {
  yesterday: { domain: string; time: number }[];
  weekly: { domain: string; time: number }[];
  monthly: { domain: string; time: number }[];
}

const DiagramWidget = () => {
  const [activePeriod, setActivePeriod] = useState<
    "yesterday" | "weekly" | "monthly"
  >("yesterday");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "Work",
    "Social",
    "Entertainment",
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [stats, setStats] = useState<TimeStats>({
    yesterday: [],
    weekly: [],
    monthly: [],
  });
  const [analysisData, setAnalysisData] = useState<Record<
    string,
    number
  > | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const today = new Date();
  const yesterdayStartDate = format(
    startOfDay(subDays(today, 1)),
    "yyyy-MM-dd"
  );
  const yesterdayEndDate = format(endOfDay(subDays(today, 1)), "yyyy-MM-dd");

  const weeklyStartDate = format(startOfWeek(today), "yyyy-MM-dd");
  const weeklyEndDate = format(endOfWeek(today), "yyyy-MM-dd");

  const monthlyStartDate = format(startOfMonth(today), "yyyy-MM-dd");
  const monthlyEndDate = format(endOfMonth(today), "yyyy-MM-dd");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setStatsError(null);
    setAnalysisError(null);
    fetchStats();
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const analyse = useCallback(async () => {
    setAnalysisError(null);
    setAnalysisLoading(true);
    if (stats[activePeriod].length === 0) {
      setAnalysisData(null);
      setAnalysisLoading(false);
      return;
    }
    try {
      // Clean up old cache entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("diagram-widget-analysis-")) {
          const parts = key.split("|");
          const startDateStr = parts[1];
          const endDateStr = parts[2];
          if (key.includes("-yesterday-")) {
            const startDateDay = startDateStr;
            const endDateDay = endDateStr;
            if (
              startDateDay !== yesterdayStartDate ||
              endDateDay !== yesterdayEndDate
            ) {
              localStorage.removeItem(key);
            }
          } else {
            // For other periods, keep if today is within the date range (inclusive)
            const start = new Date(startDateStr);
            const end = new Date(endDateStr);
            const todayDate = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            if (todayDate < start || todayDate > end) {
              localStorage.removeItem(key);
            }
          }
        }
      }
      // Cache for every period, category, and date range
      let startDate: string, endDate: string;
      if (activePeriod === "yesterday") {
        startDate = yesterdayStartDate;
        endDate = yesterdayEndDate;
      } else if (activePeriod === "weekly") {
        startDate = weeklyStartDate;
        endDate = weeklyEndDate;
      } else {
        startDate = monthlyStartDate;
        endDate = monthlyEndDate;
      }
      const categoriesKey = categories.join(",");
      const cacheKey = `diagram-widget-analysis-${activePeriod}-${categoriesKey}|${startDate}|${endDate}`;
      // Always check cache for all periods, including yesterday
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setAnalysisData(JSON.parse(cached));
        setAnalysisLoading(false);
        return;
      }
      const result = await analyseContextToJSON({
        prompt: `
          1. Analyze each domain in the input and categorize it
          2. If a record is not in any category, choose the most appropriate one
          3. Every number is in seconds, Calculate total time spent in each category in seconds
          4. Make sure each record is only in one category and not in multiple
        `,
        context: JSON.stringify(stats[activePeriod]),
        format: JSON.stringify(
          categories.map((category) => ({
            [category]: "SUM_OF_MINUTES",
          }))
        ),
      });
      setAnalysisData(result.analysis);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(result.analysis));
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Daily request limit exceeded"
      ) {
        setAnalysisError("limit");
      } else {
        setAnalysisError("Failed to analyze data. Please try again later.");
      }
      setAnalysisData(null);
    } finally {
      setAnalysisLoading(false);
    }
  }, [activePeriod, stats, categories]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const token = getAuthToken();
      let startDate: Date, endDate: Date;
      if (activePeriod === "yesterday") {
        startDate = startOfDay(subDays(new Date(), 1));
        endDate = endOfDay(subDays(new Date(), 1));
      } else if (activePeriod === "weekly") {
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
        const newStats = data.stats.map(
          (item: { domain: string; totalTime: number }) => ({
            domain: item.domain,
            time: item.totalTime,
          })
        );
        setStats((prev) => ({
          ...prev,
          [activePeriod]: newStats,
        }));
      } else {
        setStats((prev) => ({ ...prev, [activePeriod]: [] }));
        setStatsError("No data available for this period.");
      }
    } catch {
      setStats((prev) => ({ ...prev, [activePeriod]: [] }));
      setStatsError("Failed to fetch stats. Please try again later.");
    } finally {
      setStatsLoading(false);
      setIsRefreshing(false);
    }
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active: boolean;
    payload: Array<{ payload: { category: string }; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl p-3 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white/90 font-medium">
            {payload[0].payload.category}
          </p>
          <p className="text-white/70 text-sm">
            {formatTime(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod]);

  useEffect(() => {
    analyse();
  }, [activePeriod, stats, categories, analyse]);

  const data =
    analysisData &&
    Object.keys(analysisData).length > 0 &&
    categories.length > 0
      ? Object.entries(analysisData).map(([category, time]) => ({
          category,
          time: Number(time),
        }))
      : [];

  const handleUpgrade = async () => {
    const { plans } = await getPlans();
    const paidPlan = plans.find((p: Plan) => p.price > 0);
    if (paidPlan) {
      await handleCheckout(paidPlan.id);
    }
  };

  return (
    <div className="h-full w-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="w-6 h-6 text-white" />
          <span className="!text-lg font-medium text-white">
            Usage by Category
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 disabled:opacity-50"
            disabled={statsLoading || analysisLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${
                isRefreshing || statsLoading || analysisLoading
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isSettingsOpen
                ? "bg-white/20 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            disabled={statsLoading || analysisLoading}
          >
            <FiSettings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Chart View */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isSettingsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Period Selector */}
            <div className="px-4 py-2 flex gap-2">
              {(["yesterday", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activePeriod === period
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/70 hover:bg-white/5"
                  }`}
                  disabled={statsLoading || analysisLoading}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 p-4">
              {statsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white/60">
                    <FiRefreshCw className="w-8 h-8 animate-spin" />
                    <span>Loading statistics...</span>
                  </div>
                </div>
              ) : statsError ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-red-400">
                    <p>{statsError}</p>
                  </div>
                </div>
              ) : analysisLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white/60">
                    <FiRefreshCw className="w-8 h-8 animate-spin" />
                    <span>Analyzing data...</span>
                  </div>
                </div>
              ) : analysisError === "limit" ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-2 animate-fade-in">
                    <span className="text-4xl">🚫</span>
                    <p className="text-white/80 mb-1 text-base font-semibold">
                      You've reached your daily analysis limit
                    </p>
                    <p className="text-white/50 text-sm max-w-xs">
                      Upgrade your plan to unlock more daily analyses and
                      insights.
                    </p>
                    <button
                      onClick={handleUpgrade}
                      className="cursor-pointer mt-2 inline-block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-200"
                    >
                      Upgrade Now
                    </button>{" "}
                    {/* TODO: Implement real upgrade logic */}
                  </div>
                </div>
              ) : analysisError ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-red-400">
                    <p>{analysisError}</p>
                  </div>
                </div>
              ) : data?.length > 0 && categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="category"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                      tickFormatter={(value) => formatTime(value)}
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(dataMax * 1.15),
                      ]}
                    />
                    <Tooltip
                      content={<CustomTooltip active={true} payload={[]} />}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: "#8884d8", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#8884d8" }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-2 animate-fade-in">
                    <FiBarChart2 className="w-10 h-10 text-white/30 animate-pulse" />
                    <p className="text-white/70 mb-1 text-base font-medium">
                      No data available yet for this period
                    </p>
                    <p className="text-white/40 text-sm max-w-xs">
                      Please be patient as your activity is being collected.
                      Come back later to see your usage by category.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings View */}
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isSettingsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-full p-4">
            <div className="max-w-2xl mx-auto">
              {/* Settings Content */}
              <div className="space-y-6 h-full">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new category..."
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 text-sm"
                    disabled={statsLoading || analysisLoading}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex items-center gap-1.5 text-sm"
                    disabled={statsLoading || analysisLoading}
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5"
                      >
                        <span className="text-white/70">{category}</span>
                        <button
                          onClick={() => handleRemoveCategory(category)}
                          className="p-1 rounded hover:bg-white/10 transition-all duration-200"
                          disabled={statsLoading || analysisLoading}
                        >
                          <FiX className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white/50 text-sm">
                      No categories added yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramWidget;

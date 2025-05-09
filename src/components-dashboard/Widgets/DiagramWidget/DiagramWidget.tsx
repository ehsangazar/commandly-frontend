import { useState } from "react";
import { FiRefreshCw, FiBarChart2, FiSettings, FiX, FiPlus } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data generator
const generateMockData = (categories: string[], period: "daily" | "weekly" | "monthly") => {
  const multiplier = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
  return categories.map(category => ({
    category,
    time: Math.floor(Math.random() * 180 + 30) * multiplier // Random time between 30-210 minutes
  }));
};

const DiagramWidget = () => {
  const [activePeriod, setActivePeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Work", "Social", "Entertainment"]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl p-3 rounded-lg border border-white/10 shadow-xl">
          <p className="text-white/90 font-medium">{payload[0].payload.category}</p>
          <p className="text-white/70 text-sm">{formatTime(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const currentData = generateMockData(categories, activePeriod);

  return (
    <div className="h-full w-full bg-black rounded-xl overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="w-6 h-6 text-white" />
          <span className="!text-lg font-medium text-white">Usage by Category</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isSettingsOpen 
                ? "bg-white/20 text-white" 
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <FiSettings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Chart View */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          isSettingsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <div className="h-full flex flex-col">
            {/* Period Selector */}
            <div className="px-4 py-2 flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePeriod === period
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 p-4">
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="category"
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                      tickFormatter={(value) => formatTime(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
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
                  <div className="text-center">
                    <p className="text-white/70 mb-2">No categories selected</p>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 text-sm"
                    >
                      Add Categories
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings View */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          isSettingsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
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
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex items-center gap-1.5 text-sm"
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
                        >
                          <FiX className="w-4 h-4 text-white/50" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white/50 text-sm">No categories added yet</p>
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
import { useEffect, useState } from "react";
import styles from "./StatsWidget.module.css";
import Cookies from "js-cookie";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

        const response = await fetch(
          `${API_BASE_URL}/domain-time/stats?timeRange=${timeRange}`,
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

  const formatTime = (time: number) => {
    return `${Math.round(time / 60)}m`;
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3>Screen Time Statistics</h3>
        <div className={styles.timeRangeControls}>
          <button
            className={`${styles.timeRangeButton} ${
              timeRange === "today" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("today")}
          >
            Today
          </button>
          <button
            className={`${styles.timeRangeButton} ${
              timeRange === "week" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
          <button
            className={`${styles.timeRangeButton} ${
              timeRange === "month" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Total Time</h4>
          <p className={styles.statValue}>
            {`${Math.round((stats?.totalTime || 0) / 60)} minutes`}
          </p>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h4>Top Domains</h4>
          <div className={styles.chartContainer}>
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
                  {(stats?.topDomains || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={formatTime} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;

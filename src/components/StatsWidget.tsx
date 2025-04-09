import { useState, useEffect } from "react";
import styles from "../styles/StatsWidget.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface StatsData {
  domain: string;
  totalTime: number;
  entries: number;
}

interface StatsWidgetProps {
  className?: string;
}

const StatsWidget = ({ className }: StatsWidgetProps) => {
  const [stats, setStats] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    domain: "",
    sortBy: "time" as "time" | "entries",
    sortOrder: "desc" as "asc" | "desc",
  });

  const [todayStats, setTodayStats] = useState<StatsData[]>([]);
  const [weekStats, setWeekStats] = useState<StatsData[]>([]);

  const getTodayRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const getWeekRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const fetchStats = async (
    startDate: Date,
    endDate: Date,
    setStatsFn: (data: StatsData[]) => void
  ) => {
    try {
      const token = Cookies.get("commandly_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const queryParams = new URLSearchParams();

      // Only add parameters if they have values
      if (startDate) {
        queryParams.append("startDate", startDate.toISOString());
      }
      if (endDate) {
        queryParams.append("endDate", endDate.toISOString());
      }
      if (filters.domain) {
        queryParams.append("domain", filters.domain);
      }
      if (filters.sortBy) {
        queryParams.append("sortBy", filters.sortBy);
      }
      if (filters.sortOrder) {
        queryParams.append("sortOrder", filters.sortOrder);
      }

      const response = await fetch(
        `${API_BASE_URL}/domain-time/stats?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setStatsFn(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    }
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true);
      const todayRange = getTodayRange();
      const weekRange = getWeekRange();

      await Promise.all([
        fetchStats(todayRange.start, todayRange.end, setTodayStats),
        fetchStats(weekRange.start, weekRange.end, setWeekStats),
        filters.startDate && filters.endDate
          ? fetchStats(
              new Date(filters.startDate),
              new Date(filters.endDate),
              setStats
            )
          : Promise.resolve(),
      ]);
      setLoading(false);
    };

    fetchAllStats();
  }, [filters]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const renderStatsTable = (data: StatsData[], title: string) => (
    <div className={styles.statsSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.statsContainer}>
        <table className={styles.statsTable}>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Time Spent</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stat) => (
              <tr key={stat.domain}>
                <td>{stat.domain}</td>
                <td>{formatTime(stat.totalTime)}</td>
                <td>{stat.entries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`${styles.widget} ${className || ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Domain Statistics</h2>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="datetime-local"
              id="startDate"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="datetime-local"
              id="endDate"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="domain">Domain</label>
            <input
              type="text"
              id="domain"
              placeholder="Filter by domain"
              value={filters.domain}
              onChange={(e) =>
                setFilters({ ...filters, domain: e.target.value })
              }
            />
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="sortBy">Sort By</label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as "time" | "entries",
                })
              }
            >
              <option value="time">Time Spent</option>
              <option value="entries">Number of Entries</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label htmlFor="sortOrder">Order</label>
            <select
              id="sortOrder"
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortOrder: e.target.value as "asc" | "desc",
                })
              }
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading statistics...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.statsSections}>
          {renderStatsTable(todayStats, "Today's Statistics")}
          {renderStatsTable(weekStats, "This Week's Statistics")}
          {filters.startDate &&
            filters.endDate &&
            renderStatsTable(stats, "Custom Range Statistics")}
        </div>
      )}
    </div>
  );
};

export default StatsWidget;

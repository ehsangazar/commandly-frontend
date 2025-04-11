import { useEffect, useState } from "react";
import styles from "./ScreenTime.module.css";
import Cookies from "js-cookie";
import {
  startOfDay,
  endOfDay,
  parseISO,
  format,
  intervalToDuration,
} from "date-fns";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface ScreenTimeEntry {
  domain: string;
  totalTime: number;
  entries: number;
}

interface Filters {
  startDate: string;
  endDate: string;
  domain: string;
  minTime: number;
}

const ScreenTime = () => {
  const [entries, setEntries] = useState<ScreenTimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    startDate: startOfDay(new Date()).toISOString(),
    endDate: endOfDay(new Date()).toISOString(),
    domain: "",
    minTime: 0,
  });

  useEffect(() => {
    const fetchScreenTime = async () => {
      try {
        const token = Cookies.get("commandly_token");
        if (!token) return;

        const queryParams = new URLSearchParams({
          startDate: filters.startDate,
          endDate: filters.endDate,
          ...(filters.domain && { domain: filters.domain }),
          ...(filters.minTime > 0 && { minTime: filters.minTime.toString() }),
        }).toString();

        const response = await fetch(
          `${API_BASE_URL}/domain-time/stats?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setEntries(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch screen time entries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenTime();
  }, [filters]);

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

  const handleDateChange = (
    key: "startDate" | "endDate",
    dateString: string
  ) => {
    setLoading(true);
    const date = new Date(dateString);
    const isoString =
      key === "startDate"
        ? startOfDay(date).toISOString()
        : endOfDay(date).toISOString();
    setFilters((prev) => ({ ...prev, [key]: isoString }));
  };

  const handleFilterChange = (
    key: "domain" | "minTime",
    value: string | number
  ) => {
    setLoading(true);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.screenTime}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={format(parseISO(filters.startDate), "yyyy-MM-dd")}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={format(parseISO(filters.endDate), "yyyy-MM-dd")}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="domain">Domain</label>
          <input
            type="text"
            id="domain"
            placeholder="Filter by domain..."
            value={filters.domain}
            onChange={(e) => handleFilterChange("domain", e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="minTime">Min Time (minutes)</label>
          <input
            type="number"
            id="minTime"
            min="0"
            value={filters.minTime}
            onChange={(e) =>
              handleFilterChange("minTime", parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading screen time data...</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Total Time</th>
                  <th>Number of Entries</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.domain}</td>
                    <td>{formatTime(entry.totalTime)}</td>
                    <td>{entry.entries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entries.length === 0 && (
              <div className={styles.noData}>
                No screen time data found for the selected filters
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScreenTime;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../../utils/auth";
import {
  startOfDay,
  endOfDay,
  parseISO,
  format,
  intervalToDuration,
} from "date-fns";
import { FiFilter, FiClock, FiHash } from "react-icons/fi";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScreenTime = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate("/login");
          return;
        }

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
  }, [filters, navigate]);

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
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[var(--commandly-hover)] rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[var(--commandly-text-primary)]">
          <FiFilter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]"
              value={format(parseISO(filters.startDate), "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]"
              value={format(parseISO(filters.endDate), "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
            >
              Domain
            </label>
            <input
              type="text"
              id="domain"
              placeholder="Filter by domain..."
              className="w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]"
              value={filters.domain}
              onChange={(e) => handleFilterChange("domain", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="minTime"
              className="block text-sm font-medium text-[var(--commandly-text-secondary)]"
            >
              Min Time (minutes)
            </label>
            <input
              type="number"
              id="minTime"
              min="0"
              className="w-full rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-3 py-2 text-[var(--commandly-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]"
              value={filters.minTime}
              onChange={(e) =>
                handleFilterChange("minTime", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--commandly-hover)] rounded-lg p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-6 text-[var(--commandly-text-secondary)]">
            Loading screen time data...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--commandly-border)]">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--commandly-text-secondary)]">
                      Domain
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--commandly-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        <span>Total Time</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--commandly-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <FiHash className="w-4 h-4" />
                        <span>Entries</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--commandly-border)]">
                  {entries.map((entry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[var(--commandly-background)]"
                    >
                      <td className="px-4 py-3 text-[var(--commandly-text-primary)]">
                        {entry.domain}
                      </td>
                      <td className="px-4 py-3 text-[var(--commandly-text-primary)]">
                        {formatTime(entry.totalTime)}
                      </td>
                      <td className="px-4 py-3 text-[var(--commandly-text-primary)]">
                        {entry.entries}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {entries.length === 0 && (
              <div className="text-center py-8 text-[var(--commandly-text-secondary)]">
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

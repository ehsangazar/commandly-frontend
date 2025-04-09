import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsWidget from "../../../components/Widgets/StatsWidget/StatsWidget";
import Cookies from "js-cookie";
import styles from "./Dashboard.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("commandly_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
        if (
          err instanceof Error &&
          (err.message.includes("Unauthorized") ||
            err.message.includes("No authentication token"))
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading your dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.widgetsContainer}>
        <StatsWidget />
      </div>
    </div>
  );
};

export default Dashboard;

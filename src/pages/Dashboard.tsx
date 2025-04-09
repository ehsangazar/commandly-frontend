import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/Dashboard.module.css";
import StatsWidget from "../components/StatsWidget";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

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

        setUser(data.user);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
        // Redirect to login if unauthorized
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

  const handleLogout = () => {
    Cookies.remove("commandly_token", { path: "/" });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={styles.container} data-theme={theme}>
        <div className={styles.loading}>Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} data-theme={theme}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.welcome}>Welcome, {user?.email}!</h1>
            <p className={styles.info}>
              You joined Commandly on{" "}
              {new Date(user?.createdAt || "").toLocaleDateString()}
              {user?.isVerified
                ? " and your account is verified."
                : " but your account is not yet verified."}
            </p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        <StatsWidget />
      </div>
    </div>
  );
};

export default Dashboard;

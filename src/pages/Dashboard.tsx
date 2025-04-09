import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/Dashboard.module.css";
import StatsWidget from "../components/widgets/StatsWidget";
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
  const location = useLocation();
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

  const handleNavigation = (path: string) => {
    navigate(path);
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
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Commandly</h1>
        </div>
        <nav className={styles.nav}>
          <div
            className={`${styles.navItem} ${
              location.pathname === "/dashboard" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("/dashboard")}
          >
            <span className={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </div>
          <div
            className={`${styles.navItem} ${
              location.pathname === "/dashboard/screen-time"
                ? styles.active
                : ""
            }`}
            onClick={() => handleNavigation("/dashboard/screen-time")}
          >
            <span className={styles.navIcon}>⏱️</span>
            <span>Screen Time</span>
          </div>
        </nav>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.email.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userEmail}>{user?.email}</span>
              <span className={styles.userStatus}>
                {user?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {location.pathname === "/dashboard" ? (
          <div className={styles.dashboardContent}>
            <header className={styles.mainHeader}>
              <h2>Dashboard Overview</h2>
            </header>
            <div className={styles.widgetsContainer}>
              <StatsWidget />
              {/* Add more widgets here */}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

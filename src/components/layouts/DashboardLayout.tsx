import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import styles from "./DashboardLayout.module.css";
import Cookies from "js-cookie";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const handleLogout = () => {
    Cookies.remove("commandly_token", { path: "/" });
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div data-theme={theme}>
      <div className={styles.dashboardLayout}>
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
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

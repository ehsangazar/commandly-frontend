import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import styles from "./DashboardLayout.module.css";
import Cookies from "js-cookie";

interface DashboardLayoutProps {
  title?: string;
}

const DashboardLayout = ({ title }: DashboardLayoutProps) => {
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
            <a href="/">
              <h1 className={styles.logo}>Commandly</h1>
            </a>
          </div>
          <nav className={styles.nav}>
            <div
              className={`${styles.navItem} ${
                location.pathname === "/dashboard" ? styles.active : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <span className={styles.navIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </span>
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
              <span className={styles.navIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <span>Screen Time</span>
            </div>
            <div
              className={`${styles.navItem} ${
                location.pathname === "/dashboard/clips" ? styles.active : ""
              }`}
              onClick={() => handleNavigation("/dashboard/clips")}
            >
              <span className={styles.navIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 7h8" />
                  <path d="M8 11h4" />
                  <path d="M16 15h-4" />
                  <path d="M16 11l2 2-2 2" />
                </svg>
              </span>
              <span>Clips</span>
            </div>
          </nav>
          <div className={styles.userSection}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <span className={styles.navIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {title && (
              <div className={styles.contentHeader}>
                <h2>{title}</h2>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

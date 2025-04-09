import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Header.module.css";
import Cookies from "js-cookie";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const token = Cookies.get("commandly_token");

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Commandly
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.link} ${isActive("/") ? styles.active : ""}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${styles.link} ${
              isActive("/about") ? styles.active : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/pricing"
            className={`${styles.link} ${
              isActive("/pricing") ? styles.active : ""
            }`}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className={`${styles.link} ${
              isActive("/contact") ? styles.active : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {token ? (
            <Link to="/dashboard" className={styles.dashboardButton}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

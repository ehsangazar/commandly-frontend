import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { getAuthToken } from "@/utils/auth";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const token = getAuthToken();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[var(--commandly-background)] border-b border-[var(--commandly-border)] shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-[var(--commandly-text-primary)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
          >
            Commandly
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] transition-colors duration-200 ${
                isActive("/")
                  ? "text-[var(--commandly-primary)] font-medium"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] transition-colors duration-200 ${
                isActive("/about")
                  ? "text-[var(--commandly-primary)] font-medium"
                  : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className={`text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] transition-colors duration-200 ${
                isActive("/pricing")
                  ? "text-[var(--commandly-primary)] font-medium"
                  : ""
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className={`text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] transition-colors duration-200 ${
                isActive("/contact")
                  ? "text-[var(--commandly-primary)] font-medium"
                  : ""
              }`}
            >
              Contact
            </Link>
            <Link
              to="/careers"
              className={`text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] transition-colors duration-200 ${
                isActive("/careers")
                  ? "text-[var(--commandly-primary)] font-medium"
                  : ""
              }`}
            >
              Careers
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <span className="text-[var(--commandly-text-secondary)] text-xl">
                  🌙
                </span>
              ) : (
                <span className="text-yellow-400 text-xl">☀️</span>
              )}
            </button>

            {token ? (
              <Link
                to="/dashboard"
                className="bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

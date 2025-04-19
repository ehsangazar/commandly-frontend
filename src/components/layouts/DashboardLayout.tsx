import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { FiHome, FiClock, FiScissors, FiLogOut } from "react-icons/fi";
import Header from "../Header/Header";
import { getAuthToken } from "@/utils/auth";

interface DashboardLayoutProps {
  title?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const DashboardLayout = ({ title }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error("Invalid token");
        }
      } catch (err) {
        console.error("Failed to validate token:", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("commandly_token", { path: "/" });
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <Header />

      {/* Navigation Bar */}
      <div className="bg-[var(--commandly-hover)] border-b border-[var(--commandly-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="flex items-center space-x-2 text-[var(--commandly-text-primary)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
              >
                <FiHome className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation("/dashboard/screen-time")}
                className="flex items-center space-x-2 text-[var(--commandly-text-primary)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
              >
                <FiClock className="w-5 h-5" />
                <span>Screen Time</span>
              </button>
              <button
                onClick={() => handleNavigation("/dashboard/clips")}
                className="flex items-center space-x-2 text-[var(--commandly-text-primary)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
              >
                <FiScissors className="w-5 h-5" />
                <span>Clips</span>
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-[var(--commandly-text-primary)] hover:text-[var(--commandly-primary)] transition-colors duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-6">
            {title}
          </h2>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

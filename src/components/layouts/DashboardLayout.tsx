import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">

      {/* Main Content */}
      <div className="bg-[url('/images/dashboard-background.jpg')] bg-cover bg-center h-screen">
        {title && (
          <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-6">
            {title}
          </h2>
        )}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

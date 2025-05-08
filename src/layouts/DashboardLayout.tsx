import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getAuthToken } from "@/utils/auth";
import {
  backgrounds,
  getSavedBackgroundIndex,
  saveBackgroundIndex,
} from "@/utils/backgrounds";
import LoginForm from "@/components-dashboard/LoginForm/LoginForm";

interface DashboardLayoutProps {
  title?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const DashboardLayout = ({ title }: DashboardLayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(
    getSavedBackgroundIndex()
  );
  const currentBackground = backgrounds[currentBackgroundIndex];

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setIsAuthenticated(data.success);
      } catch (err) {
        console.error("Failed to validate token:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleBackgroundChange = () => {
    const newIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    setCurrentBackgroundIndex(newIndex);
    saveBackgroundIndex(newIndex);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--commandly-background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[var(--commandly-background)] relative">
      <div
        style={{
          backgroundImage: `url(${currentBackground.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="fixed inset-0 transition-all duration-700 ease-in-out"
      />
      <div
        className={`fixed inset-0 bg-gradient-to-br ${currentBackground.color} transition-all duration-700 ease-in-out`}
      />

      {/* Main Content */}
      <div className="relative min-h-screen z-10 h-screen">
        {title && (
          <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-6 px-8 pt-6">
            {title}
          </h2>
        )}
        <div className="h-full">
          <Outlet context={{ onChangeBackground: handleBackgroundChange }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

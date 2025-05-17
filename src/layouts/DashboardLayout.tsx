import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getAuthToken, setAuthToken } from "@/utils/auth";
import {
  backgrounds,
  getSavedBackgroundIndex,
  saveBackgroundIndex,
} from "@/utils/backgrounds";
import LoginForm from "@/components-dashboard/LoginForm/LoginForm";
import Sidebar from "@/components-dashboard/Sidebar/Sidebar";
import { Widget } from "@/pages/dashboard/App";
import DashboardLayoutLoadingSkeleton from "@/components-dashboard/DashboardLayoutLoadingSkeleton/DashboardLayoutLoadingSkeleton";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const DashboardLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(
    getSavedBackgroundIndex()
  );
  const currentBackground =
    backgrounds[currentBackgroundIndex] || backgrounds[0];
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);

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

  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get("commandly_token").then((result) => {
        setAuthToken(result.commandly_token);
        checkAuth();
      });
    } else {
      checkAuth();
    }
  }, []);

  const widgetSizes = {
    stats: { w: 4, h: 3 },
    clips: { w: 4, h: 3 },
    clock: { w: 2, h: 2 },
    diagram: { w: 4, h: 3 },
    chat: { w: 3, h: 1 },
  };

  const handleBackgroundChange = () => {
    const newIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    setCurrentBackgroundIndex(newIndex);
    saveBackgroundIndex(newIndex);
  };

  const handleAddWidget = (widgetType: string) => {
    if (!["stats", "clips", "clock", "diagram", "chat"].includes(widgetType))
      return;

    // Generate a unique ID for the new widget
    const newId = `${widgetType}-${Date.now()}`;

    // Find the highest y position to place the new widget below existing ones
    const maxY = Math.max(...widgets.map((w) => w.y + w.h), 0);

    // Create the new widget with different default sizes based on type
    const newWidget: Widget = {
      id: newId,
      type: widgetType as Widget["type"],
      x: 0,
      y: maxY,
      w: widgetSizes[widgetType as keyof typeof widgetSizes].w,
      h: widgetSizes[widgetType as keyof typeof widgetSizes].h,
      staticH: true,
    };

    // Add the new widget to the state
    setWidgets([...widgets, newWidget]);
  };

  if (isLoading) {
    return <DashboardLayoutLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div
      className="w-full flex items-center gap-6 relative"
      style={{
        backgroundImage: `url(${currentBackground.url})`,
        padding: "20px",
        height: "calc(100vh - 40px)",
      }}
    >
      <Sidebar
        isModifyMode={isModifyMode}
        onModifyModeChange={setIsModifyMode}
        onAddWidget={handleAddWidget}
        onChangeBackground={handleBackgroundChange}
        existingWidgets={widgets}
      />
      <div className="relative flex-1 overflow-auto h-full">
        <Outlet
          context={{ isModifyMode, setIsModifyMode, widgets, setWidgets }}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;

import {
  FiSettings,
  FiPlus,
  FiGrid,
  FiImage,
  FiScissors,
  FiLayout,
  FiBarChart2,
  FiMessageSquare,
} from "react-icons/fi";
import GlassmorphismBackground from "../GlassmorphismBackground";
import { useState } from "react";
import WidgetSidebar from "../WidgetSidebar/WidgetSidebar";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isModifyMode: boolean;
  onModifyModeChange: (value: boolean) => void;
  onAddWidget: (widgetType: string) => void;
  onChangeBackground: () => void;
  existingWidgets: Array<{ type: string }>;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none z-[100]">
    {text}
    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
  </div>
);

const Sidebar = ({
  isModifyMode,
  onModifyModeChange,
  onAddWidget,
  onChangeBackground,
  existingWidgets,
}: SidebarProps) => {
  const [isWidgetSidebarOpen, setIsWidgetSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isClipsView =
    new URLSearchParams(location.search).get("clip") === "true";
  const isSettingsView =
    new URLSearchParams(location.search).get("settings") === "true";
  const isBrowserStatisticsView =
    new URLSearchParams(location.search).get("browser-statistics") === "true";
  const isBaseDashboard = !location.search;
  const hasQueryParams = location.search !== "";

  const handleClipsClick = () => {
    if (isClipsView) {
      navigate("/dashboard.html");
    } else {
      navigate("/dashboard.html?clip=true");
    }
  };

  const handleSettingsClick = () => {
    if (isSettingsView) {
      navigate("/dashboard.html");
    } else {
      navigate("/dashboard.html?settings=true");
    }
  };

  const buttonBaseClasses =
    "p-3.5 cursor-pointer rounded-full transition-all duration-300 text-black relative group hover:scale-110 active:scale-95";
  const buttonActiveClasses = "bg-purple-500 text-white shadow-lg";
  const buttonInactiveClasses =
    "bg-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-100";

  return (
    <>
      <GlassmorphismBackground
        fullRadius={false}
        className="!backdrop-blur-2xl !bg-white/10"
        zIndex={2}
      >
        <div className="h-full rounded-2xl w-16 flex flex-col items-center py-4 gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/dashboard.html")}
              className={`${buttonBaseClasses} ${
                isBaseDashboard ? buttonActiveClasses : buttonInactiveClasses
              }`}
            >
              <FiLayout className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <Tooltip text="Dashboard" />
            </button>

            {!hasQueryParams && (
              <button
                onClick={() => onModifyModeChange(!isModifyMode)}
                className={`${buttonBaseClasses} ${
                  isModifyMode ? buttonActiveClasses : buttonInactiveClasses
                }`}
              >
                <FiGrid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <Tooltip
                  text={isModifyMode ? "Exit modify mode" : "Enter modify mode"}
                />
              </button>
            )}

            {!hasQueryParams && (
              <button
                onClick={() =>
                  setIsWidgetSidebarOpen((prevState) => !prevState)
                }
                className={`${buttonBaseClasses} ${buttonInactiveClasses}`}
              >
                <FiPlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                <Tooltip text="Add Widget" />
              </button>
            )}

            {!hasQueryParams && (
              <div className="h-1 w-full border-b-2 border-white/30" />
            )}

            <button
              onClick={() => navigate("/dashboard.html?chat=true")}
              className={`${buttonBaseClasses} ${buttonInactiveClasses}`}
            >
              <FiMessageSquare className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              <Tooltip text="Chat" />
            </button>
            <button
              onClick={handleClipsClick}
              className={`${buttonBaseClasses} ${
                isClipsView ? buttonActiveClasses : buttonInactiveClasses
              }`}
            >
              <FiScissors className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              <Tooltip
                text={isClipsView ? "Back to Dashboard" : "Manage Clips"}
              />
            </button>
            <button
              onClick={() =>
                navigate("/dashboard.html?browser-statistics=true")
              }
              className={`${buttonBaseClasses} ${
                isBrowserStatisticsView
                  ? buttonActiveClasses
                  : buttonInactiveClasses
              }`}
            >
              <FiBarChart2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              <Tooltip text="Browser Statistics" />
            </button>
          </div>

          <div className="flex flex-col gap-2 border-t-2 border-white/30 pt-2">
            <button
              onClick={handleSettingsClick}
              className={`${buttonBaseClasses} ${
                isSettingsView ? buttonActiveClasses : buttonInactiveClasses
              }`}
            >
              <FiSettings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              <Tooltip
                text={isSettingsView ? "Back to Dashboard" : "Settings"}
              />
            </button>

            <button
              onClick={onChangeBackground}
              className={`${buttonBaseClasses} ${buttonInactiveClasses}`}
            >
              <FiImage className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              <Tooltip text="Change background" />
            </button>
          </div>
        </div>
      </GlassmorphismBackground>

      <WidgetSidebar
        isOpen={isWidgetSidebarOpen}
        onClose={() => setIsWidgetSidebarOpen(false)}
        onAddWidget={onAddWidget}
        existingWidgets={existingWidgets}
      />
    </>
  );
};

export default Sidebar;

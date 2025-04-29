import { useState, useEffect } from "react";
import {
  Responsive,
  WidthProvider,
  Layout,
  Layouts as ReactGridLayouts,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GlassmorphismBackground from "@/components/GlassmorphismBackground";
import StatsWidget from "@/components/Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "@/components/Widgets/ClipsWidget/ClipsWidget";
import ClockWidget from "@/components/Widgets/ClockWidget/ClockWidget";
import Sidebar from "@/components/Sidebar/Sidebar";
import { FiRefreshCw } from "react-icons/fi";
import { backgrounds, saveBackgroundIndex } from "@/utils/backgrounds";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  type: "stats" | "clips" | "clock";
  x: number;
  y: number;
  w: number;
  h: number;
  staticH: boolean;
}

const STORAGE_KEY = "dashboard-widgets";
const BACKGROUND_KEY = "dashboard-background-index";

const Dashboard = () => {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(() => {
    // Load the last selected background or default to the first one
    const saved = localStorage.getItem(BACKGROUND_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    // Load widgets from localStorage on initial render
    try {
      const savedWidgets = localStorage.getItem(STORAGE_KEY);
      return savedWidgets ? JSON.parse(savedWidgets) : [];
    } catch (error) {
      console.error("Failed to load widgets from localStorage:", error);
      return [];
    }
  });

  // Save widgets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error("Failed to save widgets to localStorage:", error);
    }
  }, [widgets]);

  const handleChangeBackground = () => {
    const newIndex = (backgroundIndex + 1) % backgrounds.length;
    setBackgroundIndex(newIndex);
    saveBackgroundIndex(newIndex);
  };

  const currentBackground = backgrounds[backgroundIndex];

  const onLayoutChange = (_layout: Layout[], allLayouts: ReactGridLayouts) => {
    // Update widget positions
    const updatedWidgets = widgets.map((widget) => {
      const layoutItem = allLayouts.lg.find((item) => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
        };
      }
      return widget;
    });

    setWidgets(updatedWidgets);
  };

  const handleAddWidget = (widgetType: string) => {
    if (!["stats", "clips", "clock"].includes(widgetType)) return;

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
      w: widgetType === "clock" ? 2 : 4, // Smaller width for clock
      h: widgetType === "clock" ? 2 : 3, // Smaller height for clock
      staticH: true,
    };

    // Add the new widget to the state
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== widgetId));
  };

  // Create layouts object from widgets
  const layouts: ReactGridLayouts = {
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      staticH: widget.staticH,
    })),
    md: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 3),
      h: widget.h,
      staticH: widget.staticH,
    })),
    sm: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 2),
      h: widget.h,
      staticH: widget.staticH,
    })),
    xs: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 1),
      h: widget.h,
      staticH: widget.staticH,
    })),
  };

  return (
    <div
      className="w-full h-full flex items-center gap-6 p-6"
      style={{
        backgroundImage: `url(${currentBackground.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentBackground.color} mix-blend-overlay`}
      />

      <button
        onClick={handleChangeBackground}
        className="absolute bottom-6 right-6 z-10 p-3 bg-black/30 hover:bg-black/40 rounded-full text-white/80 hover:text-white backdrop-blur-sm transition-all duration-200 shadow-lg group"
        title="Change background"
      >
        <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
      </button>

      <div className="absolute bottom-6 left-6 z-10 text-sm text-white/50">
        {currentBackground.credit}
      </div>

      <Sidebar
        isModifyMode={isModifyMode}
        onModifyModeChange={setIsModifyMode}
        onAddWidget={handleAddWidget}
        onChangeBackground={handleChangeBackground}
      />
      <div className="relative flex-1 overflow-auto h-full">
        <GlassmorphismBackground className="!backdrop-blur-2xl !bg-black/10">
          <div className="p-6">
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 12, md: 9, sm: 6, xs: 3 }}
              rowHeight={100}
              onLayoutChange={onLayoutChange}
              isDraggable={isModifyMode}
              isResizable={false}
              margin={[20, 20]}
              containerPadding={[0, 0]}
              useCSSTransforms
            >
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`h-full transition-all duration-300 ${
                    isModifyMode ? "cursor-move" : "cursor-default"
                  }`}
                >
                  <div
                    className={`relative h-full rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      widget.type === "clock" ? "bg-white/20" : "bg-black/20"
                    }`}
                  >
                    {isModifyMode && (
                      <button
                        onClick={() => handleRemoveWidget(widget.id)}
                        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                        title="Remove widget"
                      >
                        ×
                      </button>
                    )}
                    {widget.type === "stats" && <StatsWidget />}
                    {widget.type === "clips" && <ClipsWidget />}
                    {widget.type === "clock" && <ClockWidget />}
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        </GlassmorphismBackground>
      </div>
    </div>
  );
};

export default Dashboard;

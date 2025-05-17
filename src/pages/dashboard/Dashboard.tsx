import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Responsive,
  WidthProvider,
  Layout,
  Layouts as ReactGridLayouts,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import StatsWidget from "@/components-dashboard/Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "@/components-dashboard/Widgets/ClipsWidget/ClipsWidget";
import ClockWidget from "@/components-dashboard/Widgets/ClockWidget/ClockWidget";
import DiagramWidget from "@/components-dashboard/Widgets/DiagramWidget/DiagramWidget";
import ChatWidget from "@/components-dashboard/Widgets/ChatWidget/index";
import {
  getWidgetSettings,
  updateWidgetSettings,
} from "@/services/widgetSettings";
import { Widget } from "./App";

interface DashboardContext {
  isModifyMode: boolean;
  setIsModifyMode: (value: boolean) => void;
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { isModifyMode, widgets, setWidgets } =
    useOutletContext<DashboardContext>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const response = await getWidgetSettings();
        if (response.success && response.settings) {
          setWidgets(response.settings);
        }
      } catch (error) {
        console.error("Failed to load widgets:", error);
        setError("Failed to load widgets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadWidgets();
  }, [setWidgets]);

  useEffect(() => {
    const saveWidgets = async () => {
      if (widgets.length === 0) return;
      try {
        await updateWidgetSettings(widgets);
      } catch (error) {
        console.error("Failed to save widgets:", error);
        setError("Failed to save widget changes. Please try again later.");
      }
    };

    saveWidgets();
  }, [widgets]);

  const onLayoutChange = (_layout: Layout[], allLayouts: ReactGridLayouts) => {
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

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== widgetId));
  };

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
      w: widget.w,
      h: widget.h,
      staticH: widget.staticH,
    })),
    sm: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      staticH: widget.staticH,
    })),
    xs: widgets.map((widget) => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      staticH: widget.staticH,
    })),
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white">Loading widgets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (widgets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-white/80 space-y-4">
          <h2 className="text-2xl font-semibold">No Widgets Added Yet</h2>
          <p className="max-w-md">
            <span className="block font-semibold text-lg mb-2">
              Click the{" "}
              <span className="inline-block bg-white/10 rounded px-2 py-1 mx-1 text-white font-bold text-xl align-middle">
                +
              </span>{" "}
              button on the left sidebar{" "}
              <span className="inline-block align-middle">⬅️</span> to add your
              first widget.
            </span>
            <span className="block mt-2">
              You can add widgets like Stats, Clips, Clock, Diagram, or Chat to
              customize your dashboard.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
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
              isModifyMode
                ? "cursor-move ring-4 ring-indigo-400/40 ring-inset bg-indigo-400/5"
                : "cursor-default"
            }`}
          >
            <div
              className={`relative h-full rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-slow`}
            >
              {widget.type === "stats" && <StatsWidget />}
              {widget.type === "clips" && <ClipsWidget />}
              {widget.type === "clock" && <ClockWidget />}
              {widget.type === "diagram" && <DiagramWidget />}
              {widget.type === "chat" && <ChatWidget />}
              {isModifyMode && (
                <span className="absolute left-2 top-2 text-indigo-400/80 text-xl pointer-events-none select-none">
                  ⠿
                </span>
              )}
            </div>
            {isModifyMode && (
              <div className="w-full h-full bg-indigo-400/20 hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 z-20 flex items-start justify-end">
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="m-2 w-8 h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-900 hover:text-white transition-all duration-200 border-2 border-white/80 hover:scale-110 cursor-pointer"
                  title="Remove widget"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;

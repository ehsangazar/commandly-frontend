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
  console.log(widgets);

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

  return (
    <div>
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
              className={`relative h-full rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {isModifyMode && (
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-white text-gray-500 rounded-full flex items-center justify-center shadow-lg hover:text-black transition-colors duration-200"
                  title="Remove widget"
                >
                  -
                </button>
              )}
              {widget.type === "stats" && <StatsWidget />}
              {widget.type === "clips" && <ClipsWidget />}
              {widget.type === "clock" && <ClockWidget />}
              {widget.type === "diagram" && <DiagramWidget />}
              {widget.type === "chat" && <ChatWidget />}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;

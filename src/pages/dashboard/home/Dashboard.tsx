import { useState } from "react";
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

const Dashboard = () => {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);

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
    <div className="w-full h-full flex items-center gap-6 p-6">
      <Sidebar
        isModifyMode={isModifyMode}
        onModifyModeChange={setIsModifyMode}
        onAddWidget={handleAddWidget}
      />
      <div className="flex-1 overflow-auto h-full">
        <GlassmorphismBackground className="!backdrop-blur-2xl !bg-white/10">
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
                    className={`h-full rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      widget.type === "clock"
                        ? "bg-white/20" // Higher contrast for clock
                        : "bg-white/10"
                    }`}
                  >
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

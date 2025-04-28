import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GlassmorphismBackground from "@/components/GlassmorphismBackground";
import StatsWidget from "@/components/Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "@/components/Widgets/ClipsWidget/ClipsWidget";
import ClockWidget from "@/components/Widgets/ClockWidget/ClockWidget";
import Sidebar from "@/components/Sidebar/Sidebar";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [widgets, setWidgets] = useState<any[]>([]);

  const onLayoutChange = (_layout: any, layouts: any) => {
    
    // Update widget positions
    const updatedWidgets = widgets.map((widget: any) => {
      const layoutItem = layouts.lg.find((item: any) => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y
        };
      }
      return widget;
    });
    
    setWidgets(updatedWidgets);
  };

  const handleAddWidget = (widgetType: string) => {
    // Generate a unique ID for the new widget
    const newId = `${widgetType}-${Date.now()}`;
    
    // Find the highest y position to place the new widget below existing ones
    const maxY = Math.max(...widgets.map(w => w.y + w.h), 0);
    
    // Create the new widget
    const newWidget = {
      id: newId,
      type: widgetType,
      x: 0,
      y: maxY,
      w: 4,
      h: 3,
      staticH: true
    };
    
    // Add the new widget to the state
    setWidgets([...widgets, newWidget]);
  };

  // Create layouts object from widgets
  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      staticH: widget.staticH
    })),
    md: widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 3),
      h: widget.h,
      staticH: widget.staticH
    })),
    sm: widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 2),
      h: widget.h,
      staticH: widget.staticH
    })),
    xs: widgets.map(widget => ({
      i: widget.id,
      x: widget.x,
      y: widget.y,
      w: Math.min(widget.w, 1),
      h: widget.h,
      staticH: widget.staticH
    }))
  };

  return (
    <div className="w-full h-full flex items-center gap-4">
      <Sidebar 
        isModifyMode={isModifyMode} 
        onModifyModeChange={setIsModifyMode} 
        onAddWidget={handleAddWidget}
      />
      <div className="flex-1 overflow-auto h-full">
        <GlassmorphismBackground>
          <div className="p-4">
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
              cols={{ lg: 12, md: 9, sm: 6, xs: 3 }}
              rowHeight={100}
              onLayoutChange={onLayoutChange}
              isDraggable={isModifyMode}
              isResizable={false}
              margin={[16, 16]}
              containerPadding={[0, 0]}
              useCSSTransforms
            >
              {widgets.map(widget => (
                <div 
                  key={widget.id} 
                  className={`h-full transition-all ${
                    isModifyMode ? "cursor-move" : "cursor-default"
                  }`}
                >
                  {widget.type === 'stats' && <StatsWidget />}
                  {widget.type === 'clips' && <ClipsWidget />}
                  {widget.type === 'clock' && <ClockWidget />}
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

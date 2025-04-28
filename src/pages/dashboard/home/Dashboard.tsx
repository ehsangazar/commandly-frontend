import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GlassmorphismBackground from "@/components/GlassmorphismBackground";
import StatsWidget from "@/components/Widgets/StatsWidget/StatsWidget";
import Sidebar from "@/components/Sidebar/Sidebar";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "stats", x: 0, y: 0, w: 4, h: 3, staticH: true },
    ],
    md: [
      { i: "stats", x: 0, y: 0, w: 3, h: 3, staticH: true },
    ],
    sm: [
      { i: "stats", x: 0, y: 0, w: 2, h: 3, staticH: true },
    ],
    xs: [
      { i: "stats", x: 0, y: 0, w: 1, h: 3, staticH: true },
    ],
  });

  const onLayoutChange = (_layout: any, layouts: any) => {
    setLayouts(layouts);
  };

  return (
    <div className="w-full h-full flex items-center gap-4">
      <Sidebar isModifyMode={isModifyMode} onModifyModeChange={setIsModifyMode} />
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
              <div 
                key="stats" 
                className={`h-full transition-all ${
                  isModifyMode ? "cursor-move" : "cursor-default"
                }`}
              >
                <StatsWidget />
              </div>
            </ResponsiveGridLayout>
          </div>
        </GlassmorphismBackground>
      </div>
    </div>
  );
};

export default Dashboard;

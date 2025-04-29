import { useEffect } from "react";
import { FiX, FiBarChart2, FiClock, FiClipboard } from "react-icons/fi";
import StatsWidget from "../Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "../Widgets/ClipsWidget/ClipsWidget";
import ClockWidget from "../Widgets/ClockWidget/ClockWidget";
import GlassmorphismBackground from "../GlassmorphismBackground";

interface WidgetSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widgetType: string) => void;
}

const WidgetSidebar = ({
  isOpen,
  onClose,
  onAddWidget,
}: WidgetSidebarProps) => {
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest(".widget-sidebar") &&
        !target.closest(".add-widget-button")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const widgets = [
    {
      type: "stats",
      title: "Stats Widget",
      description: "Track your browsing statistics",
      icon: FiBarChart2,
      component: StatsWidget,
    },
    {
      type: "clips",
      title: "Clips Widget",
      description: "Save and organize text snippets",
      icon: FiClipboard,
      component: ClipsWidget,
    },
    {
      type: "clock",
      title: "Clock Widget",
      description: "Display time and date",
      icon: FiClock,
      component: ClockWidget,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 transform transition-transform duration-500 ease-out z-50 widget-sidebar ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <GlassmorphismBackground className="h-full !backdrop-blur-2xl !bg-black/20">
          <div className="h-full p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white/90">
                Add Widget
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {widgets.map((widget) => (
                <div key={widget.type} className="group">
                  <button
                    onClick={() => {
                      onAddWidget(widget.type);
                      onClose();
                    }}
                    className="w-full text-left"
                  >
                    <div className="mb-2 flex items-center gap-2 text-white/90">
                      <widget.icon className="w-5 h-5 text-[var(--commandly-primary)]" />
                      <span className="font-medium">{widget.title}</span>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      {widget.description}
                    </p>
                    <div className="relative rounded-xl border border-white/20 overflow-hidden transition-all duration-300 group-hover:border-white/40 group-hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
                      <div className="h-48 pointer-events-none scale-75 origin-top">
                        <widget.component />
                      </div>
                      <div className="absolute inset-0 bg-[var(--commandly-primary)]/0 group-hover:bg-[var(--commandly-primary)]/10 transition-colors duration-300" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </GlassmorphismBackground>
      </div>
    </>
  );
};

export default WidgetSidebar;

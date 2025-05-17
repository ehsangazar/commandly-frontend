import { useEffect } from "react";
import {
  FiBarChart2,
  FiClock,
  FiClipboard,
  FiPieChart,
  FiMessageSquare,
} from "react-icons/fi";

interface WidgetSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widgetType: string) => void;
  existingWidgets: Array<{ type: string }>;
}

const WidgetSidebar = ({
  isOpen,
  onClose,
  onAddWidget,
  existingWidgets,
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
      preview: "https://commandly.dev/widgets/stats-preview.png",
      unique: true,
      maxInstances: 1,
    },
    {
      type: "diagram",
      title: "Usage Chart",
      description: "Visualize website usage with charts",
      icon: FiPieChart,
      preview: "https://commandly.dev/widgets/diagram-preview.png",
      unique: true,
      maxInstances: 1,
    },
    {
      type: "clips",
      title: "Clips Widget",
      description: "Save and organize text snippets",
      icon: FiClipboard,
      preview: "https://commandly.dev/widgets/stats-preview.png",
      unique: false,
      maxInstances: 1,
    },
    {
      type: "clock",
      title: "Clock Widget",
      description: "Display time and date",
      icon: FiClock,
      preview: "https://commandly.dev/widgets/clock-preview.png",
      unique: false,
      maxInstances: 1,
    },
    {
      type: "chat",
      title: "Chat Widget",
      description: "Quick message input",
      icon: FiMessageSquare,
      preview: "https://commandly.dev/widgets/chat-preview.png",
      unique: false,
      maxInstances: 1,
    },
  ];

  const isWidgetDisabled = (widgetType: string, maxInstances: number) => {
    const instanceCount = existingWidgets.filter(
      (widget) => widget.type === widgetType
    ).length;
    return instanceCount >= maxInstances;
  };

  // Sort widgets: available ones first, then disabled ones
  const sortedWidgets = [...widgets].sort((a, b) => {
    const aDisabled = isWidgetDisabled(a.type, a.maxInstances);
    const bDisabled = isWidgetDisabled(b.type, b.maxInstances);
    if (aDisabled === bDisabled) return 0;
    return aDisabled ? 1 : -1;
  });

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
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
          opacity: isOpen ? 1 : 0,
        }}
        className="fixed top-0 right-0 h-screen w-96 z-50 widget-sidebar"
      >
        <div className="h-full overflow-y-auto py-6 pl-6 pr-4 custom-scrollbar">
          <div className="space-y-6">
            {sortedWidgets.map((widget) => {
              const isDisabled = isWidgetDisabled(
                widget.type,
                widget.maxInstances
              );
              return (
                <div
                  key={widget.type}
                  className={`group ${isDisabled ? "opacity-40" : ""}`}
                >
                  <button
                    onClick={() => {
                      if (!isDisabled) {
                        onAddWidget(widget.type);
                        onClose();
                      }
                    }}
                    className="w-full text-left"
                    disabled={isDisabled}
                  >
                    <div className="flex items-center gap-2 text-white/90 justify-between">
                      <span className="font-medium">{widget.title}</span>
                      {isDisabled && (
                        <div className="flex items-center gap-1 text-white/50 text-xs bg-black/20 rounded-lg px-4 py-1">
                          <span>Already added</span>
                        </div>
                      )}
                    </div>
                    <p className="!text-xs text-white/70 mb-3">
                      {widget.description}
                    </p>
                    <div
                      className={`relative rounded-xl border border-white/20 overflow-hidden transition-all duration-300 ${
                        !isDisabled
                          ? "group-hover:border-white/40 group-hover:shadow-lg"
                          : ""
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
                      <img
                        src={widget.preview}
                        alt={`${widget.title} preview`}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`absolute inset-0 ${
                          !isDisabled
                            ? "bg-[var(--commandly-primary)]/0 group-hover:bg-[var(--commandly-primary)]/10"
                            : ""
                        } transition-colors duration-300`}
                      />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WidgetSidebar;

import { useEffect } from "react";
import StatsWidget from "../Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "../Widgets/ClipsWidget/ClipsWidget";
import ClockWidget from "../Widgets/ClockWidget/ClockWidget";

interface WidgetSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widgetType: string) => void;
}

const WidgetSidebar = ({ isOpen, onClose, onAddWidget }: WidgetSidebarProps) => {
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.widget-sidebar') && !target.closest('.add-widget-button')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className="fixed top-0 right-0 h-[95%] widget-sidebar z-50"
    >
        <div className="h-full w-80 p-4">  
          <div className="space-y-6">
            {/* Stats Widget Preview */}
            <div className="space-y-2">
              <div 
                className="h-40 rounded-lg overflow-hidden border border-[var(--commandly-border)] pointer-events-none"
                onClick={() => onAddWidget('stats')}
              >
                <StatsWidget />
              </div>
            </div>
            
            {/* Clips Widget Preview */}
            <div className="space-y-2">
              <div 
                className="h-40 rounded-lg overflow-hidden border border-[var(--commandly-border)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full"
                onClick={() => onAddWidget('clips')}
              >
                <ClipsWidget />
              </div>
            </div>
            
            {/* Clock Widget Preview */}
            <div className="space-y-2">
              <div 
                className="h-40 rounded-lg overflow-hidden border border-[var(--commandly-border)] relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:z-40"
                onClick={() => onAddWidget('clock')}
              >
                <ClockWidget />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default WidgetSidebar; 
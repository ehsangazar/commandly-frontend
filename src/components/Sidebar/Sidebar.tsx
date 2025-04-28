import { FiSettings, FiLayout } from "react-icons/fi";
import GlassmorphismBackground from "../GlassmorphismBackground";

interface SidebarProps {
  isModifyMode: boolean;
  onModifyModeChange: (value: boolean) => void;
}

const Sidebar = ({ isModifyMode, onModifyModeChange }: SidebarProps) => {
  return (
    <GlassmorphismBackground className="!h-fit">
        <div className="h-fit rounded-lg w-16 flex flex-col items-center py-4 gap-4">
        <button
            onClick={() => onModifyModeChange(!isModifyMode)}
            className={`p-3 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
            isModifyMode
                ? "bg-[var(--commandly-primary)] text-white"
                : "bg-[var(--commandly-hover)] text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
            }`}
            title={isModifyMode ? "Done" : "Modify Layout"}
        >
            <FiLayout className="w-5 h-5" />
        </button>

        <button
            className="p-3 rounded-lg bg-[var(--commandly-hover)] text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)] transition-all duration-200 hover:scale-110 active:scale-95"
            title="Settings"
        >
            <FiSettings className="w-5 h-5" />
        </button>
        </div>
    </GlassmorphismBackground>
  );
};

export default Sidebar; 
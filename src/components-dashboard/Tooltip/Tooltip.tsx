import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip = ({
  text,
  children,
  position = "top",
  className = "",
}: TooltipProps) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative group inline-block">
      {children}
      <div
        className={`pointer-events-none absolute ${positionClasses[position]} px-2 py-1 rounded bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 shadow-lg z-50 whitespace-nowrap transition-all duration-200 scale-95 group-hover:scale-100 ${className}`}
      >
        {text}
      </div>
    </span>
  );
};

export default Tooltip;

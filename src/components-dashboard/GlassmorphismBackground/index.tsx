import React from "react";

interface GlassmorphismBackgroundProps {
  children: React.ReactNode;
  className?: string;
  fullRadius?: boolean;
  zIndex?: number;
}

const GlassmorphismBackground: React.FC<GlassmorphismBackgroundProps> = ({
  children,
  className = "",
  fullRadius = false,
  zIndex = 0,
}) => {
  return (
    <div
      className={`relative backdrop-blur-md bg-white/10 dark:bg-gray-800/40 overflow-y-scroll ${
        fullRadius ? "rounded-full" : "rounded-2xl"
      } shadow-lg border border-white/30 dark:border-gray-700/30 h-full ${className}`}
      style={{ zIndex }}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
    </div>
  );
};

export default GlassmorphismBackground;

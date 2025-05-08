import React from 'react';

interface GlassmorphismBackgroundProps {
  children: React.ReactNode;
  className?: string;
  fullRadius?: boolean;
}

const GlassmorphismBackground: React.FC<GlassmorphismBackgroundProps> = ({
  children,
  className = '',
  fullRadius = false,
}) => {
  return (
    <div
      className={`relative backdrop-blur-md bg-white/40 dark:bg-gray-800/40 ${
        fullRadius ? 'rounded-full' : 'rounded-2xl'
      } shadow-lg border border-white/30 dark:border-gray-700/30 overflow-hidden h-full ${className}`}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
    </div>
  );
};

export default GlassmorphismBackground;

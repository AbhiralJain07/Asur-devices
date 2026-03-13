"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResponsiveVisualizationProps {
  children: React.ReactNode;
  className?: string;
}

// Responsive breakpoints
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Hook to get current screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    breakpoint: "xs" as keyof typeof breakpoints,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: keyof typeof breakpoints = "xs";
      for (const [bp, minWidth] of Object.entries(breakpoints)) {
        if (width >= minWidth) {
          breakpoint = bp as keyof typeof breakpoints;
        }
      }

      setScreenSize({ width, height, breakpoint });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}

// Responsive container component
export function ResponsiveContainer({ children, className = "" }: ResponsiveVisualizationProps) {
  const { breakpoint } = useScreenSize();

  const getContainerPadding = () => {
    switch (breakpoint) {
      case "xs": return "px-4";
      case "sm": return "px-6";
      case "md": return "px-8";
      case "lg": return "px-12";
      case "xl": return "px-16";
      case "2xl": return "px-20";
      default: return "px-4";
    }
  };

  const getContainerMaxWidth = () => {
    switch (breakpoint) {
      case "xs": return "max-w-full";
      case "sm": return "max-w-sm";
      case "md": return "max-w-md";
      case "lg": return "max-w-lg";
      case "xl": return "max-w-xl";
      case "2xl": return "max-w-2xl";
      default: return "max-w-full";
    }
  };

  return (
    <div className={`${getContainerPadding()} ${getContainerMaxWidth()} mx-auto ${className}`}>
      {children}
    </div>
  );
}

// Responsive grid component
export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, "2xl": 4 },
  gap = 4,
  className = "" 
}: {
  children: React.ReactNode;
  cols?: Partial<Record<keyof typeof breakpoints | "xs", number>>;
  gap?: number;
  className?: string;
}) {
  const { breakpoint } = useScreenSize();
  
  const currentCols = cols[breakpoint] || cols.xs || 1;
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid grid-cols-${currentCols} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

// Responsive text component
export function ResponsiveText({ 
  children, 
  size = { xs: "sm", sm: "base", md: "lg", lg: "xl", xl: "2xl", "2xl": "3xl" },
  className = "" 
}: {
  children: React.ReactNode;
  size?: Partial<Record<keyof typeof breakpoints | "xs", string>>;
  className?: string;
}) {
  const { breakpoint } = useScreenSize();
  
  const currentSize = size[breakpoint] || size.xs || "base";
  const sizeClass = `text-${currentSize}`;

  return (
    <div className={`${sizeClass} ${className}`}>
      {children}
    </div>
  );
}

// Responsive chart wrapper
export function ResponsiveChart({ 
  children, 
  aspectRatio = { xs: 1, sm: 16/9, md: 16/10, lg: 16/8, xl: 16/6, "2xl": 16/5 },
  minHeight = 200,
  className = "" 
}: {
  children: React.ReactNode;
  aspectRatio?: Partial<Record<keyof typeof breakpoints | "xs", number>>;
  minHeight?: number;
  className?: string;
}) {
  const { breakpoint, width } = useScreenSize();
  
  const currentAspectRatio = aspectRatio[breakpoint] || aspectRatio.xs || 1;
  const chartHeight = Math.max(minHeight, width / currentAspectRatio);

  return (
    <div 
      className={`w-full ${className}`}
      style={{ height: `${chartHeight}px`, minHeight: `${minHeight}px` }}
    >
      {children}
    </div>
  );
}

// Responsive problem card
export function ResponsiveProblemCard({ 
  children, 
  className = "" 
}: ResponsiveVisualizationProps) {
  const { breakpoint } = useScreenSize();

  const getCardPadding = () => {
    switch (breakpoint) {
      case "xs": return "p-3";
      case "sm": return "p-4";
      case "md": return "p-5";
      case "lg": return "p-6";
      case "xl": return "p-6";
      case "2xl": return "p-8";
      default: return "p-4";
    }
  };

  const getCardSpacing = () => {
    switch (breakpoint) {
      case "xs": return "space-y-3";
      case "sm": return "space-y-4";
      case "md": return "space-y-5";
      case "lg": return "space-y-6";
      case "xl": return "space-y-6";
      case "2xl": return "space-y-8";
      default: return "space-y-4";
    }
  };

  return (
    <div className={`${getCardPadding()} glass rounded-lg border border-white/10 ${getCardSpacing()} ${className}`}>
      {children}
    </div>
  );
}

// Responsive metrics grid
export function ResponsiveMetricsGrid({ 
  children, 
  className = "" 
}: ResponsiveVisualizationProps) {
  const { breakpoint } = useScreenSize();

  const getGridCols = () => {
    switch (breakpoint) {
      case "xs": return "grid-cols-1";
      case "sm": return "grid-cols-2";
      case "md": return "grid-cols-3";
      case "lg": return "grid-cols-4";
      case "xl": return "grid-cols-4";
      case "2xl": return "grid-cols-4";
      default: return "grid-cols-1";
    }
  };

  const getGap = () => {
    switch (breakpoint) {
      case "xs": return "gap-3";
      case "sm": return "gap-4";
      case "md": return "gap-4";
      case "lg": return "gap-6";
      case "xl": return "gap-6";
      case "2xl": return "gap-8";
      default: return "gap-4";
    }
  };

  return (
    <div className={`${getGridCols()} ${getGap()} ${className}`}>
      {children}
    </div>
  );
}

// Responsive navigation tabs
export function ResponsiveNavigationTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}: {
  tabs: { id: string; label: string; icon?: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}) {
  const { breakpoint } = useScreenSize();

  const getTabLayout = () => {
    switch (breakpoint) {
      case "xs":
        return "flex flex-col space-y-2";
      case "sm":
        return "flex flex-wrap gap-2";
      case "md":
      case "lg":
      case "xl":
      case "2xl":
        return "flex justify-center";
      default:
        return "flex flex-col space-y-2";
    }
  };

  const getTabStyle = (isActive: boolean) => {
    const baseStyle = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
    const activeStyle = "bg-neon-blue text-black";
    const inactiveStyle = "text-gray-400 hover:text-white";
    
    return `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;
  };

  return (
    <div className={`${getTabLayout()} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={getTabStyle(activeTab === tab.id)}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Responsive tooltip
export function ResponsiveTooltip({ 
  children, 
  content, 
  position = "top", 
  className = "" 
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const { breakpoint } = useScreenSize();
  const [isVisible, setIsVisible] = useState(false);

  const getTooltipWidth = () => {
    switch (breakpoint) {
      case "xs": return "w-48";
      case "sm": return "w-56";
      case "md": return "w-64";
      case "lg": return "w-72";
      case "xl": return "w-80";
      case "2xl": return "w-96";
      default: return "w-56";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${getTooltipWidth()} p-3 glass rounded-lg border border-neon-blue/30 text-sm ${getPositionClasses()}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Responsive modal
export function ResponsiveModal({ 
  isOpen, 
  onClose, 
  children, 
  size = "md", 
  className = "" 
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}) {
  const { breakpoint } = useScreenSize();

  const getModalSize = () => {
    if (size === "full") return "w-full h-full";
    
    switch (breakpoint) {
      case "xs":
        return size === "sm" ? "w-11/12" : "w-full";
      case "sm":
        return size === "sm" ? "w-10/12" : size === "md" ? "w-11/12" : "w-full";
      case "md":
        return size === "sm" ? "w-8/12" : size === "md" ? "w-10/12" : size === "lg" ? "w-11/12" : "w-full";
      case "lg":
      case "xl":
      case "2xl":
        return size === "sm" ? "w-6/12" : size === "md" ? "w-8/12" : size === "lg" ? "w-10/12" : size === "xl" ? "w-11/12" : "w-full";
      default:
        return "w-full";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${getModalSize()} glass rounded-lg border border-white/10 overflow-hidden ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Responsive sidebar
export function ResponsiveSidebar({ 
  isOpen, 
  onClose, 
  children, 
  position = "right", 
  className = "" 
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right";
  className?: string;
}) {
  const { breakpoint } = useScreenSize();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const getSidebarWidth = () => {
    if (isMobile) return "w-full";
    return "w-80";
  };

  const getPositionClasses = () => {
    if (position === "left") {
      return "left-0";
    } else {
      return "right-0";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={onClose}
            />
          )}
          <motion.div
            initial={{ x: position === "left" ? -300 : 300 }}
            animate={{ x: 0 }}
            exit={{ x: position === "left" ? -300 : 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 ${getPositionClasses()} h-full ${getSidebarWidth()} z-50 glass border border-white/10 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export default responsive wrapper
export default function ResponsiveVisualization({ children, className = "" }: ResponsiveVisualizationProps) {
  return (
    <ResponsiveContainer className={className}>
      {children}
    </ResponsiveContainer>
  );
}

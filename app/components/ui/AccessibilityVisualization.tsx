"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface AccessibilityVisualizationProps {
  children: React.ReactNode;
  className?: string;
}

// Hook for keyboard navigation
export function useKeyboardNavigation(
  items: string[],
  onSelect?: (item: string) => void,
  orientation: "horizontal" | "vertical" = "horizontal"
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0 && onSelect) {
          onSelect(items[focusedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setFocusedIndex(-1);
        break;
    }
  }, [items, focusedIndex, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  useEffect(() => {
    if (focusedIndex >= 0 && containerRef.current) {
      const focusedElement = containerRef.current.querySelector(`[data-index="${focusedIndex}"]`) as HTMLElement;
      if (focusedElement) {
        focusedElement.focus();
      }
    }
  }, [focusedIndex]);

  return { focusedIndex, containerRef };
}

// Accessible chart component
export function AccessibleChart({
  title,
  description,
  data,
  children,
  className = "",
}: {
  title: string;
  description: string;
  data: any[];
  children: React.ReactNode;
  className?: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false);

  useEffect(() => {
    const checkScreenReader = () => {
      const hasScreenReader = window.speechSynthesis || 
        window.navigator.userAgent.includes("NVDA") ||
        window.navigator.userAgent.includes("JAWS");
      setIsScreenReaderMode(hasScreenReader);
    };

    checkScreenReader();
    window.addEventListener("resize", checkScreenReader);
    return () => window.removeEventListener("resize", checkScreenReader);
  }, []);

  const generateDataSummary = () => {
    return data.map((item, index) => 
      `Item ${index + 1}: ${item.label || `Data ${index + 1}`}, Value: ${item.value || 0}`
    ).join(". ");
  };

  return (
    <div ref={chartRef} className={`relative ${className}`} role="group" aria-label={title}>
      {/* Screen reader only content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Data summary: {generateDataSummary()}</p>
      </div>

      {/* Visual chart */}
      <div aria-hidden={isScreenReaderMode}>
        {children}
      </div>

      {/* Keyboard instructions */}
      <div className="sr-only" role="note">
        Use arrow keys to navigate chart data, Enter to select, Escape to exit.
      </div>
    </div>
  );
}

// Accessible tooltip component
export function AccessibleTooltip({
  children,
  content,
  id,
  className = "",
}: {
  children: React.ReactNode;
  content: string;
  id: string;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = `tooltip-${id}`;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 px-3 py-2 glass rounded-lg border border-neon-blue/30 text-sm bottom-full left-1/2 transform -translate-x-1/2 mb-2"
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Accessible progress bar
export function AccessibleProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = "",
}: {
  value: number;
  max?: number;
  label: string;
  showPercentage?: boolean;
  className?: string;
}) {
  const percentage = (value / max) * 100;
  const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold text-neon-blue" aria-hidden="true">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      <div
        className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-labelledby={progressId}
      >
        <div
          className="h-full bg-gradient-to-r from-neon-blue to-neon-green rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <span id={progressId} className="sr-only">
          {label}: {value} out of {max} ({percentage.toFixed(1)}% complete)
        </span>
      </div>
    </div>
  );
}

// Accessible metric card
export function AccessibleMetricCard({
  title,
  value,
  unit,
  trend,
  change,
  color = "#00D9FF",
  className = "",
}: {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change?: number;
  color?: string;
  className?: string;
}) {
  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  const trendLabels = {
    up: "increasing",
    down: "decreasing",
    stable: "stable",
  };

  const cardId = `metric-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`p-4 glass rounded-lg border border-white/10 ${className}`}
      role="region"
      aria-labelledby={cardId}
    >
      <div className="space-y-2">
        <h3 id={cardId} className="text-sm text-gray-400">{title}</h3>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold" style={{ color }} aria-hidden="true">
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">{unit}</div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color }} aria-hidden="true">
              {trendIcons[trend]} {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">
              vs last period ({trendLabels[trend]})
            </span>
          </div>
        )}
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite">
          {title}: {value.toLocaleString()} {unit}. 
          {change !== undefined && `Trend is ${trendLabels[trend]} by ${Math.abs(change)} percent compared to last period.`}
        </div>
      </div>
    </div>
  );
}

// Accessible tab navigation
export function AccessibleTabs({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: {
  tabs: { id: string; label: string; content: React.ReactNode; icon?: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}) {
  const { focusedIndex, containerRef } = useKeyboardNavigation(
    tabs.map(tab => tab.id),
    onTabChange
  );

  return (
    <div className={className}>
      {/* Tab list */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Data visualization tabs"
        className="flex flex-wrap justify-center gap-2 mb-6"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={index === focusedIndex ? null : undefined}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            data-index={index}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-neon-blue text-black"
                : "text-gray-400 hover:text-white"
            } ${focusedIndex === index ? "ring-2 ring-neon-blue ring-offset-2 ring-offset-background-primary" : ""}`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`tabpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          aria-hidden={activeTab !== tab.id}
          className={activeTab === tab.id ? "block" : "hidden"}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// Accessible data table
export function AccessibleDataTable({
  headers,
  rows,
  caption,
  className = "",
}: {
  headers: string[];
  rows: string[][];
  caption: string;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-2 text-left font-bold text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Screen reader announcements
export function useScreenReaderAnnouncements() {
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
}

// Focus trap for modals
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }

      // Trap focus within container
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      containerRef.current.addEventListener("keydown", handleKeyDown);
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener("keydown", handleKeyDown);
        }
        // Restore previous focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isActive]);

  return containerRef;
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      const query = window.matchMedia("(prefers-contrast: high)");
      setIsHighContrast(query.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsHighContrast(e.matches);
      };
      
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    };

    const cleanup = checkHighContrast();
    return cleanup;
  }, []);

  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Accessible motion wrapper
export function AccessibleMotion({
  children,
  animate = true,
  className = "",
}: {
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (!animate || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Export default accessibility wrapper
export default function AccessibilityVisualization({ children, className = "" }: AccessibilityVisualizationProps) {
  const isHighContrast = useHighContrastMode();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div 
      className={`${className} ${isHighContrast ? "high-contrast" : ""}`}
      role="main"
      aria-label="Smart City Command Center Data Visualization"
    >
      <AccessibleMotion animate={!prefersReducedMotion}>
        {children}
      </AccessibleMotion>
    </div>
  );
}

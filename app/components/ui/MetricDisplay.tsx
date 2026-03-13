"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedCounterProps } from "../../types/impactMetrics";
import AccessibilityVisualization, { useScreenReaderAnnouncements } from "./AccessibilityVisualization";

// Animated counter component
export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  precision = 0,
  format = "number",
  customFormatter,
  onStart,
  onComplete,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { announce } = useScreenReaderAnnouncements();

  // Format the value based on format type
  const formatValue = useCallback((num: number): string => {
    if (customFormatter) {
      return customFormatter(num);
    }

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(num);
      
      case "percentage":
        return new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(num / 100);
      
      case "number":
      default:
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(num);
    }
  }, [format, precision, customFormatter]);

  // Animation logic
  const animateValue = useCallback(() => {
    if (!isVisible) return;

    setIsAnimating(true);
    onStart?.();
    
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;
    const durationMs = duration;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
        
        // Announce final value for screen readers
        const finalText = `${prefix}${formatValue(endValue)}${suffix}`;
        announce(`Counter reached ${finalText}`, "polite");
      }
    };

    requestAnimationFrame(animate);
  }, [value, displayValue, duration, prefix, suffix, formatValue, isVisible, onStart, onComplete, announce]);

  // Intersection observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Start animation when component becomes visible
  useEffect(() => {
    if (isVisible && !isAnimating) {
      animateValue();
    }
  }, [isVisible, isAnimating, animateValue]);

  // Reset animation when value changes
  useEffect(() => {
    if (isVisible) {
      animateValue();
    }
  }, [value, isVisible, animateValue]);

  const formattedDisplay = `${prefix}${formatValue(displayValue)}${suffix}`;

  return (
    <AccessibilityVisualization className={className}>
      <div ref={containerRef} className="inline-block">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className={`font-bold tabular-nums ${isAnimating ? "animate-pulse" : ""}`}
        >
          {formattedDisplay}
        </motion.span>
        
        {/* Screen reader only live region */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isAnimating ? "Counting..." : `Current value: ${formattedDisplay}`}
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Metric display component with animated counter
export function MetricDisplay({
  metric,
  showTrend = true,
  showComparison = false,
  showTarget = false,
  showMilestones = false,
  isCompact = false,
  animationDelay = 0,
  className = "",
}: {
  metric: any; // ImpactMetrics type
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  showMilestones?: boolean;
  isCompact?: boolean;
  animationDelay?: number;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      case "stable": return "→";
      default: return "→";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-500";
      case "down": return "text-red-500";
      case "stable": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getProgressPercentage = () => {
    if (!metric.targetValue) return 0;
    return Math.min((metric.currentValue / metric.targetValue) * 100, 100);
  };

  const getStatusColor = () => {
    const progress = getProgressPercentage();
    if (progress >= 100) return "text-green-500";
    if (progress >= 80) return "text-blue-500";
    if (progress >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        className={`glass rounded-lg border border-white/10 overflow-hidden ${
          isCompact ? "p-4" : "p-6"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{metric.icon}</div>
            <div>
              <h3 className="font-bold text-white">{metric.title}</h3>
              {!isCompact && (
                <p className="text-sm text-gray-400">{metric.description}</p>
              )}
            </div>
          </div>
          {showTrend && (
            <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
              <span className="text-lg">{getTrendIcon(metric.trend)}</span>
              <span className="text-sm font-medium">
                {metric.change > 0 ? "+" : ""}{metric.change}%
              </span>
            </div>
          )}
        </div>

        {/* Main metric value */}
        <div className="text-center mb-4">
          <AnimatedCounter
            value={metric.currentValue}
            duration={metric.animationDuration || 2000}
            prefix={metric.prefix}
            suffix={metric.suffix}
            precision={metric.precision}
            format={metric.format}
            customFormatter={metric.customFormatter}
          />
          {!isCompact && (
            <div className="text-sm text-gray-400 mt-2">
              {metric.changePeriod}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {showTarget && metric.targetValue && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className={getStatusColor()}>
                {getProgressPercentage().toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1.5, delay: animationDelay + 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Current: {metric.currentValue}</span>
              <span>Target: {metric.targetValue}</span>
            </div>
          </div>
        )}

        {/* Comparisons */}
        {showComparison && metric.comparisons && metric.comparisons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Comparisons</h4>
            <div className="space-y-1">
              {metric.comparisons.slice(0, 2).map((comparison: any, index: number) => (
                <div key={comparison.id} className="flex justify-between text-sm">
                  <span className="text-gray-400">{comparison.label}</span>
                  <span style={{ color: comparison.color || "#9D4EDD" }}>
                    {comparison.value} {metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        {showMilestones && metric.milestones && metric.milestones.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-300">Milestones</h4>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-neon-blue hover:text-neon-blue/80"
              >
                {isExpanded ? "Show Less" : "Show All"}
              </button>
            </div>
            <div className="space-y-2">
              {(isExpanded ? metric.milestones : metric.milestones.slice(0, 2)).map((milestone: any) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-2 rounded border ${
                    milestone.isCompleted
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-gray-600/30 bg-gray-600/10"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {milestone.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {milestone.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        milestone.isCompleted ? "text-green-500" : "text-gray-400"
                      }`}>
                        {milestone.isCompleted ? "✓" : `${milestone.currentValue}/${milestone.targetValue}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(milestone.targetDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {!isCompact && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                {metric.sources && metric.sources.length > 0 && (
                  <span>Source: {metric.sources[0].name}</span>
                )}
                {metric.sources && metric.sources[0] && (
                  <span className={`px-2 py-1 rounded ${
                    metric.sources[0].reliability >= 90 ? "bg-green-500/20 text-green-500" :
                    metric.sources[0].reliability >= 70 ? "bg-yellow-500/20 text-yellow-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {metric.sources[0].reliability}% reliable
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Compact metric card
export function CompactMetricCard({
  metric,
  onClick,
  className = "",
}: {
  metric: any; // ImpactMetrics type
  onClick?: () => void;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="glass rounded-lg border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-lg">{metric.icon}</div>
            <span className="text-sm font-medium text-white">{metric.title}</span>
          </div>
          <div className="text-xs text-gray-400">{metric.unit}</div>
        </div>
        
        <AnimatedCounter
          value={metric.currentValue}
          duration={1000}
          precision={metric.precision}
          format={metric.format}
          customFormatter={metric.customFormatter}
        />
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs">
            <span className={
              metric.trend === "up" ? "text-green-500" :
              metric.trend === "down" ? "text-red-500" : "text-gray-500"
            }>
              {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
            </span>
            <span className="text-gray-400">
              {metric.change > 0 ? "+" : ""}{metric.change}%
            </span>
          </div>
          {metric.targetValue && (
            <div className="text-xs text-gray-400">
              {Math.round((metric.currentValue / metric.targetValue) * 100)}%
            </div>
          )}
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Stats grid component
export function StatsGrid({
  metrics,
  columns = 3,
  className = "",
}: {
  metrics: any[]; // ImpactMetrics[]
  columns?: number;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {metrics.map((metric, index) => (
          <MetricDisplay
            key={metric.id}
            metric={metric}
            animationDelay={index * 0.1}
          />
        ))}
      </div>
    </AccessibilityVisualization>
  );
}

// Progress ring component
export function ProgressRing({
  metric,
  size = 120,
  strokeWidth = 8,
  className = "",
}: {
  metric: any; // ImpactMetrics type
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getProgressPercentage = () => {
    if (!metric.targetValue) return 0;
    return Math.min((metric.currentValue / metric.targetValue) * 100, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`progress-ring-${metric.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [metric.id]);

  useEffect(() => {
    if (isVisible) {
      const targetProgress = getProgressPercentage();
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setProgress(targetProgress * progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, metric]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AccessibilityVisualization className={className}>
      <div id={`progress-ring-${metric.id}`} className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#374151"
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={metric.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedCounter
              value={metric.currentValue}
              duration={1000}
              precision={metric.precision}
              format={metric.format}
              customFormatter={metric.customFormatter}
              className="text-2xl font-bold"
            />
            <div className="text-xs text-gray-400 mt-1">{metric.unit}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="font-medium text-white">{metric.title}</div>
          <div className="text-sm text-gray-400">{Math.round(progress)}% complete</div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

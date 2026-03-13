"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilityVisualization, { useScreenReaderAnnouncements } from "./AccessibilityVisualization";

// Enhanced animated counter with more features
export function AnimatedNumberCounter({
  value,
  targetValue,
  duration = 2000,
  prefix = "",
  suffix = "",
  precision = 0,
  format = "number",
  customFormatter,
  easing = "easeOutQuart",
  autoStart = true,
  loop = false,
  delay = 0,
  onComplete,
  onStart,
  className = "",
}: {
  value?: number;
  targetValue?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  format?: "number" | "currency" | "percentage" | "custom";
  customFormatter?: (num: number) => string;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "easeOutQuart" | "easeInQuart";
  autoStart?: boolean;
  loop?: boolean;
  delay?: number;
  onComplete?: () => void;
  onStart?: () => void;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const { announce } = useScreenReaderAnnouncements();

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
    easeInQuart: (t: number) => t * t * t * t,
  };

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
    
    const startValue = displayValue;
    const endValue = targetValue !== undefined ? targetValue : value || 0;
    const durationMs = duration;
    const startTime = Date.now();
    const easingFn = easingFunctions[easing];

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const easedProgress = easingFn(progress);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete?.();
        
        // Announce final value for screen readers
        const finalText = `${prefix}${formatValue(endValue)}${suffix}`;
        announce(`Counter reached ${finalText}`, "polite");

        // Handle looping
        if (loop && autoStart) {
          setTimeout(() => {
            setDisplayValue(startValue);
            setTimeout(() => animateValue(), 100);
          }, 1000);
        }
      }
    };

    if (delay > 0) {
      setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [value, targetValue, displayValue, duration, prefix, suffix, formatValue, isVisible, easing, delay, loop, autoStart, onStart, onComplete, announce]);

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
    if (isVisible && autoStart && !isAnimating) {
      animateValue();
    }
  }, [isVisible, autoStart, isAnimating, animateValue]);

  // Reset animation when target value changes
  useEffect(() => {
    if (targetValue !== undefined && isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animateValue();
    }
  }, [targetValue, isVisible, animateValue]);

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

// Progress bar with animation
export function AnimatedProgressBar({
  value,
  maxValue = 100,
  duration = 1500,
  color = "#00D9FF",
  backgroundColor = "#374151",
  height = 8,
  borderRadius = 4,
  showPercentage = true,
  showLabel = true,
  label,
  animated = true,
  delay = 0,
  onComplete,
  className = "",
}: {
  value: number;
  maxValue?: number;
  duration?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { announce } = useScreenReaderAnnouncements();

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

  useEffect(() => {
    if (isVisible && animated) {
      const targetProgress = Math.min((value / maxValue) * 100, 100);
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setProgress(targetProgress * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
          announce(`Progress completed: ${targetProgress.toFixed(1)}%`, "polite");
        }
      };

      if (delay > 0) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      } else {
        requestAnimationFrame(animate);
      }
    }
  }, [isVisible, animated, value, maxValue, duration, delay, onComplete, announce]);

  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <AccessibilityVisualization className={className}>
      <div ref={containerRef}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">{label || "Progress"}</span>
            {showPercentage && (
              <span className="text-sm font-bold" style={{ color }}>
                {percentage.toFixed(1)}%
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ 
              height: `${height}px`,
              backgroundColor,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ 
                backgroundColor: color,
                borderRadius: `${borderRadius}px`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: animated ? duration : 0, ease: "easeOut" }}
            />
          </div>
          
          {/* Animated glow effect */}
          {animated && (
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                width: "100px",
                borderRadius: `${borderRadius}px`,
              }}
              initial={{ x: -100 }}
              animate={{ x: 400 }}
              transition={{ 
                duration: duration * 1.5, 
                ease: "linear", 
                repeat: Infinity,
              }}
            />
          )}
        </div>
        
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Progress: {percentage.toFixed(1)}% complete
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Circular progress indicator
export function CircularProgress({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = "#00D9FF",
  backgroundColor = "#374151",
  animated = true,
  duration = 1500,
  showPercentage = true,
  showLabel = true,
  label,
  delay = 0,
  onComplete,
  className = "",
}: {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { announce } = useScreenReaderAnnouncements();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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

    const element = document.getElementById(`circular-progress-${Math.random().toString(36).substr(2, 9)}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && animated) {
      const targetProgress = Math.min((value / maxValue) * 100, 100);
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setProgress(targetProgress * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
          announce(`Circular progress completed: ${targetProgress.toFixed(1)}%`, "polite");
        }
      };

      if (delay > 0) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      } else {
        requestAnimationFrame(animate);
      }
    }
  }, [isVisible, animated, value, maxValue, duration, delay, onComplete, announce]);

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AccessibilityVisualization className={className}>
      <div className="flex flex-col items-center">
        <div 
          className="relative" 
          style={{ width: size, height: size }}
          id={`circular-progress-${Math.random().toString(36).substr(2, 9)}`}
        >
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
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: animated ? duration : 0, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showPercentage && (
              <div className="text-2xl font-bold" style={{ color }}>
                {progress.toFixed(1)}%
              </div>
            )}
            {showLabel && (
              <div className="text-sm text-gray-400 mt-1 text-center px-2">
                {label}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Multi-step progress indicator
export function StepProgress({
  steps,
  currentStep,
  animated = true,
  orientation = "horizontal",
  className = "",
}: {
  steps: { label: string; completed: boolean; }[];
  currentStep: number;
  animated?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const isVertical = orientation === "vertical";

  return (
    <AccessibilityVisualization className={className}>
      <div className={`flex ${isVertical ? "flex-col space-y-4" : "flex-row space-x-4"}`}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.completed || index < currentStep;
          
          return (
            <div
              key={index}
              className={`flex ${isVertical ? "items-start" : "items-center"} ${!isVertical && "flex-1"}`}
            >
              {/* Step indicator */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted
                    ? "bg-neon-green text-black"
                    : isActive
                    ? "bg-neon-blue text-black"
                    : "bg-gray-600 text-gray-300"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {isCompleted ? "✓" : index + 1}
              </motion.div>
              
              {/* Step label */}
              <div className={`ml-3 ${isVertical ? "mt-2" : ""}`}>
                <div className={`text-sm ${
                  isActive ? "text-white font-medium" : "text-gray-400"
                }`}>
                  {step.label}
                </div>
                
                {/* Progress line */}
                {!isVertical && index < steps.length - 1 && (
                  <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-neon-green rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AccessibilityVisualization>
  );
}

// Animated gauge meter
export function GaugeMeter({
  value,
  minValue = 0,
  maxValue = 100,
  size = 200,
  segments = 10,
  colors = ["#ef4444", "#f97316", "#fbbf24", "#22c55e"],
  animated = true,
  duration = 2000,
  showValue = true,
  showScale = true,
  label,
  unit = "",
  delay = 0,
  onComplete,
  className = "",
}: {
  value: number;
  minValue?: number;
  maxValue?: number;
  size?: number;
  segments?: number;
  colors?: string[];
  animated?: boolean;
  duration?: number;
  showValue?: boolean;
  showScale?: boolean;
  label?: string;
  unit?: string;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [currentValue, setCurrentValue] = useState(minValue);
  const [isVisible, setIsVisible] = useState(false);
  const { announce } = useScreenReaderAnnouncements();

  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  const angle = (percentage / 100) * 270 - 135; // -135 to 135 degrees

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

    const element = document.getElementById(`gauge-${Math.random().toString(36).substr(2, 9)}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && animated) {
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quart
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setCurrentValue(minValue + (value - minValue) * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete?.();
          announce(`Gauge meter reached ${value} ${unit}`, "polite");
        }
      };

      if (delay > 0) {
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, delay);
      } else {
        requestAnimationFrame(animate);
      }
    }
  }, [isVisible, animated, value, minValue, maxValue, duration, delay, onComplete, announce, unit]);

  const getColorForValue = (val: number) => {
    const percent = ((val - minValue) / (maxValue - minValue)) * 100;
    const colorIndex = Math.floor((percent / 100) * colors.length);
    return colors[Math.min(colorIndex, colors.length - 1)];
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="flex flex-col items-center" id={`gauge-${Math.random().toString(36).substr(2, 9)}`}>
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform"
          >
            {/* Background arc */}
            <path
              d={`M ${size/2} ${size/2} L ${size/2} 20 A ${size/2 - 20} ${size/2 - 20} 0 0 1 ${size - 20} ${size/2}`}
              fill="none"
              stroke="#374151"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Colored segments */}
            {Array.from({ length: segments }, (_, i) => {
              const segmentStart = -135 + (i * 270 / segments);
              const segmentEnd = -135 + ((i + 1) * 270 / segments);
              const segmentMid = segmentStart + (270 / segments / 2);
              const segmentValue = minValue + ((segmentMid + 135) / 270) * (maxValue - minValue);
              
              return (
                <path
                  key={i}
                  d={`M ${size/2} ${size/2} L ${size/2} 20 A ${size/2 - 20} ${size/2 - 20} 0 0 1 ${size - 20} ${size/2}`}
                  fill="none"
                  stroke={getColorForValue(segmentValue)}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${270 / segments} ${270 * (segments - 1) / segments}`}
                  strokeDashoffset={-135 + (i * 270 / segments)}
                  opacity={currentValue >= segmentValue ? 1 : 0.3}
                />
              );
            })}
            
            {/* Needle */}
            <motion.g
              initial={{ rotate: -135 }}
              animate={{ rotate: angle }}
              transition={{ duration: animated ? duration : 0, ease: "easeOut" }}
              style={{ transformOrigin: `${size/2}px ${size/2}px` }}
            >
              <line
                x1={size / 2}
                y1={size / 2}
                x2={size / 2}
                y2={size / 2 - 60}
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r="4"
                fill="#ffffff"
              />
            </motion.g>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
            {showValue && (
              <div className="text-3xl font-bold text-white">
                {currentValue.toFixed(1)}
                {unit && <span className="text-lg ml-1">{unit}</span>}
              </div>
            )}
            {label && (
              <div className="text-sm text-gray-400 mt-2 text-center px-4">
                {label}
              </div>
            )}
          </div>
        </div>
        
        {/* Scale */}
        {showScale && (
          <div className="flex justify-between w-full mt-4 px-4">
            <span className="text-xs text-gray-400">{minValue}</span>
            <span className="text-xs text-gray-400">{maxValue}</span>
          </div>
        )}
      </div>
    </AccessibilityVisualization>
  );
}

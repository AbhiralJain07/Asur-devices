"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactMetrics } from "../../types/impactMetrics";
import { CustomerTestimonial } from "../../types/testimonials";
import AccessibilityVisualization, { useScreenReaderAnnouncements, useKeyboardNavigation } from "./AccessibilityVisualization";

// Accessible metric display component
export function AccessibleMetricDisplay({
  metric,
  showTrend = true,
  showComparison = false,
  showTarget = false,
  className = "",
}: {
  metric: ImpactMetrics;
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { announce } = useScreenReaderAnnouncements();
  const { focusedIndex, containerRef } = useKeyboardNavigation();

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    announce(
      `${isExpanded ? "Collapsed" : "Expanded"} metric details for ${metric.title}`,
      "polite"
    );
  };

  const getTrendDescription = () => {
    switch (metric.trend) {
      case "up": return "increasing";
      case "down": return "decreasing";
      case "stable": return "stable";
      default: return "unknown";
    }
  };

  const getChangeDescription = () => {
    const direction = metric.change > 0 ? "increased by" : "decreased by";
    const absoluteChange = Math.abs(metric.change);
    return `${direction} ${absoluteChange}%`;
  };

  return (
    <AccessibilityVisualization className={className}>
      <motion.article
        className="glass rounded-lg border border-white/10 p-6 focus-within:border-neon-blue/50 transition-colors"
        tabIndex={0}
        role="article"
        aria-label={`Metric: ${metric.title}, Current value: ${metric.currentValue} ${metric.unit}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleExpand();
          }
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl" aria-hidden="true">{metric.icon}</div>
            <div>
              <h3 className="font-bold text-white">{metric.title}</h3>
              <p className="text-sm text-gray-400">{metric.description}</p>
            </div>
          </div>
          
          {showTrend && (
            <div 
              className="flex items-center gap-2"
              aria-label={`Trend: ${getTrendDescription()}, ${getChangeDescription()}`}
            >
              <span 
                className={`text-lg ${
                  metric.trend === "up" ? "text-green-500" :
                  metric.trend === "down" ? "text-red-500" : "text-yellow-500"
                }`}
                aria-hidden="true"
              >
                {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
              </span>
              <span className="text-sm font-medium">
                {metric.change > 0 ? "+" : ""}{metric.change}%
              </span>
            </div>
          )}
        </header>

        {/* Main metric value */}
        <div className="text-center mb-4">
          <div 
            className="text-4xl font-bold tabular-nums"
            aria-label={`Current value: ${metric.currentValue} ${metric.unit}`}
          >
            {metric.prefix}{metric.currentValue.toLocaleString()}{metric.suffix}
          </div>
          <div className="text-sm text-gray-400 mt-2">{metric.changePeriod}</div>
        </div>

        {/* Progress bar */}
        {showTarget && metric.targetValue && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">
                {Math.round((metric.currentValue / metric.targetValue) * 100)}%
              </span>
            </div>
            <div 
              className="w-full bg-gray-700 rounded-full h-2"
              role="progressbar"
              aria-valuenow={Math.round((metric.currentValue / metric.targetValue) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress towards target: ${Math.round((metric.currentValue / metric.targetValue) * 100)}%`}
            >
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  backgroundColor: metric.color,
                  width: `${Math.min((metric.currentValue / metric.targetValue) * 100, 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Current: {metric.currentValue}</span>
              <span>Target: {metric.targetValue}</span>
            </div>
          </div>
        )}

        {/* Expandable details */}
        <div>
          <button
            onClick={handleExpand}
            className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neon-blue/50 rounded px-2 py-1"
            aria-expanded={isExpanded}
            aria-controls={`metric-details-${metric.id}`}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id={`metric-details-${metric.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Last updated:</span>
                    <span className="ml-2 text-white">
                      {new Date(metric.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {metric.sources && metric.sources.length > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-400">Data source:</span>
                      <span className="ml-2 text-white">
                        {metric.sources[0].name} ({metric.sources[0].reliability}% reliable)
                      </span>
                    </div>
                  )}
                  
                  {showComparison && metric.comparisons && metric.comparisons.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Comparisons</h4>
                      <div className="space-y-1">
                        {metric.comparisons.map((comparison, index) => (
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    </AccessibilityVisualization>
  );
}

// Accessible testimonial card component
export function AccessibleTestimonialCard({
  testimonial,
  variant = "default",
  className = "",
}: {
  testimonial: CustomerTestimonial;
  variant?: "compact" | "default" | "detailed";
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { announce } = useScreenReaderAnnouncements();

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    announce(
      `${isExpanded ? "Collapsed" : "Expanded"} testimonial from ${testimonial.customer.name}`,
      "polite"
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-500" : "text-gray-600"
        }`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  const getRatingDescription = () => {
    const rating = testimonial.rating.overall;
    if (rating === 5) return "excellent";
    if (rating === 4) return "very good";
    if (rating === 3) return "good";
    if (rating === 2) return "fair";
    return "poor";
  };

  return (
    <AccessibilityVisualization className={className}>
      <motion.article
        className="glass rounded-lg border border-white/10 overflow-hidden focus-within:border-neon-blue/50 transition-colors"
        tabIndex={0}
        role="article"
        aria-label={`Testimonial from ${testimonial.customer.name}, ${testimonial.customer.title} at ${testimonial.customer.company.name}. Rating: ${testimonial.rating.overall} out of 5 stars, ${getRatingDescription()}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleExpand();
          }
        }}
      >
        {/* Header */}
        <header className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {testimonial.customer.avatar && (
                <img
                  src={testimonial.customer.avatar.url}
                  alt={testimonial.customer.avatar.alt}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {testimonial.customer.name}
                </h3>
                <p className="text-gray-300 mb-1">{testimonial.customer.title}</p>
                <div className="flex items-center gap-2">
                  {testimonial.customer.company.logo && (
                    <img
                      src={testimonial.customer.company.logo}
                      alt={testimonial.customer.company.name}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                  <span className="text-sm text-gray-400">
                    {testimonial.customer.company.name}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                {renderStars(testimonial.rating.overall)}
              </div>
              <div className="text-sm text-gray-400">
                {testimonial.rating.verified && "✓ Verified"}
              </div>
            </div>
          </div>

          {/* Testimonial content */}
          <blockquote className="text-gray-300 leading-relaxed">
            "{testimonial.testimonial.quote}"
          </blockquote>
          
          {testimonial.testimonial.summary && (
            <p className="text-sm text-gray-400 mt-3">
              {testimonial.testimonial.summary}
            </p>
          )}
        </header>

        {/* Results */}
        {testimonial.testimonial.results.length > 0 && (
          <section className="p-6 border-b border-white/10">
            <h4 className="font-bold text-white mb-4">Key Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonial.testimonial.results.slice(0, 4).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  role="group"
                  aria-label={`${result.metric}: ${result.value} ${result.unit}, ${result.improvement > 0 ? "improvement" : "decline"} of ${Math.abs(result.improvement)}% over ${result.timeframe}`}
                >
                  <div>
                    <div className="text-sm text-gray-400">{result.metric}</div>
                    <div className="font-bold text-white">
                      {result.value} {result.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      result.improvement > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {result.improvement > 0 ? "+" : ""}{result.improvement}%
                    </div>
                    <div className="text-xs text-gray-400">{result.timeframe}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-4">
              {testimonial.testimonial.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {testimonial.testimonial.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
              {testimonial.media.case_study && (
                <button 
                  className="text-sm text-neon-blue hover:text-neon-blue/80 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 rounded px-2 py-1"
                  onClick={() => announce("Opening case study", "polite")}
                >
                  View Case Study →
                </button>
              )}
            </div>
          </div>
        </footer>
      </motion.article>
    </AccessibilityVisualization>
  );
}

// Accessible data table component
export function AccessibleDataTable({
  data,
  columns,
  caption,
  className = "",
}: {
  data: Record<string, any>[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  caption: string;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="overflow-x-auto">
        <table 
          className="w-full glass rounded-lg border border-white/10 overflow-hidden"
          role="table"
          aria-label={caption}
        >
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-white border-b border-white/10"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index}
                className="hover:bg-white/5 transition-colors"
                role="row"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-300 border-b border-white/10"
                  >
                    {column.format ? column.format(row[column.key]) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccessibilityVisualization>
  );
}

// Accessible progress indicator component
export function AccessibleProgressIndicator({
  value,
  maxValue = 100,
  label,
  showPercentage = true,
  color = "#00D9FF",
  className = "",
}: {
  value: number;
  maxValue?: number;
  label: string;
  showPercentage?: boolean;
  color?: string;
  className?: string;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <AccessibilityVisualization className={className}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
          )}
        </div>
        <div
          className="w-full bg-gray-700 rounded-full h-3"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${percentage.toFixed(1)}% complete`}
        >
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ backgroundColor: color, width: `${percentage}%` }}
          />
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Accessible live region component for announcements
export function AccessibleLiveRegion({
  announcements,
  className = "",
}: {
  announcements: { message: string; priority: "polite" | "assertive" }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {announcements.map((announcement, index) => (
        <div
          key={index}
          aria-live={announcement.priority}
          aria-atomic="true"
          className="sr-only"
        >
          {announcement.message}
        </div>
      ))}
    </div>
  );
}

// Accessible skip link component
export function AccessibleSkipLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neon-blue text-black px-4 py-2 rounded font-medium z-50 ${className}`}
    >
      {label}
    </a>
  );
}

// Accessible focus management hook
export function useAccessibleFocus() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const setFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      setFocusedElement(element);
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { focusedElement, setFocus, trapFocus };
}

// Accessible color contrast checker
export const checkColorContrast = (foreground: string, background: string): boolean => {
  // Simple contrast check - in production, use a proper contrast calculation library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [R, G, B] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return contrast >= 4.5; // WCAG AA standard
};

// Accessible metric summary component
export function AccessibleMetricSummary({
  metrics,
  className = "",
}: {
  metrics: ImpactMetrics[];
  className?: string;
}) {
  const totalMetrics = metrics.length;
  const positiveTrends = metrics.filter(m => m.trend === "up").length;
  const averageChange = metrics.reduce((sum, m) => sum + Math.abs(m.change), 0) / metrics.length;

  const summaryText = `Summary of ${totalMetrics} metrics: ${positiveTrends} showing positive trends, average change of ${averageChange.toFixed(1)}%`;

  return (
    <AccessibilityVisualization className={className}>
      <section
        className="glass rounded-lg border border-white/10 p-6"
        aria-label="Metrics Summary"
      >
        <h2 className="text-xl font-bold text-white mb-4">Metrics Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-blue">{totalMetrics}</div>
            <div className="text-sm text-gray-400">Total Metrics</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-green">{positiveTrends}</div>
            <div className="text-sm text-gray-400">Positive Trends</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{averageChange.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Average Change</div>
          </div>
        </div>

        {/* Screen reader only summary */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {summaryText}
        </div>
      </section>
    </AccessibilityVisualization>
  );
}

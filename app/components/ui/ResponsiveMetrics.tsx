"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImpactMetrics, MetricCategory } from "../../types/impactMetrics";
import { CustomerTestimonial } from "../../types/testimonials";
import { AnimatedNumberCounter, AnimatedProgressBar, CircularProgress } from "./AnimatedCounter";
import { ResponsiveVisualization, useScreenSize } from "./ResponsiveVisualization";
import { AccessibilityVisualization } from "./AccessibilityVisualization";

// Responsive metric card component
export function ResponsiveMetricCard({
  metric,
  variant = "default",
  className = "",
}: {
  metric: ImpactMetrics;
  variant?: "compact" | "default" | "detailed";
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getVariantForScreen = () => {
    if (breakpoint === "xs") return "compact";
    if (breakpoint === "sm") return "compact";
    if (breakpoint === "md") return "default";
    return variant;
  };

  const currentVariant = getVariantForScreen();

  if (currentVariant === "compact") {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass rounded-lg border border-white/10 p-3 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-lg">{metric.icon}</div>
              <span className="text-sm font-medium text-white truncate">{metric.title}</span>
            </div>
            <div className="text-xs text-gray-400">{metric.unit}</div>
          </div>
          
          <AnimatedNumberCounter
            value={metric.currentValue}
            duration={1000}
            precision={metric.precision}
            format={metric.format}
            customFormatter={metric.customFormatter}
            className="text-xl font-bold"
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

  if (currentVariant === "detailed") {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass rounded-lg border border-white/10 p-6 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{metric.icon}</div>
              <div>
                <h3 className="font-bold text-white">{metric.title}</h3>
                <p className="text-sm text-gray-400">{metric.description}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${
              metric.trend === "up" ? "text-green-500" :
              metric.trend === "down" ? "text-red-500" : "text-yellow-500"
            }`}>
              <span className="text-lg">
                {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
              </span>
              <span className="text-sm font-medium">
                {metric.change > 0 ? "+" : ""}{metric.change}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Value</div>
              <AnimatedNumberCounter
                value={metric.currentValue}
                duration={1500}
                prefix={metric.prefix}
                suffix={metric.suffix}
                precision={metric.precision}
                format={metric.format}
                customFormatter={metric.customFormatter}
                className="text-2xl font-bold"
              />
            </div>
            
            {metric.targetValue && (
              <div>
                <div className="text-sm text-gray-400 mb-1">Target</div>
                <div className="text-2xl font-bold" style={{ color: metric.color }}>
                  {metric.prefix}{metric.targetValue.toLocaleString()}{metric.suffix}
                </div>
              </div>
            )}
          </div>

          {metric.targetValue && (
            <div className="mt-4">
              <AnimatedProgressBar
                value={metric.currentValue}
                maxValue={metric.targetValue}
                color={metric.color}
                showPercentage={true}
                showLabel={false}
                height={6}
              />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{metric.changePeriod}</span>
              <span>Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  // Default variant
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass rounded-lg border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-xl">{metric.icon}</div>
            <div>
              <h3 className="font-bold text-white">{metric.title}</h3>
              <p className="text-xs text-gray-400">{metric.description}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${
            metric.trend === "up" ? "text-green-500" :
            metric.trend === "down" ? "text-red-500" : "text-yellow-500"
          }`}>
            <span className="text-sm">
              {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
            </span>
            <span className="text-xs font-medium">
              {metric.change > 0 ? "+" : ""}{metric.change}%
            </span>
          </div>
        </div>

        <div className="text-center mb-3">
          <AnimatedNumberCounter
            value={metric.currentValue}
            duration={1500}
            prefix={metric.prefix}
            suffix={metric.suffix}
            precision={metric.precision}
            format={metric.format}
            customFormatter={metric.customFormatter}
            className="text-2xl font-bold"
          />
        </div>

        {metric.targetValue && (
          <div className="mb-3">
            <AnimatedProgressBar
              value={metric.currentValue}
              maxValue={metric.targetValue}
              color={metric.color}
              showPercentage={true}
              showLabel={false}
              height={4}
            />
          </div>
        )}

        <div className="flex justify-between text-xs text-gray-400">
          <span>{metric.changePeriod}</span>
          {metric.targetValue && (
            <span>{Math.round((metric.currentValue / metric.targetValue) * 100)}% of target</span>
          )}
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Responsive metric grid component
export function ResponsiveMetricGrid({
  metrics,
  maxColumns = 4,
  className = "",
}: {
  metrics: ImpactMetrics[];
  maxColumns?: number;
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getColumnsForScreen = () => {
    switch (breakpoint) {
      case "xs": return 1;
      case "sm": return 2;
      case "md": return Math.min(3, maxColumns);
      case "lg": return Math.min(4, maxColumns);
      case "xl": return Math.min(4, maxColumns);
      case "2xl": return maxColumns;
      default: return 2;
    }
  };

  const columns = getColumnsForScreen();
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns] || "grid-cols-1";

  return (
    <ResponsiveVisualization className={className}>
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ResponsiveMetricCard metric={metric} />
          </motion.div>
        ))}
      </div>
    </ResponsiveVisualization>
  );
}

// Responsive testimonial card component
export function ResponsiveTestimonialCard({
  testimonial,
  variant = "default",
  className = "",
}: {
  testimonial: CustomerTestimonial;
  variant?: "compact" | "default" | "detailed";
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getVariantForScreen = () => {
    if (breakpoint === "xs") return "compact";
    if (breakpoint === "sm") return "compact";
    if (breakpoint === "md") return "default";
    return variant;
  };

  const currentVariant = getVariantForScreen();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-500" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  if (currentVariant === "compact") {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass rounded-lg border border-white/10 p-3 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-start gap-3">
            {testimonial.customer.avatar && (
              <img
                src={testimonial.customer.avatar.url}
                alt={testimonial.customer.avatar.alt}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm truncate">
                    {testimonial.customer.name}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {testimonial.customer.company.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(testimonial.rating.overall)}
                </div>
              </div>
              <blockquote className="text-gray-300 text-xs line-clamp-2">
                "{testimonial.testimonial.quote}"
              </blockquote>
            </div>
          </div>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  if (currentVariant === "detailed") {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {testimonial.customer.avatar && (
                  <img
                    src={testimonial.customer.avatar.url}
                    alt={testimonial.customer.avatar.alt}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {testimonial.customer.name}
                  </h3>
                  <p className="text-gray-300 mb-1">{testimonial.customer.title}</p>
                  <div className="flex items-center gap-2">
                    {testimonial.customer.company.logo && (
                      <img
                        src={testimonial.customer.company.logo}
                        alt={testimonial.customer.company.name}
                        className="w-4 h-4 object-contain"
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
                <div className="text-xs text-gray-400">
                  {testimonial.rating.verified && "✓ Verified"}
                </div>
              </div>
            </div>

            <blockquote className="text-gray-300 leading-relaxed mb-4">
              "{testimonial.testimonial.quote}"
            </blockquote>

            {testimonial.testimonial.results.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-white mb-3">Key Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {testimonial.testimonial.results.slice(0, 4).map((result, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400">{result.metric}</div>
                          <div className="font-bold text-white text-sm">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                {testimonial.media.case_study && (
                  <span className="text-neon-blue hover:text-neon-blue/80 cursor-pointer">
                    View Case Study →
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  // Default variant
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="glass rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all"
      >
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {testimonial.customer.avatar && (
                <img
                  src={testimonial.customer.avatar.url}
                  alt={testimonial.customer.avatar.alt}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">
                  {testimonial.customer.name}
                </h3>
                <p className="text-gray-300 mb-1">{testimonial.customer.title}</p>
                <div className="flex items-center gap-2">
                  {testimonial.customer.company.logo && (
                    <img
                      src={testimonial.customer.company.logo}
                      alt={testimonial.customer.company.name}
                      className="w-4 h-4 object-contain"
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
              <div className="text-xs text-gray-400">
                {testimonial.rating.verified && "✓ Verified"}
              </div>
            </div>
          </div>

          <blockquote className="text-gray-300 leading-relaxed mb-4">
            "{testimonial.testimonial.quote}"
          </blockquote>

          {testimonial.testimonial.results.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonial.testimonial.results.slice(0, 2).map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <div>
                      <div className="text-xs text-gray-400">{result.metric}</div>
                      <div className="font-bold text-white text-sm">
                        {result.value} {result.unit}
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${
                      result.improvement > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {result.improvement > 0 ? "+" : ""}{result.improvement}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
              {testimonial.media.case_study && (
                <span className="text-neon-blue hover:text-neon-blue/80 cursor-pointer">
                  Case Study →
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Responsive testimonial grid component
export function ResponsiveTestimonialGrid({
  testimonials,
  maxColumns = 3,
  className = "",
}: {
  testimonials: CustomerTestimonial[];
  maxColumns?: number;
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getColumnsForScreen = () => {
    switch (breakpoint) {
      case "xs": return 1;
      case "sm": return 1;
      case "md": return 2;
      case "lg": return Math.min(3, maxColumns);
      case "xl": return Math.min(3, maxColumns);
      case "2xl": return maxColumns;
      default: return 1;
    }
  };

  const columns = getColumnsForScreen();
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns] || "grid-cols-1";

  return (
    <ResponsiveVisualization className={className}>
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ResponsiveTestimonialCard testimonial={testimonial} />
          </motion.div>
        ))}
      </div>
    </ResponsiveVisualization>
  );
}

// Responsive stats component
export function ResponsiveStats({
  stats,
  className = "",
}: {
  stats: { label: string; value: number; prefix?: string; suffix?: string; color?: string }[];
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getLayoutForScreen = () => {
    switch (breakpoint) {
      case "xs": return "grid-cols-2";
      case "sm": return "grid-cols-2";
      case "md": return "grid-cols-4";
      default: return "grid-cols-4";
    }
  };

  const gridCols = getLayoutForScreen();

  return (
    <ResponsiveVisualization className={className}>
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <AnimatedNumberCounter
              value={stat.value}
              duration={2000}
              prefix={stat.prefix}
              suffix={stat.suffix}
              precision={0}
              className={`text-2xl md:text-3xl font-bold ${stat.color ? `text-[${stat.color}]` : "text-neon-blue"}`}
            />
            <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </ResponsiveVisualization>
  );
}

// Responsive progress section component
export function ResponsiveProgressSection({
  metrics,
  className = "",
}: {
  metrics: ImpactMetrics[];
  className?: string;
}) {
  const { screenSize, breakpoint } = useScreenSize();

  const getLayoutForScreen = () => {
    switch (breakpoint) {
      case "xs": return "grid-cols-1";
      case "sm": return "grid-cols-1";
      case "md": return "grid-cols-2";
      case "lg": return "grid-cols-3";
      default: return "grid-cols-3";
    }
  };

  const gridCols = getLayoutForScreen();

  const metricsWithTargets = metrics.filter(m => m.targetValue);

  return (
    <ResponsiveVisualization className={className}>
      <div className={`grid ${gridCols} gap-4 md:gap-6`}>
        {metricsWithTargets.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <CircularProgress
              value={metric.currentValue}
              maxValue={metric.targetValue}
              size={breakpoint === "xs" ? 100 : breakpoint === "sm" ? 120 : 140}
              color={metric.color}
              showPercentage={true}
              showLabel={true}
              label={metric.title}
            />
          </motion.div>
        ))}
      </div>
    </ResponsiveVisualization>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChartData, ChartConfig, Dataset, AnimationConfig, InteractionConfig } from "../../types/problemVisualization";

// Base chart component interface
interface BaseChartProps {
  data: ChartData;
  config: ChartConfig;
  animationConfig?: AnimationConfig;
  interactionConfig?: InteractionConfig;
  width?: number;
  height?: number;
  className?: string;
  onDataPointClick?: (label: string, value: number, datasetIndex: number) => void;
}

// Line Chart Component
export function LineChart({
  data,
  config,
  animationConfig = { duration: 1000, easing: "easeOut", delay: 0, repeat: false, repeatDelay: 0 },
  interactionConfig = { hover: { enabled: true, highlightColor: "#00D9FF", tooltipDelay: 100 }, click: { enabled: false, action: "details" }, zoom: { enabled: false, min: 0.5, max: 2 } },
  width = 400,
  height = 300,
  className = "",
  onDataPointClick,
}: BaseChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number; datasetIndex: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationConfig.duration + animationConfig.delay);
    return () => clearTimeout(timer);
  }, [animationConfig.duration, animationConfig.delay]);

  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  const xStep = width / (data.labels.length - 1);
  const yScale = height / maxValue;

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid lines */}
        {config.scales?.y?.grid.display && (
          <g className="opacity-20">
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1={(height / 4) * i}
                x2={width}
                y2={(height / 4) * i}
                stroke={config.scales.y.grid.color || "#374151"}
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Datasets */}
        {data.datasets.map((dataset, datasetIndex) => (
          <g key={datasetIndex}>
            {/* Line */}
            <motion.path
              d={`M ${data.labels.map((_, i) => `${i * xStep},${height - dataset.data[i] * yScale}`).join(" L ")}`}
              fill="none"
              stroke={Array.isArray(dataset.borderColor) ? dataset.borderColor[0] : (dataset.borderColor || `hsl(${200 + datasetIndex * 60}, 70%, 50%)`)}
              strokeWidth={dataset.borderWidth || 2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isAnimating ? 1 : 1 }}
              transition={{
                duration: animationConfig.duration / 1000,
                ease: animationConfig.easing,
                delay: animationConfig.delay / 1000 + datasetIndex * 0.1,
              }}
            />

            {/* Data points */}
            {data.labels.map((label, i) => (
              <motion.circle
                key={i}
                cx={i * xStep}
                cy={height - dataset.data[i] * yScale}
                r={hoveredPoint?.label === label && hoveredPoint?.datasetIndex === datasetIndex ? 6 : 4}
                fill={Array.isArray(dataset.borderColor) ? dataset.borderColor[0] : (dataset.borderColor || `hsl(${200 + datasetIndex * 60}, 70%, 50%)`)}
                initial={{ scale: 0 }}
                animate={{ scale: isAnimating ? 1 : 1 }}
                transition={{
                  duration: animationConfig.duration / 1000,
                  ease: animationConfig.easing,
                  delay: animationConfig.delay / 1000 + datasetIndex * 0.1 + i * 0.05,
                }}
                onMouseEnter={() => {
                  if (interactionConfig.hover.enabled) {
                    setHoveredPoint({ label, value: dataset.data[i], datasetIndex });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => {
                  if (interactionConfig.click.enabled && onDataPointClick) {
                    onDataPointClick(label, dataset.data[i], datasetIndex);
                  }
                }}
                className="cursor-pointer"
              />
            ))}

            {/* Fill area */}
            {dataset.fill && (
              <motion.path
                d={`M ${data.labels.map((_, i) => `${i * xStep},${height - dataset.data[i] * yScale}`).join(" L ")} L ${width},${height} L 0,${height} Z`}
                fill={Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : (dataset.backgroundColor || `hsla(${200 + datasetIndex * 60}, 70%, 50%, 0.1)`)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: animationConfig.duration / 1000,
                  ease: animationConfig.easing,
                  delay: animationConfig.delay / 1000 + datasetIndex * 0.1,
                }}
              />
            )}
          </g>
        ))}

        {/* Labels */}
        {config.scales?.x?.display && (
          <g className="text-xs fill-gray-400">
            {data.labels.map((label, i) => (
              <text
                key={i}
                x={i * xStep}
                y={height + 20}
                textAnchor="middle"
                className="select-none"
              >
                {label}
              </text>
            ))}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && interactionConfig.hover.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-3 py-2 glass rounded-lg border border-neon-blue/30 text-sm"
          style={{
            left: `${(data.labels.indexOf(hoveredPoint.label) / data.labels.length) * width}px`,
            top: `${height - hoveredPoint.value * yScale - 40}px`,
          }}
        >
          <div className="font-bold text-neon-blue">{hoveredPoint.label}</div>
          <div className="text-gray-300">Value: {hoveredPoint.value}</div>
        </motion.div>
      )}
    </div>
  );
}

// Bar Chart Component
export function BarChart({
  data,
  config,
  animationConfig = { duration: 1000, easing: "easeOut", delay: 0, repeat: false, repeatDelay: 0 },
  interactionConfig = { hover: { enabled: true, highlightColor: "#00D9FF", tooltipDelay: 100 }, click: { enabled: false, action: "details" }, zoom: { enabled: false, min: 0.5, max: 2 } },
  width = 400,
  height = 300,
  className = "",
  onDataPointClick,
}: BaseChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ label: string; value: number; datasetIndex: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationConfig.duration + animationConfig.delay);
    return () => clearTimeout(timer);
  }, [animationConfig.duration, animationConfig.delay]);

  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  const barWidth = width / (data.labels.length * data.datasets.length);
  const groupWidth = barWidth * data.datasets.length;
  const yScale = height / maxValue;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid lines */}
        {config.scales?.y?.grid.display && (
          <g className="opacity-20">
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1={(height / 4) * i}
                x2={width}
                y2={(height / 4) * i}
                stroke={config.scales.y.grid.color || "#374151"}
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Bars */}
        {data.labels.map((label, labelIndex) =>
          data.datasets.map((dataset, datasetIndex) => (
            <motion.rect
              key={`${labelIndex}-${datasetIndex}`}
              x={labelIndex * groupWidth + datasetIndex * barWidth}
              y={height - dataset.data[labelIndex] * yScale}
              width={barWidth * 0.8}
              height={dataset.data[labelIndex] * yScale}
              fill={hoveredBar?.label === label && hoveredBar?.datasetIndex === datasetIndex 
                ? interactionConfig.hover.highlightColor 
                : (Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor || `hsl(${200 + datasetIndex * 60}, 70%, 50%)`)}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isAnimating ? 1 : 1 }}
              transition={{
                duration: animationConfig.duration / 1000,
                ease: animationConfig.easing,
                delay: animationConfig.delay / 1000 + labelIndex * 0.05 + datasetIndex * 0.02,
              }}
              onMouseEnter={() => {
                if (interactionConfig.hover.enabled) {
                  setHoveredBar({ label, value: dataset.data[labelIndex], datasetIndex });
                }
              }}
              onMouseLeave={() => setHoveredBar(null)}
              onClick={() => {
                if (interactionConfig.click.enabled && onDataPointClick) {
                  onDataPointClick(label, dataset.data[labelIndex], datasetIndex);
                }
              }}
              className="cursor-pointer"
              style={{ transformOrigin: "bottom" }}
            />
          ))
        )}

        {/* Labels */}
        {config.scales?.x?.display && (
          <g className="text-xs fill-gray-400">
            {data.labels.map((label, i) => (
              <text
                key={i}
                x={i * groupWidth + groupWidth / 2}
                y={height + 20}
                textAnchor="middle"
                className="select-none"
              >
                {label}
              </text>
            ))}
          </g>
        )}
      </svg>

      {/* Tooltip */}
      {hoveredBar && interactionConfig.hover.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-3 py-2 glass rounded-lg border border-neon-blue/30 text-sm"
          style={{
            left: `${(data.labels.indexOf(hoveredBar.label) / data.labels.length) * width + groupWidth / 2}px`,
            top: `${height - hoveredBar.value * yScale - 40}px`,
          }}
        >
          <div className="font-bold text-neon-blue">{hoveredBar.label}</div>
          <div className="text-gray-300">Value: {hoveredBar.value}</div>
        </motion.div>
      )}
    </div>
  );
}

// Pie Chart Component
export function PieChart({
  data,
  config,
  animationConfig = { duration: 1000, easing: "easeOut", delay: 0, repeat: false, repeatDelay: 0 },
  interactionConfig = { hover: { enabled: true, highlightColor: "#00D9FF", tooltipDelay: 100 }, click: { enabled: false, action: "details" }, zoom: { enabled: false, min: 0.5, max: 2 } },
  width = 300,
  height = 300,
  className = "",
  onDataPointClick,
}: BaseChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<{ label: string; value: number; percentage: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationConfig.duration + animationConfig.delay);
    return () => clearTimeout(timer);
  }, [animationConfig.duration, animationConfig.delay]);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;
  
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  let currentAngle = -Math.PI / 2;

  const slices = data.labels.map((label, i) => {
    const value = data.datasets[0].data[i];
    const percentage = (value / total) * 100;
    const angle = (value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      label,
      value,
      percentage,
      startAngle,
      endAngle,
      color: data.datasets[0].backgroundColor?.[i] || `hsl(${(360 / data.labels.length) * i}, 70%, 50%)`,
    };
  });

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Pie slices */}
        {slices.map((slice, i) => {
          const x1 = centerX + Math.cos(slice.startAngle) * radius;
          const y1 = centerY + Math.sin(slice.startAngle) * radius;
          const x2 = centerX + Math.cos(slice.endAngle) * radius;
          const y2 = centerY + Math.sin(slice.endAngle) * radius;
          const largeArcFlag = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;

          return (
            <motion.path
              key={i}
              d={`M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`}
              fill={hoveredSlice?.label === slice.label ? interactionConfig.hover.highlightColor : slice.color}
              initial={{ scale: 0 }}
              animate={{ scale: isAnimating ? 1 : 1 }}
              transition={{
                duration: animationConfig.duration / 1000,
                ease: animationConfig.easing,
                delay: animationConfig.delay / 1000 + i * 0.05,
              }}
              onMouseEnter={() => {
                if (interactionConfig.hover.enabled) {
                  setHoveredSlice({ label: slice.label, value: slice.value, percentage: slice.percentage });
                }
              }}
              onMouseLeave={() => setHoveredSlice(null)}
              onClick={() => {
                if (interactionConfig.click.enabled && onDataPointClick) {
                  onDataPointClick(slice.label, slice.value, 0);
                }
              }}
              className="cursor-pointer"
              style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            />
          );
        })}

        {/* Center circle (for donut chart effect) */}
        <circle
          cx={centerX}
          cy={centerY}
          radius={radius * 0.6}
          fill="#0A0A0F"
        />
      </svg>

      {/* Tooltip */}
      {hoveredSlice && interactionConfig.hover.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-3 py-2 glass rounded-lg border border-neon-blue/30 text-sm"
          style={{
            left: `${centerX}px`,
            top: `${centerY - radius - 60}px`,
          }}
        >
          <div className="font-bold text-neon-blue">{hoveredSlice.label}</div>
          <div className="text-gray-300">Value: {hoveredSlice.value}</div>
          <div className="text-gray-300">Percentage: {hoveredSlice.percentage.toFixed(1)}%</div>
        </motion.div>
      )}
    </div>
  );
}

// Progress Bar Component
export function ProgressBar({
  value,
  max = 100,
  label,
  color = "#00D9FF",
  size = "medium",
  animated = true,
  showPercentage = true,
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  animated?: boolean;
  showPercentage?: boolean;
}) {
  const percentage = (value / max) * 100;
  const sizeClasses = {
    small: "h-2",
    medium: "h-4",
    large: "h-6",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold" style={{ color }}>
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1 : 0,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}

// Metric Card Component
export function MetricCard({
  title,
  value,
  unit,
  trend,
  change,
  color = "#00D9FF",
  size = "medium",
}: {
  title: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change?: number;
  color?: string;
  size?: "small" | "medium" | "large";
}) {
  const sizeClasses = {
    small: "p-3",
    medium: "p-4",
    large: "p-6",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  const trendColors = {
    up: "text-neon-green",
    down: "text-red-500",
    stable: "text-gray-400",
  };

  return (
    <div className={`glass rounded-lg border border-white/10 ${sizeClasses[size]}`}>
      <div className="space-y-2">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold" style={{ color }}>
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">{unit}</div>
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${trendColors[trend]}`}>
              {trendIcons[trend]} {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}

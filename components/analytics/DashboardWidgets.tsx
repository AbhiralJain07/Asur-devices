"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DashboardWidget, 
  DashboardMetrics, 
  MetricType, 
  MetricDefinition,
  WidgetSettings 
} from "../../types/dashboard";
import { LineChart, BarChart, PieChart, MetricCard, ProgressBar } from "../ui/Charts";
import { ResponsiveVisualization, ResponsiveGrid, ResponsiveMetricsGrid } from "../ui/ResponsiveVisualization";
import { AccessibilityVisualization, AccessibleProgress, AccessibleMetricCard } from "../ui/AccessibilityVisualization";

// Metric definitions for dashboard
const metricDefinitions: MetricDefinition[] = [
  {
    key: "traffic",
    label: "Traffic Flow",
    unit: "km/h",
    type: "gauge",
    category: "traffic",
    icon: "🚗",
    color: "#00D9FF",
    target: 60,
    thresholds: { good: 50, warning: 30, critical: 20 }
  },
  {
    key: "pollution",
    label: "Air Quality",
    unit: "AQI",
    type: "trend",
    category: "pollution",
    icon: "🌫️",
    color: "#00FF88",
    target: 50,
    thresholds: { good: 50, warning: 100, critical: 150 }
  },
  {
    key: "waste",
    label: "Waste Management",
    unit: "%",
    type: "counter",
    category: "waste",
    icon: "🗑️",
    color: "#fbbf24",
    target: 80,
    thresholds: { good: 80, warning: 60, critical: 40 }
  },
  {
    key: "energy",
    label: "Energy Efficiency",
    unit: "%",
    type: "gauge",
    category: "energy",
    icon: "⚡",
    color: "#9D4EDD",
    target: 75,
    thresholds: { good: 75, warning: 50, critical: 30 }
  },
  {
    key: "publicSafety",
    label: "Public Safety",
    unit: "count",
    type: "trend",
    category: "public_safety",
    icon: "🛡️",
    color: "#ef4444",
    target: 95,
    thresholds: { good: 90, warning: 70, critical: 50 }
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    unit: "%",
    type: "counter",
    category: "infrastructure",
    icon: "🏗️",
    color: "#f97316",
    target: 85,
    thresholds: { good: 85, warning: 65, critical: 45 }
  },
  {
    key: "citizenSatisfaction",
    label: "Citizen Satisfaction",
    unit: "%",
    type: "trend",
    category: "citizen_satisfaction",
    icon: "😊",
    color: "#22c55e",
    target: 90,
    thresholds: { good: 85, warning: 70, critical: 50 }
  }
];

// Metric card widget
export function MetricCardWidget({ 
  widget, 
  metrics, 
  onSettingsChange 
}: {
  widget: DashboardWidget;
  metrics: DashboardMetrics | null;
  onSettingsChange?: (settings: WidgetSettings) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const metricDef = metricDefinitions.find(m => widget.metrics.includes(m.category));

  if (!metrics || !metricDef) return null;

  const getMetricValue = () => {
    switch (metricDef.category) {
      case "traffic": return metrics.traffic.averageSpeed;
      case "pollution": return metrics.pollution.airQualityIndex;
      case "waste": return metrics.waste.collectionEfficiency;
      case "energy": return metrics.energy.efficiency;
      case "public_safety": return metrics.publicSafety.publicSafetyIndex;
      case "infrastructure": return metrics.infrastructure.roadCondition;
      case "citizen_satisfaction": return metrics.citizenSatisfaction.overallSatisfaction;
      default: return 0;
    }
  };

  const getTrend = () => {
    // Simulate trend calculation
    const trends = ["up", "down", "stable"] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getChange = () => {
    return Math.floor(Math.random() * 20) - 10; // -10 to 10
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-lg border border-white/10 overflow-hidden ${
        widget.size === "small" ? "p-4" : widget.size === "medium" ? "p-6" : "p-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{metricDef.icon}</div>
          <div>
            <h3 className="font-bold text-white">{widget.title}</h3>
            <div className="text-sm text-gray-400">{metricDef.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      <AccessibleMetricCard
        title={metricDef.label}
        value={getMetricValue()}
        unit={metricDef.unit}
        trend={getTrend()}
        change={getChange()}
        color={metricDef.color}
      />

      {isExpanded && widget.settings.showTrends && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target</span>
              <span style={{ color: metricDef.color }}>
                {metricDef.target} {metricDef.unit}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-green-500">Good</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-gray-300">2 min ago</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Chart widget
export function ChartWidget({ 
  widget, 
  metrics, 
  onSettingsChange 
}: {
  widget: DashboardWidget;
  metrics: DashboardMetrics | null;
  onSettingsChange?: (settings: WidgetSettings) => void;
}) {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metrics) return null;

  // Generate chart data based on widget metrics
  const generateChartData = () => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const datasets = widget.metrics.map((metricType, index) => {
      const metricDef = metricDefinitions.find(m => m.category === metricType);
      const color = metricDef?.color || "#00D9FF";
      
      return {
        label: metricDef?.label || metricType,
        data: labels.map(() => Math.random() * 100),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      };
    });

    return { labels, datasets };
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-lg border border-white/10 overflow-hidden ${
        widget.size === "small" ? "p-4" : widget.size === "medium" ? "p-6" : "p-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h3 className="font-bold text-white">{widget.title}</h3>
            <div className="text-sm text-gray-400">
              {widget.metrics.map(m => metricDefinitions.find(md => md.category === m)?.label).join(" + ")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-white"
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      <div className={`h-${widget.size === "small" ? "32" : widget.size === "medium" ? "48" : "64"}`}>
        {chartType === "line" && (
          <LineChart
            data={chartData}
            config={{
              type: "line",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: widget.settings.showComparisons, position: "top" },
                tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
              },
              scales: {
                x: { display: true, grid: { display: false, color: "#374151" } },
                y: { display: true, grid: { display: true, color: "#374151" }, beginAtZero: true },
              },
            }}
            height={widget.size === "small" ? 128 : widget.size === "medium" ? 192 : 256}
          />
        )}
        {chartType === "bar" && (
          <BarChart
            data={chartData}
            config={{
              type: "bar",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: widget.settings.showComparisons, position: "top" },
                tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
              },
              scales: {
                x: { display: true, grid: { display: false, color: "#374151" } },
                y: { display: true, grid: { display: true, color: "#374151" }, beginAtZero: true },
              },
            }}
            height={widget.size === "small" ? 128 : widget.size === "medium" ? 192 : 256}
          />
        )}
        {chartType === "pie" && (
          <PieChart
            data={chartData}
            config={{
              type: "pie",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: widget.settings.showComparisons, position: "right" },
                tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
              },
            }}
            height={widget.size === "small" ? 128 : widget.size === "medium" ? 192 : 256}
          />
        )}
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Data Points:</span>
              <span className="ml-2 text-white">{widget.settings.dataPoints}</span>
            </div>
            <div>
              <span className="text-gray-400">Update Interval:</span>
              <span className="ml-2 text-white">{widget.refreshInterval}s</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Alert widget
export function AlertWidget({ 
  widget, 
  alerts, 
  onDismiss 
}: {
  widget: DashboardWidget;
  alerts: any[];
  onDismiss?: (alertId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const filteredAlerts = useMemo(() => {
    switch (filter) {
      case "unread":
        return alerts.filter(alert => !alert.isRead);
      case "critical":
        return alerts.filter(alert => alert.severity === "critical");
      default:
        return alerts;
    }
  }, [alerts, filter]);

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-500/10";
      case "warning": return "border-yellow-500 bg-yellow-500/10";
      case "info": return "border-blue-500 bg-blue-500/10";
      default: return "border-gray-500 bg-gray-500/10";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return "🚨";
      case "warning": return "⚠️";
      case "success": return "✅";
      default: return "ℹ️";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-lg border border-white/10 overflow-hidden ${
        widget.size === "small" ? "p-4" : widget.size === "medium" ? "p-6" : "p-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔔</div>
          <div>
            <h3 className="font-bold text-white">{widget.title}</h3>
            <div className="text-sm text-gray-400">
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-white"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="critical">Critical</option>
          </select>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      <div className={`space-y-2 ${isExpanded ? "max-h-96 overflow-y-auto" : "max-h-64 overflow-y-auto"}`}>
        {filteredAlerts.slice(0, isExpanded ? undefined : 3).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${getAlertColor(alert.severity)} ${
              !alert.isRead ? "font-semibold" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-lg">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <h4 className="text-white text-sm">{alert.title}</h4>
                  <p className="text-gray-300 text-xs mt-1">{alert.message}</p>
                  <div className="text-gray-400 text-xs mt-2">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onDismiss?.(alert.id)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Dismiss alert"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🎉</div>
          <div>No alerts</div>
        </div>
      )}
    </motion.div>
  );
}

// Progress widget
export function ProgressWidget({ 
  widget, 
  metrics, 
  onSettingsChange 
}: {
  widget: DashboardWidget;
  metrics: DashboardMetrics | null;
  onSettingsChange?: (settings: WidgetSettings) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metrics) return null;

  const getProgressData = () => {
    return widget.metrics.map((metricType) => {
      const metricDef = metricDefinitions.find(m => m.category === metricType);
      if (!metricDef) return null;

      let value = 0;
      switch (metricType) {
        case "traffic": value = (metrics.traffic.averageSpeed / 80) * 100; break;
        case "pollution": value = 100 - (metrics.pollution.airQualityIndex / 200) * 100; break;
        case "waste": value = metrics.waste.collectionEfficiency; break;
        case "energy": value = metrics.energy.efficiency; break;
        case "public_safety": value = metrics.publicSafety.publicSafetyIndex; break;
        case "infrastructure": value = metrics.infrastructure.roadCondition; break;
        case "citizen_satisfaction": value = metrics.citizenSatisfaction.overallSatisfaction; break;
      }

      return {
        label: metricDef.label,
        value: Math.min(100, Math.max(0, value)),
        color: metricDef.color,
        icon: metricDef.icon,
      };
    }).filter(Boolean);
  };

  const progressData = getProgressData();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-lg border border-white/10 overflow-hidden ${
        widget.size === "small" ? "p-4" : widget.size === "medium" ? "p-6" : "p-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📈</div>
          <div>
            <h3 className="font-bold text-white">{widget.title}</h3>
            <div className="text-sm text-gray-400">Progress Overview</div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded hover:bg-white/10 transition-colors"
          aria-label={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      <div className="space-y-4">
        {progressData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg">{item?.icon}</div>
              <span className="text-sm text-gray-300">{item?.label}</span>
              <span className="text-sm font-bold ml-auto" style={{ color: item?.color }}>
                {item?.value.toFixed(1)}%
              </span>
            </div>
            <AccessibileProgress
              value={item?.value || 0}
              label={item?.label || ""}
              color={item?.color}
              showPercentage={false}
            />
          </div>
        ))}
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">
              {(progressData.reduce((sum, item) => sum + (item?.value || 0), 0) / progressData.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Overall Progress</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Widget factory
export function createWidget(type: DashboardWidget["type"], config: Partial<DashboardWidget>): DashboardWidget {
  const defaultWidget: DashboardWidget = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    title: "New Widget",
    data: null,
    metrics: [],
    position: { x: 0, y: 0, width: 4, height: 3 },
    size: "medium",
    refreshInterval: 30,
    isVisible: true,
    isMinimized: false,
    settings: {
      showTrends: true,
      showComparisons: true,
      showTargets: true,
      showAlerts: true,
      colorScheme: "default",
      animationSpeed: "normal",
      dataPoints: 7,
    },
    ...config,
  };

  return defaultWidget;
}

// Widget renderer
export function WidgetRenderer({ 
  widget, 
  metrics, 
  alerts, 
  onSettingsChange, 
  onDismiss 
}: {
  widget: DashboardWidget;
  metrics: DashboardMetrics | null;
  alerts: any[];
  onSettingsChange?: (settings: WidgetSettings) => void;
  onDismiss?: (alertId: string) => void;
}) {
  if (!widget.isVisible) return null;

  switch (widget.type) {
    case "metric":
      return (
        <MetricCardWidget
          widget={widget}
          metrics={metrics}
          onSettingsChange={onSettingsChange}
        />
      );
    case "chart":
      return (
        <ChartWidget
          widget={widget}
          metrics={metrics}
          onSettingsChange={onSettingsChange}
        />
      );
    case "alert":
      return (
        <AlertWidget
          widget={widget}
          alerts={alerts}
          onDismiss={onDismiss}
        />
      );
    case "feed":
      return (
        <ProgressWidget
          widget={widget}
          metrics={metrics}
          onSettingsChange={onSettingsChange}
        />
      );
    default:
      return null;
  }
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TimeRange, 
  MetricType, 
  DashboardFilters, 
  UserPreferences 
} from "../../app/types/dashboard";
import Button from "../../app/components/ui/Button";
import AccessibilityVisualization, { AccessibleTabs } from "../../app/components/ui/AccessibilityVisualization";
import ResponsiveVisualization, { ResponsiveNavigationTabs } from "../../app/components/ui/ResponsiveVisualization";

// Time range selector component
export function TimeRangeSelector({
  value,
  onChange,
  options = ["1h", "6h", "24h", "7d", "30d", "90d"],
  className = "",
}: {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
  className?: string;
}) {
  const timeRangeLabels = {
    "1h": "Last Hour",
    "6h": "Last 6 Hours",
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
  };

  const tabs = options.map(option => ({
    id: option,
    label: timeRangeLabels[option],
    icon: getTimeIcon(option),
  }));

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-lg">⏰</div>
          <h3 className="font-bold text-white">Time Range</h3>
        </div>
        
        <ResponsiveNavigationTabs
          tabs={tabs}
          activeTab={value}
          onTabChange={(tabId) => onChange(tabId as TimeRange)}
        />
      </div>
    </AccessibilityVisualization>
  );
}

function getTimeIcon(range: TimeRange): string {
  switch (range) {
    case "1h": return "🕐";
    case "6h": return "🕕";
    case "24h": return "🕐";
    case "7d": return "📅";
    case "30d": return "📆";
    case "90d": return "📊";
    default: return "⏰";
  }
}

// Metric selector component
export function MetricSelector({
  selectedMetrics,
  availableMetrics,
  onChange,
  maxSelection = 7,
  className = "",
}: {
  selectedMetrics: MetricType[];
  availableMetrics: MetricType[];
  onChange: (metrics: MetricType[]) => void;
  maxSelection?: number;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const metricInfo = {
    traffic: { label: "Traffic", icon: "🚗", color: "#00D9FF" },
    pollution: { label: "Pollution", icon: "🌫️", color: "#00FF88" },
    waste: { label: "Waste", icon: "🗑️", color: "#fbbf24" },
    energy: { label: "Energy", icon: "⚡", color: "#9D4EDD" },
    public_safety: { label: "Public Safety", icon: "🛡️", color: "#ef4444" },
    infrastructure: { label: "Infrastructure", icon: "🏗️", color: "#f97316" },
    citizen_satisfaction: { label: "Citizen Satisfaction", icon: "😊", color: "#22c55e" },
  };

  const toggleMetric = (metric: MetricType) => {
    if (selectedMetrics.includes(metric)) {
      onChange(selectedMetrics.filter(m => m !== metric));
    } else if (selectedMetrics.length < maxSelection) {
      onChange([...selectedMetrics, metric]);
    }
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-lg">📊</div>
            <h3 className="font-bold text-white">Metrics</h3>
          </div>
          <div className="text-sm text-gray-400">
            {selectedMetrics.length}/{maxSelection} selected
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableMetrics.map(metric => {
            const info = metricInfo[metric];
            const isSelected = selectedMetrics.includes(metric);
            const isDisabled = !isSelected && selectedMetrics.length >= maxSelection;

            return (
              <motion.button
                key={metric}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={() => toggleMetric(metric)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                    : isDisabled
                    ? "border-gray-600 text-gray-500 cursor-not-allowed"
                    : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
                }`}
              >
                <span className="mr-2">{info.icon}</span>
                {info.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Filter controls component
export function FilterControls({
  filters,
  onChange,
  regions = ["Downtown", "North", "South", "East", "West", "Industrial"],
  categories = ["traffic", "pollution", "waste", "energy", "public_safety", "infrastructure", "citizen_satisfaction"],
  severities = ["low", "medium", "high", "critical"],
  className = "",
}: {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  regions?: string[];
  categories?: string[];
  severities?: string[];
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ""
  );

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-lg">🔍</div>
              <h3 className="font-bold text-white">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded hover:bg-white/10 transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "−" : "+"}
              </button>
            </div>
          </div>

          {/* Quick filter indicators */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.cityRegion && (
              <div className="px-2 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded text-xs text-neon-blue">
                📍 {filters.cityRegion}
              </div>
            )}
            {filters.problemCategory && (
              <div className="px-2 py-1 bg-neon-green/20 border border-neon-green/30 rounded text-xs text-neon-green">
                📂 {filters.problemCategory}
              </div>
            )}
            {filters.severity && (
              <div className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-500">
                ⚠️ {filters.severity}
              </div>
            )}
            {!hasActiveFilters && (
              <div className="text-sm text-gray-400">No filters applied</div>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City Region
                  </label>
                  <select
                    value={filters.cityRegion || ""}
                    onChange={(e) => updateFilter("cityRegion", e.target.value || undefined)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Problem Category
                  </label>
                  <select
                    value={filters.problemCategory || ""}
                    onChange={(e) => updateFilter("problemCategory", e.target.value || undefined)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={filters.severity || ""}
                    onChange={(e) => updateFilter("severity", e.target.value || undefined)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="">All Severities</option>
                    {severities.map(severity => (
                      <option key={severity} value={severity}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange?.start ? filters.dateRange.start.toISOString().split('T')[0] : ""}
                      onChange={(e) => {
                        const start = e.target.value ? new Date(e.target.value) : undefined;
                        updateFilter("dateRange", {
                          ...filters.dateRange,
                          start,
                        });
                      }}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                    />
                    <input
                      type="date"
                      value={filters.dateRange?.end ? filters.dateRange.end.toISOString().split('T')[0] : ""}
                      onChange={(e) => {
                        const end = e.target.value ? new Date(e.target.value) : undefined;
                        updateFilter("dateRange", {
                          ...filters.dateRange,
                          end,
                        });
                      }}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Real-time controls component
export function RealTimeControls({
  isRealTime,
  autoRefresh,
  refreshInterval,
  onToggleRealTime,
  onToggleAutoRefresh,
  onChangeInterval,
  onManualRefresh,
  isRefreshing,
  className = "",
}: {
  isRealTime: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  onToggleRealTime: () => void;
  onToggleAutoRefresh: () => void;
  onChangeInterval: (interval: number) => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  className?: string;
}) {
  const intervalOptions = [
    { label: "5 seconds", value: 5 },
    { label: "10 seconds", value: 10 },
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "5 minutes", value: 300 },
  ];

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-lg">🔄</div>
          <h3 className="font-bold text-white">Real-time Controls</h3>
        </div>

        <div className="space-y-4">
          {/* Real-time toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Real-time Mode</span>
            <button
              onClick={onToggleRealTime}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isRealTime ? "bg-neon-blue" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRealTime ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Auto-refresh toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Auto-refresh</span>
            <button
              onClick={onToggleAutoRefresh}
              disabled={!isRealTime}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh && isRealTime ? "bg-neon-green" : "bg-gray-600"
              } ${!isRealTime ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh && isRealTime ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Refresh interval */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Refresh Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => onChangeInterval(Number(e.target.value))}
              disabled={!autoRefresh || !isRealTime}
              className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white ${
                !autoRefresh || !isRealTime ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {intervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Manual refresh button */}
          <Button
            variant="outline"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="w-full"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                🔄 Manual Refresh
              </>
            )}
          </Button>

          {/* Status indicator */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`} />
              <span className={isRealTime ? "text-green-500" : "text-gray-500"}>
                {isRealTime ? "Live" : "Static"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// View controls component
export function ViewControls({
  layout,
  density,
  theme,
  onLayoutChange,
  onDensityChange,
  onThemeChange,
  className = "",
}: {
  layout: "grid" | "list" | "cards";
  density: "compact" | "normal" | "spacious";
  theme: "light" | "dark" | "auto";
  onLayoutChange: (layout: "grid" | "list" | "cards") => void;
  onDensityChange: (density: "compact" | "normal" | "spacious") => void;
  onThemeChange: (theme: "light" | "dark" | "auto") => void;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-lg">⚙️</div>
          <h3 className="font-bold text-white">View Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Layout */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Layout</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "grid", label: "Grid", icon: "⊞" },
                { value: "list", label: "List", icon: "☰" },
                { value: "cards", label: "Cards", icon: "🎴" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => onLayoutChange(option.value as any)}
                  className={`px-3 py-2 rounded border text-sm transition-all ${
                    layout === option.value
                      ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Density</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "compact", label: "Compact" },
                { value: "normal", label: "Normal" },
                { value: "spacious", label: "Spacious" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => onDensityChange(option.value as any)}
                  className={`px-3 py-2 rounded border text-sm transition-all ${
                    density === option.value
                      ? "border-neon-green bg-neon-green/20 text-neon-green"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "Light", icon: "☀️" },
                { value: "dark", label: "Dark", icon: "🌙" },
                { value: "auto", label: "Auto", icon: "🎨" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => onThemeChange(option.value as any)}
                  className={`px-3 py-2 rounded border text-sm transition-all ${
                    theme === option.value
                      ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Export controls component
export function ExportControls({
  onExport,
  isExporting,
  className = "",
}: {
  onExport: (format: "pdf" | "excel" | "csv" | "json") => void;
  isExporting: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    { format: "pdf", label: "PDF Report", icon: "📄", description: "Export as PDF document" },
    { format: "excel", label: "Excel", icon: "📊", description: "Export as Excel spreadsheet" },
    { format: "csv", label: "CSV", icon: "📋", description: "Export as CSV data" },
    { format: "json", label: "JSON", icon: "{}", description: "Export as JSON data" },
  ];

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-lg">📤</div>
              <h3 className="font-bold text-white">Export Data</h3>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded hover:bg-white/10 transition-colors"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? "−" : "+"}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {exportOptions.map(option => (
                  <motion.button
                    key={option.format}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExport(option.format as any)}
                    disabled={isExporting}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isExporting
                        ? "border-gray-600 text-gray-500 cursor-not-allowed"
                        : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-400">{option.description}</div>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        →
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

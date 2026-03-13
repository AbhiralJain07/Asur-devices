"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DashboardMetrics, 
  MetricType, 
  RealTimeUpdate, 
  ChartData 
} from "../../app/types/dashboard";
import { LineChart, BarChart, PieChart } from "../../app/components/ui/Charts";
import ResponsiveVisualization from "../../app/components/ui/ResponsiveVisualization";
import AccessibilityVisualization from "../../app/components/ui/AccessibilityVisualization";

// Real-time data generator
class RealTimeDataGenerator {
  private listeners: Map<MetricType, ((update: RealTimeUpdate) => void)[]> = new Map();
  private intervals: Map<MetricType, NodeJS.Timeout> = new Map();
  private baseMetrics: Partial<DashboardMetrics> = {};

  constructor() {
    this.initializeBaseMetrics();
  }

  private initializeBaseMetrics() {
    this.baseMetrics = {
      traffic: {
        averageSpeed: 45 + Math.random() * 20,
        congestionLevel: 30 + Math.random() * 40,
        incidentCount: Math.floor(Math.random() * 10),
        publicTransportUsage: 60 + Math.random() * 30,
        flowRate: 70 + Math.random() * 25,
        travelTimeIndex: 1.2 + Math.random() * 0.8,
        parkingUtilization: 40 + Math.random() * 40,
      },
      pollution: {
        airQualityIndex: 50 + Math.random() * 100,
        particulateMatter25: 10 + Math.random() * 40,
        particulateMatter10: 15 + Math.random() * 50,
        carbonMonoxide: 0.5 + Math.random() * 2,
        nitrogenDioxide: 20 + Math.random() * 40,
        sulfurDioxide: 5 + Math.random() * 15,
        ozone: 30 + Math.random() * 50,
        noiseLevel: 40 + Math.random() * 40,
      },
      waste: {
        collectionEfficiency: 70 + Math.random() * 25,
        recyclingRate: 30 + Math.random() * 40,
        landfillUsage: 60 + Math.random() * 30,
        operationalCost: 100000 + Math.random() * 50000,
        wasteGeneration: 500 + Math.random() * 300,
        processingCapacity: 80 + Math.random() * 20,
        routeOptimization: 60 + Math.random() * 30,
      },
      energy: {
        consumption: 800 + Math.random() * 400,
        efficiency: 60 + Math.random() * 30,
        renewablePercentage: 20 + Math.random() * 40,
        gridStability: 85 + Math.random() * 15,
        peakDemand: 1200 + Math.random() * 400,
        carbonFootprint: 200 + Math.random() * 100,
        storageUtilization: 40 + Math.random() * 40,
      },
      publicSafety: {
        emergencyResponseTime: 5 + Math.random() * 10,
        crimeRate: 10 + Math.random() * 20,
        incidentResolution: 85 + Math.random() * 15,
        policeActivity: 50 + Math.random() * 40,
        fireSafetyScore: 80 + Math.random() * 20,
        medicalEmergencyResponse: 90 + Math.random() * 10,
        publicSafetyIndex: 75 + Math.random() * 25,
      },
      infrastructure: {
        roadCondition: 70 + Math.random() * 25,
        bridgeStatus: 80 + Math.random() * 20,
        waterSupply: 85 + Math.random() * 15,
        sewageSystem: 75 + Math.random() * 20,
        publicTransport: 65 + Math.random() * 30,
        digitalConnectivity: 80 + Math.random() * 20,
        maintenanceBacklog: 20 + Math.random() * 30,
      },
      citizenSatisfaction: {
        overallSatisfaction: 70 + Math.random() * 25,
        serviceQuality: 75 + Math.random() * 20,
        responseTime: 60 + Math.random() * 30,
        complaintResolution: 80 + Math.random() * 20,
        publicTrust: 65 + Math.random() * 30,
        engagementLevel: 50 + Math.random() * 40,
        satisfactionTrend: Math.random() * 20 - 10,
      },
    };
  }

  subscribe(metric: MetricType, callback: (update: RealTimeUpdate) => void) {
    if (!this.listeners.has(metric)) {
      this.listeners.set(metric, []);
    }
    this.listeners.get(metric)?.push(callback);

    // Start generating data for this metric if not already started
    if (!this.intervals.has(metric)) {
      this.startDataGeneration(metric);
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(metric);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }

      // Stop generation if no more listeners
      if (this.listeners.get(metric)?.length === 0) {
        this.stopDataGeneration(metric);
      }
    };
  }

  private startDataGeneration(metric: MetricType) {
    const interval = setInterval(() => {
      const update = this.generateUpdate(metric);
      const listeners = this.listeners.get(metric);
      if (listeners) {
        listeners.forEach(callback => callback(update));
      }
    }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds

    this.intervals.set(metric, interval);
  }

  private stopDataGeneration(metric: MetricType) {
    const interval = this.intervals.get(metric);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(metric);
    }
  }

  private generateUpdate(metric: MetricType): RealTimeUpdate {
    const metricKey = metric === "public_safety" ? "publicSafety" : 
                      metric === "citizen_satisfaction" ? "citizenSatisfaction" : metric;
    const baseMetric = (this.baseMetrics as any)[metricKey];
    if (!baseMetric) {
      throw new Error(`Base metric not found for ${metric}`);
    }

    // Generate realistic variations
    const variation = () => (Math.random() - 0.5) * 0.1; // ±5% variation
    const updateData: Partial<DashboardMetrics> = {};

    switch (metric) {
      case "traffic":
        updateData.traffic = {
          ...baseMetric,
          averageSpeed: Math.max(10, Math.min(80, baseMetric.averageSpeed * (1 + variation()))),
          congestionLevel: Math.max(0, Math.min(100, baseMetric.congestionLevel * (1 + variation()))),
          incidentCount: Math.max(0, Math.floor(baseMetric.incidentCount + (Math.random() - 0.5) * 2)),
          publicTransportUsage: Math.max(0, Math.min(100, baseMetric.publicTransportUsage * (1 + variation()))),
          flowRate: Math.max(0, Math.min(100, baseMetric.flowRate * (1 + variation()))),
          travelTimeIndex: Math.max(0.5, Math.min(3, baseMetric.travelTimeIndex * (1 + variation()))),
          parkingUtilization: Math.max(0, Math.min(100, baseMetric.parkingUtilization * (1 + variation()))),
        };
        break;
      case "pollution":
        updateData.pollution = {
          ...baseMetric,
          airQualityIndex: Math.max(0, Math.min(500, baseMetric.airQualityIndex * (1 + variation()))),
          particulateMatter25: Math.max(0, Math.min(100, baseMetric.particulateMatter25 * (1 + variation()))),
          particulateMatter10: Math.max(0, Math.min(150, baseMetric.particulateMatter10 * (1 + variation()))),
          carbonMonoxide: Math.max(0, Math.min(5, baseMetric.carbonMonoxide * (1 + variation()))),
          nitrogenDioxide: Math.max(0, Math.min(100, baseMetric.nitrogenDioxide * (1 + variation()))),
          sulfurDioxide: Math.max(0, Math.min(50, baseMetric.sulfurDioxide * (1 + variation()))),
          ozone: Math.max(0, Math.min(150, baseMetric.ozone * (1 + variation()))),
          noiseLevel: Math.max(0, Math.min(120, baseMetric.noiseLevel * (1 + variation()))),
        };
        break;
      // Add other metrics as needed...
    }

    return {
      metric,
      data: updateData,
      timestamp: new Date(),
      source: "real-time-simulator",
      confidence: 0.8 + Math.random() * 0.2,
    };
  }

  // Cleanup all intervals
  cleanup() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.listeners.clear();
  }
}

// Global data generator instance
const dataGenerator = new RealTimeDataGenerator();

// Real-time chart component
export function RealTimeChart({
  metrics,
  chartType = "line",
  maxDataPoints = 50,
  refreshInterval = 1000,
  height = 300,
  className = "",
}: {
  metrics: MetricType[];
  chartType?: "line" | "bar" | "pie";
  maxDataPoints?: number;
  refreshInterval?: number;
  height?: number;
  className?: string;
}) {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const dataHistory = useRef<Map<MetricType, number[]>>(new Map());

  // Initialize data history
  useEffect(() => {
    metrics.forEach(metric => {
      dataHistory.current.set(metric, []);
    });
  }, [metrics]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    metrics.forEach(metric => {
      const unsubscribe = dataGenerator.subscribe(metric, (update) => {
        setChartData(prevData => {
          const newData = { ...prevData };
          const timestamp = update.timestamp.toLocaleTimeString();

          // Update labels
          if (!newData.labels.includes(timestamp)) {
            newData.labels = [...newData.labels, timestamp].slice(-maxDataPoints);
          }

          // Update or create dataset
          const existingDatasetIndex = newData.datasets.findIndex(ds => ds.label === metric);
          
          if (existingDatasetIndex >= 0) {
            // Update existing dataset
            const dataset = newData.datasets[existingDatasetIndex];
            const history = dataHistory.current.get(metric) || [];
            const newValue = extractMetricValue(update.data, metric);
            const newHistory = [...history, newValue].slice(-maxDataPoints);
            
            dataHistory.current.set(metric, newHistory);
            dataset.data = newHistory;
          } else {
            // Create new dataset
            const history = [extractMetricValue(update.data, metric)];
            dataHistory.current.set(metric, history);
            
            newData.datasets.push({
              label: metric,
              data: history,
              borderColor: getMetricColor(metric),
              backgroundColor: `${getMetricColor(metric)}20`,
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            });
          }

          return newData;
        });

        setLastUpdate(update.timestamp);
        setIsConnected(true);
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [metrics, maxDataPoints]);

  const extractMetricValue = (data: Partial<DashboardMetrics>, metric: MetricType): number => {
    switch (metric) {
      case "traffic": return data.traffic?.averageSpeed || 0;
      case "pollution": return data.pollution?.airQualityIndex || 0;
      case "waste": return data.waste?.collectionEfficiency || 0;
      case "energy": return data.energy?.efficiency || 0;
      case "public_safety": return data.publicSafety?.publicSafetyIndex || 0;
      case "infrastructure": return data.infrastructure?.roadCondition || 0;
      case "citizen_satisfaction": return data.citizenSatisfaction?.overallSatisfaction || 0;
      default: return 0;
    }
  };

  const getMetricColor = (metric: MetricType): string => {
    const colors = {
      traffic: "#00D9FF",
      pollution: "#00FF88",
      waste: "#fbbf24",
      energy: "#9D4EDD",
      public_safety: "#ef4444",
      infrastructure: "#f97316",
      citizen_satisfaction: "#22c55e",
    };
    return colors[metric] || "#00D9FF";
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="font-bold text-white">Real-Time Analytics</h3>
              <div className="text-sm text-gray-400">
                {metrics.map(m => m.charAt(0).toUpperCase() + m.slice(1).replace("_", " ")).join(" + ")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-gray-400">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-gray-400">
                {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div style={{ height }}>
          {chartType === "line" && (
            <LineChart
              data={chartData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Time", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Value", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              height={height}
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
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Time", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Value", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              height={height}
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
                  legend: { display: true, position: "right" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
              }}
              height={height}
            />
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Data Points:</span>
              <span className="ml-2 text-white">{chartData.labels.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Metrics:</span>
              <span className="ml-2 text-white">{metrics.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Update Rate:</span>
              <span className="ml-2 text-white">{(refreshInterval / 1000).toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-gray-400">Buffer Size:</span>
              <span className="ml-2 text-white">{maxDataPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Real-time gauge component
export function RealTimeGauge({
  metric,
  value,
  min = 0,
  max = 100,
  thresholds = { good: 80, warning: 60, critical: 40 },
  size = "medium",
  className = "",
}: {
  metric: MetricType;
  value: number;
  min?: number;
  max?: number;
  thresholds?: { good: number; warning: number; critical: number };
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const previousValue = useRef(value);

  useEffect(() => {
    previousValue.current = currentValue;
    setCurrentValue(value);

    // Calculate trend
    const diff = value - previousValue.current;
    if (Math.abs(diff) < 0.5) {
      setTrend("stable");
    } else {
      setTrend(diff > 0 ? "up" : "down");
    }
  }, [value]);

  const percentage = ((currentValue - min) / (max - min)) * 100;
  const getColor = () => {
    if (percentage >= thresholds.good) return "#00FF88";
    if (percentage >= thresholds.warning) return "#fbbf24";
    if (percentage >= thresholds.critical) return "#f97316";
    return "#ef4444";
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "→";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small": return "w-32 h-32";
      case "medium": return "w-48 h-48";
      case "large": return "w-64 h-64";
      default: return "w-48 h-48";
    }
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-bold text-white capitalize">{metric.replace("_", " ")}</h3>
              <div className="text-sm text-gray-400">Real-time Gauge</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>
              {getTrendIcon()}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={`relative ${getSizeClasses()}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#374151"
                strokeWidth="20"
              />
              
              {/* Progress arc */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={getColor()}
                strokeWidth="20"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 502" }}
                animate={{ strokeDasharray: `${(percentage / 100) * 502} 502` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
              <div className="text-3xl font-bold" style={{ color: getColor() }}>
                {currentValue.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">
                {percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span style={{ color: getColor() }}>
              {percentage >= thresholds.good ? "Good" : 
               percentage >= thresholds.warning ? "Warning" : 
               percentage >= thresholds.critical ? "Critical" : "Critical"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Range</span>
            <span className="text-gray-300">{min} - {max}</span>
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Real-time metrics grid
export function RealTimeMetricsGrid({
  metrics,
  columns = 3,
  className = "",
}: {
  metrics: { metric: MetricType; value: number; label: string }[];
  columns?: number;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((item, index) => (
          <motion.div
            key={item.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RealTimeGauge
              metric={item.metric}
              value={item.value}
              size="small"
            />
          </motion.div>
        ))}
      </div>
    </AccessibilityVisualization>
  );
}

// Export the data generator for testing
export { dataGenerator };

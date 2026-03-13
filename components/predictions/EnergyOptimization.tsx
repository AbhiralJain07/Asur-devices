"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { EnergyProblem, EnergySolution, ChartData, DataPoint } from "../../types";
import { LineChart, BarChart, PieChart, MetricCard, ProgressBar } from "../ui/Charts";

interface EnergyOptimizationProps {
  problem: EnergyProblem;
  solution: EnergySolution;
  className?: string;
  onDataPointClick?: (dataPoint: DataPoint) => void;
}

// Energy consumption data generator
function generateEnergyConsumptionData(): ChartData {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const currentConsumption = Array.from({ length: 24 }, (_, i) => {
    const baseConsumption = 800 + Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 300;
    const randomVariation = (Math.random() - 0.5) * 100;
    return Math.max(400, Math.min(1500, baseConsumption + randomVariation));
  });
  
  const predictedConsumption = currentConsumption.map((consumption, i) => {
    // AI prediction reduces consumption by 15-25%
    const reduction = 0.15 + Math.random() * 0.1;
    return Math.max(300, consumption * (1 - reduction));
  });

  return {
    labels: hours,
    datasets: [
      {
        label: "Current Consumption (MW)",
        data: currentConsumption,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted Consumption (MW)",
        data: predictedConsumption,
        borderColor: "#00FF88",
        backgroundColor: "rgba(0, 255, 136, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Energy efficiency data
function generateEnergyEfficiencyData(): ChartData {
  const sources = ["Solar", "Wind", "Hydro", "Natural Gas", "Coal", "Nuclear"];
  const currentEfficiency = sources.map(() => 60 + Math.random() * 30);
  const predictedEfficiency = currentEfficiency.map(efficiency => Math.min(95, efficiency * 1.3));

  return {
    labels: sources,
    datasets: [
      {
        label: "Current Efficiency (%)",
        data: currentEfficiency,
        backgroundColor: [
          "rgba(251, 191, 36, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "#fbbf24",
          "#22c55e",
          "#3b82f6",
          "#ef4444",
          "#6b7280",
          "#a855f7",
        ],
        borderWidth: 1,
      },
      {
        label: "Predicted Efficiency (%)",
        data: predictedEfficiency,
        backgroundColor: [
          "rgba(0, 255, 136, 0.8)",
          "rgba(0, 217, 255, 0.8)",
          "rgba(157, 78, 221, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(107, 114, 128, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
        borderColor: [
          "#00FF88",
          "#00D9FF",
          "#9D4EDD",
          "#fbbf24",
          "#6b7280",
          "#a855f7",
        ],
        borderWidth: 1,
      },
    ],
  };
}

// Renewable energy usage data
function generateRenewableUsageData(): ChartData {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const currentRenewable = months.map(() => 20 + Math.random() * 25);
  const predictedRenewable = currentRenewable.map(renewable => Math.min(80, renewable * 2.5));

  return {
    labels: months,
    datasets: [
      {
        label: "Current Renewable (%)",
        data: currentRenewable,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted Renewable (%)",
        data: predictedRenewable,
        borderColor: "#00D9FF",
        backgroundColor: "rgba(0, 217, 255, 0.8)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Grid stability data
function generateGridStabilityData(): ChartData {
  const metrics = ["Voltage Stability", "Frequency Control", "Load Balance", "Outage Response"];
  const currentStability = metrics.map(() => 70 + Math.random() * 20);
  const predictedStability = currentStability.map(stability => Math.min(98, stability * 1.2));

  return {
    labels: metrics,
    datasets: [
      {
        label: "Current Stability (%)",
        data: currentStability,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Predicted Stability (%)",
        data: predictedStability,
        backgroundColor: "rgba(0, 255, 136, 0.8)",
        borderColor: "#00FF88",
        borderWidth: 1,
      },
    ],
  };
}

export default function EnergyOptimization({
  problem,
  solution,
  className = "",
  onDataPointClick,
}: EnergyOptimizationProps) {
  const [selectedMetric, setSelectedMetric] = useState<"consumption" | "efficiency" | "renewable" | "stability">("consumption");
  const [isAnimating, setIsAnimating] = useState(true);

  const consumptionData = useMemo(() => generateEnergyConsumptionData(), []);
  const efficiencyData = useMemo(() => generateEnergyEfficiencyData(), []);
  const renewableData = useMemo(() => generateRenewableUsageData(), []);
  const stabilityData = useMemo(() => generateGridStabilityData(), []);

  // Calculate metrics
  const currentAvgConsumption = consumptionData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / consumptionData.datasets[0].data.length;
  const predictedAvgConsumption = consumptionData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / consumptionData.datasets[1].data.length;
  const consumptionReduction = ((currentAvgConsumption - predictedAvgConsumption) / currentAvgConsumption) * 100;

  const currentAvgEfficiency = efficiencyData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / efficiencyData.datasets[0].data.length;
  const predictedAvgEfficiency = efficiencyData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / efficiencyData.datasets[1].data.length;
  const efficiencyImprovement = ((predictedAvgEfficiency - currentAvgEfficiency) / currentAvgEfficiency) * 100;

  const currentAvgRenewable = renewableData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / renewableData.datasets[0].data.length;
  const predictedAvgRenewable = renewableData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / renewableData.datasets[1].data.length;
  const renewableIncrease = ((predictedAvgRenewable - currentAvgRenewable) / currentAvgRenewable) * 100;

  const currentAvgStability = stabilityData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / stabilityData.datasets[0].data.length;
  const predictedAvgStability = stabilityData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / stabilityData.datasets[1].data.length;
  const stabilityImprovement = ((predictedAvgStability - currentAvgStability) / currentAvgStability) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDataPointClick = (label: string, value: number, datasetIndex: number) => {
    const dataPoint: DataPoint = {
      timestamp: new Date(),
      value,
      context: `${label} - ${datasetIndex === 0 ? "Current" : "Predicted"}`,
    };
    onDataPointClick?.(dataPoint);
  };

  const getStabilityColor = (stability: number) => {
    if (stability >= 95) return "#00FF88"; // Excellent
    if (stability >= 85) return "#fbbf24"; // Good
    if (stability >= 70) return "#f97316"; // Fair
    return "#ef4444"; // Poor
  };

  const getStabilityLabel = (stability: number) => {
    if (stability >= 95) return "Excellent";
    if (stability >= 85) return "Good";
    if (stability >= 70) return "Fair";
    return "Poor";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Energy Optimization & Management</h3>
        <p className="text-gray-300">AI-powered energy consumption optimization and renewable integration</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Energy Reduction"
          value={consumptionReduction}
          unit="%"
          trend="down"
          change={consumptionReduction}
          color="#00FF88"
        />
        <MetricCard
          title="Efficiency Improvement"
          value={efficiencyImprovement}
          unit="%"
          trend="up"
          change={efficiencyImprovement}
          color="#fbbf24"
        />
        <MetricCard
          title="Renewable Growth"
          value={renewableIncrease}
          unit="%"
          trend="up"
          change={renewableIncrease}
          color="#22c55e"
        />
        <MetricCard
          title="Grid Stability"
          value={stabilityImprovement}
          unit="%"
          trend="up"
          change={stabilityImprovement}
          color="#9D4EDD"
        />
      </motion.div>

      {/* Grid Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Current Grid Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: getStabilityColor(currentAvgStability) }}>
              {Math.round(currentAvgStability)}%
            </div>
            <div className="text-sm text-gray-400">Current Stability</div>
            <div className="text-lg font-medium mt-1" style={{ color: getStabilityColor(currentAvgStability) }}>
              {getStabilityLabel(currentAvgStability)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: getStabilityColor(predictedAvgStability) }}>
              {Math.round(predictedAvgStability)}%
            </div>
            <div className="text-sm text-gray-400">Predicted Stability</div>
            <div className="text-lg font-medium mt-1" style={{ color: getStabilityColor(predictedAvgStability) }}>
              {getStabilityLabel(predictedAvgStability)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center"
      >
        <div className="inline-flex p-1 glass rounded-lg border border-white/10">
          {[
            { id: "consumption", label: "Energy Consumption", color: "#fbbf24" },
            { id: "efficiency", label: "Energy Efficiency", color: "#00FF88" },
            { id: "renewable", label: "Renewable Energy", color: "#22c55e" },
            { id: "stability", label: "Grid Stability", color: "#9D4EDD" },
          ].map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.id
                  ? "bg-neon-green text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white mb-2">
            {selectedMetric === "consumption" && "24-Hour Energy Consumption"}
            {selectedMetric === "efficiency" && "Energy Efficiency by Source"}
            {selectedMetric === "renewable" && "Renewable Energy Integration"}
            {selectedMetric === "stability" && "Grid Stability Metrics"}
          </h4>
          <p className="text-sm text-gray-400">
            {selectedMetric === "consumption" && "Real-time consumption monitoring with AI predictions"}
            {selectedMetric === "efficiency" && "Efficiency improvements across energy sources"}
            {selectedMetric === "renewable" && "Renewable energy adoption and integration"}
            {selectedMetric === "stability" && "Grid stability and reliability metrics"}
          </p>
        </div>

        <div className="h-64">
          {selectedMetric === "consumption" && (
            <LineChart
              data={consumptionData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#fbbf24", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Time of Day", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Consumption (MW)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "efficiency" && (
            <BarChart
              data={efficiencyData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00FF88", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Energy Source", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Efficiency (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "renewable" && (
            <LineChart
              data={renewableData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#22c55e", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Month", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Renewable (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "stability" && (
            <BarChart
              data={stabilityData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#9D4EDD", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Stability Metric", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Stability (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
        </div>
      </motion.div>

      {/* Solution Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { feature: "Demand Forecasting", enabled: solution.features.demandForecasting, description: "AI-powered demand prediction" },
          { feature: "Load Balancing", enabled: solution.features.loadBalancing, description: "Dynamic load distribution" },
          { feature: "Renewable Integration", enabled: solution.features.renewableIntegration, description: "Smart renewable integration" },
          { feature: "Storage Optimization", enabled: solution.features.storageOptimization, description: "Energy storage management" },
        ].map((item, index) => (
          <motion.div
            key={item.feature}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className={`p-4 glass rounded-lg border transition-all ${
              item.enabled ? "border-neon-green/30" : "border-gray-700/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                item.enabled ? "bg-neon-green" : "bg-gray-600"
              }`} />
              <h5 className="font-bold text-white">{item.feature}</h5>
            </div>
            <p className="text-sm text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Energy Mix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Energy Mix Optimization</h4>
        <div className="space-y-4">
          {[
            { source: "Solar", current: 25, predicted: 45, color: "#fbbf24" },
            { source: "Wind", current: 20, predicted: 35, color: "#3b82f6" },
            { source: "Hydro", current: 30, predicted: 25, color: "#22c55e" },
            { source: "Natural Gas", current: 15, predicted: 10, color: "#f97316" },
            { source: "Nuclear", current: 10, predicted: 15, color: "#a855f7" },
          ].map((mix, index) => (
            <div key={mix.source}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{mix.source}</span>
                <span className="text-sm" style={{ color: mix.color }}>
                  {mix.current}% → {mix.predicted}%
                </span>
              </div>
              <ProgressBar value={mix.predicted} color={mix.color} />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">Carbon Footprint Reduction</span>
            <span className="text-lg font-bold text-neon-green">
              {((currentAvgConsumption - predictedAvgConsumption) * 0.5).toFixed(0)} tons CO₂/day
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Annual reduction: {((currentAvgConsumption - predictedAvgConsumption) * 0.5 * 365).toFixed(0)} tons CO₂
          </div>
        </div>
      </motion.div>
    </div>
  );
}

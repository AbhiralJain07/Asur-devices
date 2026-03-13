"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { WasteProblem, WasteSolution, ChartData, DataPoint } from "../../types";
import { LineChart, BarChart, PieChart, MetricCard, ProgressBar } from "../ui/Charts";

interface WasteManagementProps {
  problem: WasteProblem;
  solution: WasteSolution;
  className?: string;
  onDataPointClick?: (dataPoint: DataPoint) => void;
}

// Collection efficiency data generator
function generateCollectionEfficiencyData(): ChartData {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentEfficiency = days.map(() => 65 + Math.random() * 25);
  const predictedEfficiency = currentEfficiency.map(efficiency => Math.min(95, efficiency * 1.25));

  return {
    labels: days,
    datasets: [
      {
        label: "Current Efficiency",
        data: currentEfficiency,
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted Efficiency",
        data: predictedEfficiency,
        borderColor: "#00D9FF",
        backgroundColor: "rgba(0, 217, 255, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Recycling rate data
function generateRecyclingRateData(): ChartData {
  const categories = ["Paper", "Plastic", "Glass", "Metal", "Organic", "Electronics"];
  const currentRates = categories.map(() => 20 + Math.random() * 40);
  const predictedRates = currentRates.map(rate => Math.min(80, rate * 1.8));

  return {
    labels: categories,
    datasets: [
      {
        label: "Current Recycling Rate",
        data: currentRates,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "#22c55e",
          "#3b82f6",
          "#a855f7",
          "#fbbf24",
          "#ef4444",
          "#6b7280",
        ],
        borderWidth: 1,
      },
      {
        label: "Predicted Recycling Rate",
        data: predictedRates,
        backgroundColor: [
          "rgba(0, 255, 136, 0.8)",
          "rgba(0, 217, 255, 0.8)",
          "rgba(157, 78, 221, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(107, 114, 128, 0.8)",
        ],
        borderColor: [
          "#00FF88",
          "#00D9FF",
          "#9D4EDD",
          "#fbbf24",
          "#ef4444",
          "#6b7280",
        ],
        borderWidth: 1,
      },
    ],
  };
}

// Landfill usage data
function generateLandfillUsageData(): ChartData {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const currentUsage = months.map(() => 70 + Math.random() * 25);
  const predictedUsage = currentUsage.map(usage => Math.max(40, usage * 0.6));

  return {
    labels: months,
    datasets: [
      {
        label: "Current Landfill Usage",
        data: currentUsage,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted Landfill Usage",
        data: predictedUsage,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Operational costs data
function generateOperationalCostsData(): ChartData {
  const categories = ["Collection", "Processing", "Transport", "Disposal", "Recycling"];
  const currentCosts = [45000, 32000, 28000, 18000, 15000];
  const predictedCosts = currentCosts.map(cost => cost * 0.7);

  return {
    labels: categories,
    datasets: [
      {
        label: "Current Monthly Costs ($)",
        data: currentCosts,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Predicted Monthly Costs ($)",
        data: predictedCosts,
        backgroundColor: "rgba(0, 217, 255, 0.8)",
        borderColor: "#00D9FF",
        borderWidth: 1,
      },
    ],
  };
}

export default function WasteManagement({
  problem,
  solution,
  className = "",
  onDataPointClick,
}: WasteManagementProps) {
  const [selectedMetric, setSelectedMetric] = useState<"efficiency" | "recycling" | "landfill" | "costs">("efficiency");
  const [isAnimating, setIsAnimating] = useState(true);

  const efficiencyData = useMemo(() => generateCollectionEfficiencyData(), []);
  const recyclingData = useMemo(() => generateRecyclingRateData(), []);
  const landfillData = useMemo(() => generateLandfillUsageData(), []);
  const costsData = useMemo(() => generateOperationalCostsData(), []);

  // Calculate metrics
  const currentAvgEfficiency = efficiencyData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / efficiencyData.datasets[0].data.length;
  const predictedAvgEfficiency = efficiencyData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / efficiencyData.datasets[1].data.length;
  const efficiencyImprovement = ((predictedAvgEfficiency - currentAvgEfficiency) / currentAvgEfficiency) * 100;

  const currentAvgRecycling = recyclingData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / recyclingData.datasets[0].data.length;
  const predictedAvgRecycling = recyclingData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / recyclingData.datasets[1].data.length;
  const recyclingImprovement = ((predictedAvgRecycling - currentAvgRecycling) / currentAvgRecycling) * 100;

  const currentAvgLandfill = landfillData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) / landfillData.datasets[0].data.length;
  const predictedAvgLandfill = landfillData.datasets[1].data.reduce((a: number, b: number) => a + b, 0) / landfillData.datasets[1].data.length;
  const landfillReduction = ((currentAvgLandfill - predictedAvgLandfill) / currentAvgLandfill) * 100;

  const currentTotalCosts = costsData.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
  const predictedTotalCosts = costsData.datasets[1].data.reduce((a: number, b: number) => a + b, 0);
  const costSavings = ((currentTotalCosts - predictedTotalCosts) / currentTotalCosts) * 100;

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
        <h3 className="text-2xl font-bold text-white mb-2">Waste Management Optimization</h3>
        <p className="text-gray-300">AI-driven waste collection and recycling optimization</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Collection Efficiency"
          value={efficiencyImprovement}
          unit="%"
          trend="up"
          change={efficiencyImprovement}
          color="#00D9FF"
        />
        <MetricCard
          title="Recycling Rate"
          value={recyclingImprovement}
          unit="%"
          trend="up"
          change={recyclingImprovement}
          color="#22c55e"
        />
        <MetricCard
          title="Landfill Reduction"
          value={landfillReduction}
          unit="%"
          trend="down"
          change={landfillReduction}
          color="#f97316"
        />
        <MetricCard
          title="Cost Savings"
          value={costSavings}
          unit="%"
          trend="down"
          change={costSavings}
          color="#9D4EDD"
        />
      </motion.div>

      {/* Metric Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="inline-flex p-1 glass rounded-lg border border-white/10">
          {[
            { id: "efficiency", label: "Collection Efficiency", color: "#00D9FF" },
            { id: "recycling", label: "Recycling Rates", color: "#22c55e" },
            { id: "landfill", label: "Landfill Usage", color: "#f97316" },
            { id: "costs", label: "Operational Costs", color: "#9D4EDD" },
          ].map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.id
                  ? "bg-neon-blue text-black"
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
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white mb-2">
            {selectedMetric === "efficiency" && "Weekly Collection Efficiency"}
            {selectedMetric === "recycling" && "Material Recycling Rates"}
            {selectedMetric === "landfill" && "Landfill Usage Trends"}
            {selectedMetric === "costs" && "Operational Cost Breakdown"}
          </h4>
          <p className="text-sm text-gray-400">
            {selectedMetric === "efficiency" && "Optimized collection routes and schedules"}
            {selectedMetric === "recycling" && "Improved sorting and processing efficiency"}
            {selectedMetric === "landfill" && "Reduced waste through better recycling"}
            {selectedMetric === "costs" && "Lower operational costs through AI optimization"}
          </p>
        </div>

        <div className="h-64">
          {selectedMetric === "efficiency" && (
            <LineChart
              data={efficiencyData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Day of Week", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Efficiency (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "recycling" && (
            <BarChart
              data={recyclingData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#22c55e", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Material Type", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Recycling Rate (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "landfill" && (
            <LineChart
              data={landfillData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#f97316", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Month", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Usage (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "costs" && (
            <BarChart
              data={costsData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#9D4EDD", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Cost Category", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Monthly Cost ($)", grid: { display: true, color: "#374151" }, beginAtZero: true },
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
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { feature: "Route Optimization", enabled: solution.features.routeOptimization, description: "AI-powered collection routes" },
          { feature: "Fill Level Monitoring", enabled: solution.features.fillLevelMonitoring, description: "Real-time bin monitoring" },
          { feature: "Predictive Scheduling", enabled: solution.features.predictiveScheduling, description: "Smart collection scheduling" },
          { feature: "Waste Sorting", enabled: solution.features.wasteSorting, description: "Automated sorting systems" },
        ].map((item, index) => (
          <motion.div
            key={item.feature}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className={`p-4 glass rounded-lg border transition-all ${
              item.enabled ? "border-neon-blue/30" : "border-gray-700/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                item.enabled ? "bg-neon-blue" : "bg-gray-600"
              }`} />
              <h5 className="font-bold text-white">{item.feature}</h5>
            </div>
            <p className="text-sm text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Cost Savings Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Monthly Cost Savings Breakdown</h4>
        <div className="space-y-4">
          {[
            { category: "Collection", current: costsData.datasets[0].data[0], predicted: costsData.datasets[1].data[0] },
            { category: "Processing", current: costsData.datasets[0].data[1], predicted: costsData.datasets[1].data[1] },
            { category: "Transport", current: costsData.datasets[0].data[2], predicted: costsData.datasets[1].data[2] },
            { category: "Disposal", current: costsData.datasets[0].data[3], predicted: costsData.datasets[1].data[3] },
            { category: "Recycling", current: costsData.datasets[0].data[4], predicted: costsData.datasets[1].data[4] },
          ].map((item, index) => {
            const savings = item.current - item.predicted;
            const savingsPercent = (savings / item.current) * 100;
            
            return (
              <div key={item.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">{item.category}</span>
                  <div className="text-right">
                    <div className="text-sm text-neon-green font-medium">
                      {formatCurrency(savings)} saved
                    </div>
                    <div className="text-xs text-gray-400">
                      {savingsPercent.toFixed(1)}% reduction
                    </div>
                  </div>
                </div>
                <ProgressBar value={savingsPercent} color="#22c55e" />
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">Total Monthly Savings</span>
            <span className="text-lg font-bold text-neon-green">
              {formatCurrency(currentTotalCosts - predictedTotalCosts)}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Annual savings: {formatCurrency((currentTotalCosts - predictedTotalCosts) * 12)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

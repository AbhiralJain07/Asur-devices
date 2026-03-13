"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PollutionProblem, PollutionSolution, ChartData, DataPoint } from "../../types";
import { LineChart, BarChart, PieChart, MetricCard, ProgressBar } from "../ui/Charts";

interface PollutionMonitoringProps {
  problem: PollutionProblem;
  solution: PollutionSolution;
  className?: string;
  onDataPointClick?: (dataPoint: DataPoint) => void;
}

// Air quality data generator
function generateAirQualityData(): ChartData {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const currentAQI = Array.from({ length: 24 }, (_, i) => {
    const baseAQI = 70 + Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 30;
    const randomVariation = (Math.random() - 0.5) * 20;
    return Math.max(20, Math.min(200, baseAQI + randomVariation));
  });
  
  const predictedAQI = currentAQI.map((aqi, i) => {
    // AI prediction improves AQI by 20-35%
    const improvement = 0.2 + Math.random() * 0.15;
    return Math.max(15, aqi * (1 - improvement));
  });

  return {
    labels: hours,
    datasets: [
      {
        label: "Current AQI",
        data: currentAQI,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Predicted AQI",
        data: predictedAQI,
        borderColor: "#00FF88",
        backgroundColor: "rgba(0, 255, 136, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Pollution sources data
function generatePollutionSourcesData(): ChartData {
  const sources = ["Industrial", "Vehicles", "Construction", "Residential", "Commercial"];
  const currentEmissions = [35, 30, 15, 12, 8];
  const predictedEmissions = currentEmissions.map(emission => emission * 0.6);

  return {
    labels: sources,
    datasets: [
      {
        label: "Current Emissions",
        data: currentEmissions,
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#a855f7",
          "#3b82f6",
        ],
        borderWidth: 1,
      },
      {
        label: "Predicted Emissions",
        data: predictedEmissions,
        backgroundColor: [
          "rgba(0, 255, 136, 0.8)",
          "rgba(0, 217, 255, 0.8)",
          "rgba(157, 78, 221, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "#00FF88",
          "#00D9FF",
          "#9D4EDD",
          "#fbbf24",
          "#ef4444",
        ],
        borderWidth: 1,
      },
    ],
  };
}

// Particulate matter data
function generateParticulateData(): ChartData {
  const locations = ["Downtown", "Industrial Zone", "Residential", "Park Area", "Highway"];
  const currentPM25 = locations.map(() => 25 + Math.random() * 35);
  const currentPM10 = locations.map(() => 40 + Math.random() * 40);
  const predictedPM25 = currentPM25.map(pm => Math.max(10, pm * 0.5));
  const predictedPM10 = currentPM10.map(pm => Math.max(20, pm * 0.6));

  return {
    labels: locations,
    datasets: [
      {
        label: "Current PM2.5",
        data: currentPM25,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Current PM10",
        data: currentPM10,
        backgroundColor: "rgba(249, 115, 22, 0.8)",
        borderColor: "#f97316",
        borderWidth: 1,
      },
      {
        label: "Predicted PM2.5",
        data: predictedPM25,
        backgroundColor: "rgba(0, 255, 136, 0.8)",
        borderColor: "#00FF88",
        borderWidth: 1,
      },
      {
        label: "Predicted PM10",
        data: predictedPM10,
        backgroundColor: "rgba(0, 217, 255, 0.8)",
        borderColor: "#00D9FF",
        borderWidth: 1,
      },
    ],
  };
}

export default function PollutionMonitoring({
  problem,
  solution,
  className = "",
  onDataPointClick,
}: PollutionMonitoringProps) {
  const [selectedMetric, setSelectedMetric] = useState<"aqi" | "sources" | "particulate">("aqi");
  const [isAnimating, setIsAnimating] = useState(true);

  const airQualityData = useMemo(() => generateAirQualityData(), []);
  const sourcesData = useMemo(() => generatePollutionSourcesData(), []);
  const particulateData = useMemo(() => generateParticulateData(), []);

  // Calculate metrics
  const currentAvgAQI = airQualityData.datasets[0].data.reduce((a, b) => a + b, 0) / airQualityData.datasets[0].data.length;
  const predictedAvgAQI = airQualityData.datasets[1].data.reduce((a, b) => a + b, 0) / airQualityData.datasets[1].data.length;
  const aqiImprovement = ((currentAvgAQI - predictedAvgAQI) / currentAvgAQI) * 100;

  const currentTotalEmissions = sourcesData.datasets[0].data.reduce((a, b) => a + b, 0);
  const predictedTotalEmissions = sourcesData.datasets[1].data.reduce((a, b) => a + b, 0);
  const emissionsReduction = ((currentTotalEmissions - predictedTotalEmissions) / currentTotalEmissions) * 100;

  const currentAvgPM25 = particulateData.datasets[0].data.reduce((a, b) => a + b, 0) / particulateData.datasets[0].data.length;
  const predictedAvgPM25 = particulateData.datasets[2].data.reduce((a, b) => a + b, 0) / particulateData.datasets[2].data.length;
  const pm25Reduction = ((currentAvgPM25 - predictedAvgPM25) / currentAvgPM25) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDataPointClick = (label: string, value: number, datasetIndex: number) => {
    const dataPoint: DataPoint = {
      timestamp: new Date(),
      value,
      context: `${label} - ${datasetIndex === 0 || datasetIndex === 1 ? "Current" : "Predicted"}`,
    };
    onDataPointClick?.(dataPoint);
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00FF88"; // Good
    if (aqi <= 100) return "#fbbf24"; // Moderate
    if (aqi <= 150) return "#f97316"; // Unhealthy for sensitive
    return "#ef4444"; // Unhealthy
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive";
    return "Unhealthy";
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
        <h3 className="text-2xl font-bold text-white mb-2">Pollution Monitoring & Control</h3>
        <p className="text-gray-300">Real-time air quality monitoring with AI-driven pollution reduction</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <MetricCard
          title="Air Quality Improvement"
          value={aqiImprovement}
          unit="%"
          trend="up"
          change={aqiImprovement}
          color="#00FF88"
        />
        <MetricCard
          title="Emissions Reduction"
          value={emissionsReduction}
          unit="%"
          trend="down"
          change={emissionsReduction}
          color="#00D9FF"
        />
        <MetricCard
          title="PM2.5 Reduction"
          value={pm25Reduction}
          unit="%"
          trend="down"
          change={pm25Reduction}
          color="#9D4EDD"
        />
      </motion.div>

      {/* Current AQI Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Current Air Quality Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: getAQIColor(currentAvgAQI) }}>
              {Math.round(currentAvgAQI)}
            </div>
            <div className="text-sm text-gray-400">Current AQI</div>
            <div className="text-lg font-medium mt-1" style={{ color: getAQIColor(currentAvgAQI) }}>
              {getAQILabel(currentAvgAQI)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{ color: getAQIColor(predictedAvgAQI) }}>
              {Math.round(predictedAvgAQI)}
            </div>
            <div className="text-sm text-gray-400">Predicted AQI</div>
            <div className="text-lg font-medium mt-1" style={{ color: getAQIColor(predictedAvgAQI) }}>
              {getAQILabel(predictedAvgAQI)}
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
            { id: "aqi", label: "Air Quality Index", color: "#00FF88" },
            { id: "sources", label: "Pollution Sources", color: "#ef4444" },
            { id: "particulate", label: "Particulate Matter", color: "#9D4EDD" },
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
            {selectedMetric === "aqi" && "24-Hour Air Quality Prediction"}
            {selectedMetric === "sources" && "Pollution Source Analysis"}
            {selectedMetric === "particulate" && "Particulate Matter Monitoring"}
          </h4>
          <p className="text-sm text-gray-400">
            {selectedMetric === "aqi" && "Real-time AQI monitoring with AI predictions"}
            {selectedMetric === "sources" && "Major pollution sources identified and tracked"}
            {selectedMetric === "particulate" && "PM2.5 and PM10 levels across city locations"}
          </p>
        </div>

        <div className="h-64">
          {selectedMetric === "aqi" && (
            <LineChart
              data={airQualityData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00FF88", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Time of Day", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "AQI Value", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "sources" && (
            <BarChart
              data={sourcesData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#ef4444", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Pollution Sources", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Emissions (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "particulate" && (
            <BarChart
              data={particulateData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#9D4EDD", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "City Locations", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Particulate Level (μg/m³)", grid: { display: true, color: "#374151" }, beginAtZero: true },
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
          { feature: "Emission Monitoring", enabled: solution.features.emissionMonitoring, description: "Real-time emission tracking" },
          { feature: "Quality Prediction", enabled: solution.features.qualityPrediction, description: "AI-powered air quality forecasts" },
          { feature: "Source Identification", enabled: solution.features.sourceIdentification, description: "Pollution source detection" },
          { feature: "Alert System", enabled: solution.features.alertSystem, description: "Automated pollution alerts" },
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

      {/* Alert Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Air Quality Alert Thresholds</h4>
        <div className="space-y-4">
          {[
            { level: "Good", threshold: 50, color: "#00FF88", current: Math.round(currentAvgAQI) },
            { level: "Moderate", threshold: 100, color: "#fbbf24", current: Math.round(currentAvgAQI) },
            { level: "Unhealthy for Sensitive", threshold: 150, color: "#f97316", current: Math.round(currentAvgAQI) },
            { level: "Unhealthy", threshold: 200, color: "#ef4444", current: Math.round(currentAvgAQI) },
          ].map((threshold, index) => (
            <div key={threshold.level}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{threshold.level}</span>
                <span className="text-sm" style={{ color: threshold.color }}>
                  {threshold.current} / {threshold.threshold} AQI
                </span>
              </div>
              <ProgressBar 
                value={Math.min(100, (threshold.current / threshold.threshold) * 100)} 
                color={threshold.color}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

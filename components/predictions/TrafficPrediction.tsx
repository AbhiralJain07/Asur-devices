"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { TrafficProblem, TrafficSolution, ChartData, DataPoint } from "../../types";
import { LineChart, BarChart, MetricCard, ProgressBar } from "../ui/Charts";

interface TrafficPredictionProps {
  problem: TrafficProblem;
  solution: TrafficSolution;
  className?: string;
  onDataPointClick?: (dataPoint: DataPoint) => void;
}

// Traffic flow prediction generator
function generateTrafficPredictionData(): ChartData {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const currentFlow = Array.from({ length: 24 }, (_, i) => {
    const baseFlow = 30 + Math.sin((i / 24) * Math.PI * 2) * 25;
    const randomVariation = (Math.random() - 0.5) * 10;
    return Math.max(10, Math.min(95, baseFlow + randomVariation));
  });
  
  const predictedFlow = currentFlow.map((flow, i) => {
    // AI prediction improves flow by 15-25%
    const improvement = 0.15 + Math.random() * 0.1;
    return Math.min(95, flow * (1 + improvement));
  });

  return {
    labels: hours,
    datasets: [
      {
        label: "Current Traffic Flow",
        data: currentFlow,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "AI Predicted Flow",
        data: predictedFlow,
        borderColor: "#00D9FF",
        backgroundColor: "rgba(0, 217, 255, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Congestion heatmap data
function generateCongestionData(): ChartData {
  const areas = ["Downtown", "Highway", "Residential", "Industrial", "Commercial"];
  const currentCongestion = areas.map(() => 60 + Math.random() * 35);
  const predictedCongestion = currentCongestion.map(level => Math.max(20, level * 0.6));

  return {
    labels: areas,
    datasets: [
      {
        label: "Current Congestion",
        data: currentCongestion,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Predicted Congestion",
        data: predictedCongestion,
        backgroundColor: "rgba(0, 217, 255, 0.8)",
        borderColor: "#00D9FF",
        borderWidth: 1,
      },
    ],
  };
}

// Incident prediction data
function generateIncidentData(): ChartData {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentIncidents = days.map(() => Math.floor(Math.random() * 15) + 5);
  const predictedIncidents = currentIncidents.map(incidents => Math.max(2, Math.floor(incidents * 0.4)));

  return {
    labels: days,
    datasets: [
      {
        label: "Current Incidents",
        data: currentIncidents,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
      {
        label: "Predicted Incidents",
        data: predictedIncidents,
        backgroundColor: "rgba(0, 217, 255, 0.8)",
        borderColor: "#00D9FF",
        borderWidth: 1,
      },
    ],
  };
}

export default function TrafficPrediction({
  problem,
  solution,
  className = "",
  onDataPointClick,
}: TrafficPredictionProps) {
  const [selectedMetric, setSelectedMetric] = useState<"flow" | "congestion" | "incidents">("flow");
  const [isAnimating, setIsAnimating] = useState(true);

  const trafficFlowData = useMemo(() => generateTrafficPredictionData(), []);
  const congestionData = useMemo(() => generateCongestionData(), []);
  const incidentData = useMemo(() => generateIncidentData(), []);

  // Calculate metrics
  const currentAvgFlow = trafficFlowData.datasets[0].data.reduce((a, b) => a + b, 0) / trafficFlowData.datasets[0].data.length;
  const predictedAvgFlow = trafficFlowData.datasets[1].data.reduce((a, b) => a + b, 0) / trafficFlowData.datasets[1].data.length;
  const improvement = ((predictedAvgFlow - currentAvgFlow) / currentAvgFlow) * 100;

  const currentCongestion = congestionData.datasets[0].data.reduce((a, b) => a + b, 0) / congestionData.datasets[0].data.length;
  const predictedCongestion = congestionData.datasets[1].data.reduce((a, b) => a + b, 0) / congestionData.datasets[1].data.length;
  const congestionReduction = ((currentCongestion - predictedCongestion) / currentCongestion) * 100;

  const currentIncidents = incidentData.datasets[0].data.reduce((a, b) => a + b, 0);
  const predictedIncidents = incidentData.datasets[1].data.reduce((a, b) => a + b, 0);
  const incidentReduction = ((currentIncidents - predictedIncidents) / currentIncidents) * 100;

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Traffic Prediction & Optimization</h3>
        <p className="text-gray-300">AI-powered traffic management reducing congestion and improving flow</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <MetricCard
          title="Traffic Flow Improvement"
          value={improvement}
          unit="%"
          trend="up"
          change={improvement}
          color="#00D9FF"
        />
        <MetricCard
          title="Congestion Reduction"
          value={congestionReduction}
          unit="%"
          trend="down"
          change={congestionReduction}
          color="#00FF88"
        />
        <MetricCard
          title="Incident Prevention"
          value={incidentReduction}
          unit="%"
          trend="down"
          change={incidentReduction}
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
            { id: "flow", label: "Traffic Flow", color: "#00D9FF" },
            { id: "congestion", label: "Congestion", color: "#ef4444" },
            { id: "incidents", label: "Incidents", color: "#9D4EDD" },
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
            {selectedMetric === "flow" && "24-Hour Traffic Flow Prediction"}
            {selectedMetric === "congestion" && "Area Congestion Analysis"}
            {selectedMetric === "incidents" && "Weekly Incident Prediction"}
          </h4>
          <p className="text-sm text-gray-400">
            {selectedMetric === "flow" && "Real-time traffic flow optimization with AI predictions"}
            {selectedMetric === "congestion" && "Congestion hotspots identified and mitigated"}
            {selectedMetric === "incidents" && "Predictive incident prevention and response"}
          </p>
        </div>

        <div className="h-64">
          {selectedMetric === "flow" && (
            <LineChart
              data={trafficFlowData}
              config={{
                type: "line",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Time of Day", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Traffic Flow (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "congestion" && (
            <BarChart
              data={congestionData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "City Areas", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Congestion Level (%)", grid: { display: true, color: "#374151" }, beginAtZero: true },
                },
              }}
              onDataPointClick={handleDataPointClick}
              height={256}
            />
          )}
          {selectedMetric === "incidents" && (
            <BarChart
              data={incidentData}
              config={{
                type: "bar",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: { enabled: true, backgroundColor: "#1A1A2E", titleColor: "#00D9FF", bodyColor: "#ffffff" },
                },
                scales: {
                  x: { display: true, title: "Day of Week", grid: { display: false, color: "#374151" } },
                  y: { display: true, title: "Number of Incidents", grid: { display: true, color: "#374151" }, beginAtZero: true },
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
          { feature: "Signal Optimization", enabled: solution.features.signalOptimization, description: "AI-optimized traffic signals" },
          { feature: "Route Planning", enabled: solution.features.routePlanning, description: "Dynamic route recommendations" },
          { feature: "Incident Prediction", enabled: solution.features.incidentPrediction, description: "Predictive incident detection" },
          { feature: "Demand Management", enabled: solution.features.demandManagement, description: "Traffic demand balancing" },
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

      {/* Implementation Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass rounded-lg border border-white/10 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Implementation Timeline</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Phase 1: Infrastructure Setup</span>
              <span className="text-sm text-neon-blue">2 months</span>
            </div>
            <ProgressBar value={100} color="#00D9FF" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Phase 2: AI Model Training</span>
              <span className="text-sm text-neon-green">1 month</span>
            </div>
            <ProgressBar value={75} color="#00FF88" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Phase 3: System Integration</span>
              <span className="text-sm text-neon-purple">3 weeks</span>
            </div>
            <ProgressBar value={45} color="#9D4EDD" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

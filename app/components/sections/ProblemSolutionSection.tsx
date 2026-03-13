"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrafficProblem, TrafficSolution, UrbanProblem, ProblemSolutionPair } from "../../types/problemVisualization";
import { CityDataGenerator } from "../../lib/utils/cityGenerator";
import Button from "../ui/Button";
import { ScrollAnimation } from "../ui";

// Lazy load the visualization components
const TrafficPrediction = lazy(() => 
  import("../../../components/predictions/TrafficPrediction")
);
const PollutionMonitoring = lazy(() => 
  import("../../../components/monitoring/PollutionMonitoring")
);
const WasteManagement = lazy(() => 
  import("../../../components/monitoring/WasteManagement")
);
const EnergyOptimization = lazy(() => 
  import("../../../components/predictions/EnergyOptimization")
);

interface ProblemSolutionSectionProps {
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  className?: string;
}

// Loading fallback for visualizations
function VisualizationFallback() {
  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden glass border border-white/10 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mx-auto"></div>
        <div className="text-neon-blue">Loading Solution Visualization...</div>
        <div className="text-sm text-gray-400">Preparing urban problem analysis</div>
      </div>
    </div>
  );
}

// Problem card component
function ProblemCard({
  problem,
  isActive,
  onClick,
  index,
}: {
  problem: UrbanProblem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return "🚨";
      case "high": return "⚠️";
      case "medium": return "⚡";
      case "low": return "✅";
      default: return "📊";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className={`p-6 glass rounded-lg border cursor-pointer transition-all ${
        isActive ? "border-neon-blue/50 bg-neon-blue/5" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl">
            {problem.category === "traffic" && "🚗"}
            {problem.category === "pollution" && "🌫️"}
            {problem.category === "waste" && "🗑️"}
            {problem.category === "energy" && "⚡"}
          </div>
          <div className={`text-sm font-medium ${getSeverityColor(problem.severity)}`}>
            {getSeverityIcon(problem.severity)} {problem.severity.toUpperCase()}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white">{problem.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-3">{problem.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Economic Impact</span>
            <span className="text-sm font-bold text-red-500">${problem.impact.economic}M/year</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Environmental Impact</span>
            <span className="text-sm font-bold text-orange-500">{problem.impact.environmental}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Social Impact</span>
            <span className="text-sm font-bold text-yellow-500">{problem.impact.social}/100</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-white/10">
          <div className="text-xs text-gray-400">
            {problem.solutions.length} AI solutions available
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Solution overview component
function SolutionOverview({ problem, solution }: { problem: UrbanProblem; solution: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 glass rounded-lg border border-neon-green/30"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-neon-green rounded-full"></div>
          <h3 className="text-lg font-bold text-white">AI Solution Overview</h3>
        </div>
        
        <div>
          <h4 className="font-bold text-neon-green mb-2">{solution.title}</h4>
          <p className="text-sm text-gray-300">{solution.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Effectiveness</div>
            <div className="text-lg font-bold text-neon-green">{solution.effectiveness}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Implementation Time</div>
            <div className="text-lg font-bold text-neon-blue">{solution.implementationTime}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Implementation Cost</div>
            <div className="text-lg font-bold text-yellow-500">${solution.cost}M</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">ROI</div>
            <div className="text-lg font-bold text-neon-purple">{solution.roi}%</div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <div className="text-sm text-gray-400 mb-2">Key Benefits:</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span className="text-xs text-gray-300">Reduces economic impact by ${Math.round(problem.impact.economic * 0.7)}M/year</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
              <span className="text-xs text-gray-300">Improves environmental score by {Math.round(problem.impact.environmental * 0.6)} points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
              <span className="text-xs text-gray-300">Enhances social quality of life by {Math.round(problem.impact.social * 0.5)} points</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProblemSolutionSection({
  title = "Urban Problems & AI Solutions",
  subtitle = "Discover how our AI-powered platform transforms critical urban challenges into opportunities for smarter, more sustainable cities",
  showControls = true,
  className = "",
}: ProblemSolutionSectionProps) {
  const [problems, setProblems] = useState<UrbanProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<UrbanProblem | null>(null);
  const [selectedSolution, setSelectedSolution] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Generate sample problems and solutions
    const generator = new CityDataGenerator();
    const sampleProblems: UrbanProblem[] = [
      {
        id: "traffic-congestion",
        title: "Traffic Congestion",
        description: "Severe traffic congestion during peak hours causing significant economic losses and reduced quality of life. Current infrastructure cannot handle growing vehicle volumes.",
        category: "traffic",
        severity: "high",
        impact: {
          economic: 45,
          environmental: 75,
          social: 80,
        },
        metrics: {
          currentValue: 35,
          targetValue: 75,
          unit: "%",
          trend: "worsening",
          historicalData: [],
        },
        solutions: [
          {
            id: "ai-traffic-optimization",
            title: "AI Traffic Optimization System",
            description: "Advanced AI algorithms optimize traffic signals, predict congestion, and dynamically reroute vehicles to minimize delays.",
            type: "ai-optimization",
            effectiveness: 85,
            implementationTime: "6 months",
            cost: 12,
            roi: 250,
            metrics: {
              improvementRate: 35,
              timeToImpact: "3 months",
              sustainabilityScore: 90,
              scalability: "high",
            },
          } as TrafficSolution,
        ],
      },
      {
        id: "air-pollution",
        title: "Air Quality Issues",
        description: "Poor air quality exceeding safe limits, particularly in industrial zones and high-traffic areas. Affects public health and environmental sustainability.",
        category: "pollution",
        severity: "critical",
        impact: {
          economic: 32,
          environmental: 90,
          social: 85,
        },
        metrics: {
          currentValue: 120,
          targetValue: 50,
          unit: "AQI",
          trend: "stable",
          historicalData: [],
        },
        solutions: [
          {
            id: "pollution-monitoring",
            title: "Real-time Pollution Monitoring",
            description: "Comprehensive air quality monitoring network with AI-powered prediction and automated alert systems.",
            type: "monitoring",
            effectiveness: 92,
            implementationTime: "4 months",
            cost: 8,
            roi: 180,
            metrics: {
              improvementRate: 40,
              timeToImpact: "2 months",
              sustainabilityScore: 95,
              scalability: "high",
            },
          } as any,
        ],
      },
      {
        id: "waste-management",
        title: "Inefficient Waste Management",
        description: "Outdated waste collection systems leading to overflow, environmental contamination, and high operational costs.",
        category: "waste",
        severity: "medium",
        impact: {
          economic: 18,
          environmental: 65,
          social: 60,
        },
        metrics: {
          currentValue: 68,
          targetValue: 90,
          unit: "%",
          trend: "stable",
          historicalData: [],
        },
        solutions: [
          {
            id: "smart-waste-system",
            title: "Smart Waste Management System",
            description: "IoT-enabled waste bins with AI-powered collection route optimization and predictive scheduling.",
            type: "automation",
            effectiveness: 78,
            implementationTime: "5 months",
            cost: 6,
            roi: 220,
            metrics: {
              improvementRate: 25,
              timeToImpact: "1 month",
              sustainabilityScore: 85,
              scalability: "medium",
            },
          } as any,
        ],
      },
      {
        id: "energy-inefficiency",
        title: "Energy Inefficiency",
        description: "High energy consumption with low efficiency rates and insufficient renewable energy integration.",
        category: "energy",
        severity: "high",
        impact: {
          economic: 28,
          environmental: 80,
          social: 55,
        },
        metrics: {
          currentValue: 45,
          targetValue: 75,
          unit: "%",
          trend: "improving",
          historicalData: [],
        },
        solutions: [
          {
            id: "energy-optimization",
            title: "AI Energy Management Platform",
            description: "Intelligent energy consumption optimization with demand forecasting and renewable integration.",
            type: "ai-optimization",
            effectiveness: 88,
            implementationTime: "8 months",
            cost: 15,
            roi: 280,
            metrics: {
              improvementRate: 30,
              timeToImpact: "4 months",
              sustainabilityScore: 92,
              scalability: "high",
            },
          } as any,
        ],
      },
    ];

    setProblems(sampleProblems);
    setSelectedProblem(sampleProblems[0]);
    setSelectedSolution(sampleProblems[0].solutions[0]);

    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleProblemSelect = (problem: UrbanProblem) => {
    setSelectedProblem(problem);
    setSelectedSolution(problem.solutions[0]);
  };

  const renderVisualization = () => {
    if (!selectedProblem || !selectedSolution) return null;

    switch (selectedProblem.category) {
      case "traffic":
        return (
          <TrafficPrediction
            problem={selectedProblem as unknown as TrafficProblem}
            solution={selectedSolution as unknown as TrafficSolution}
          />
        );
      case "pollution":
        return (
          <PollutionMonitoring
            problem={selectedProblem as any}
            solution={selectedSolution as any}
          />
        );
      case "waste":
        return (
          <WasteManagement
            problem={selectedProblem as any}
            solution={selectedSolution as any}
          />
        );
      case "energy":
        return (
          <EnergyOptimization
            problem={selectedProblem as any}
            solution={selectedSolution as any}
          />
        );
      default:
        return <VisualizationFallback />;
    }
  };

  return (
    <section className={`relative py-20 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollAnimation animation="fade" direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex mb-4">
              <div className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                <span className="text-neon-blue text-sm font-medium">
                  🎯 Problem-Solution Mapping
                </span>
              </div>
            </div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">{title}</span>
            </motion.h2>

            <motion.p 
              className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {subtitle}
            </motion.p>

            {/* Key Stats */}
            <ScrollAnimation animation="slide" direction="up" delay={0.6}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">
                    {problems.length}
                  </div>
                  <div className="text-sm text-gray-400">Critical Problems</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-green mb-2">
                    {problems.reduce((sum, p) => sum + p.solutions.length, 0)}
                  </div>
                  <div className="text-sm text-gray-400">AI Solutions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-blue mb-2">
                    85%
                  </div>
                  <div className="text-sm text-gray-400">Avg Effectiveness</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-purple mb-2">
                    230%
                  </div>
                  <div className="text-sm text-gray-400">Avg ROI</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>

        {/* Problem Selection */}
        <ScrollAnimation animation="slide" direction="up" delay={0.8}>
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Select an Urban Challenge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {problems.map((problem, index) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  isActive={selectedProblem?.id === problem.id}
                  onClick={() => handleProblemSelect(problem)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* Solution Visualization */}
        <AnimatePresence mode="wait">
          {selectedProblem && selectedSolution && (
            <motion.div
              key={selectedProblem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <Suspense fallback={<VisualizationFallback />}>
                    {renderVisualization()}
                  </Suspense>
                </div>
                <div>
                  <SolutionOverview problem={selectedProblem} solution={selectedSolution} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <ScrollAnimation animation="slide" direction="up" delay={1}>
          <div className="text-center">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Transform Your Urban Challenges
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how our AI-powered solutions can address your city's specific problems with measurable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Request Custom Analysis
                </Button>
                <Button variant="outline" size="lg">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

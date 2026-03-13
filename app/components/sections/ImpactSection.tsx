"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactMetrics, ImpactMetricsCollection, MetricCategory } from "../../types/impactMetrics";
import { AnimatedCounter, MetricDisplay, StatsGrid, ProgressRing } from "../ui/MetricDisplay";
import { ScrollAnimation } from "../ui";
import { ResponsiveVisualization } from "../ui/ResponsiveVisualization";
import { AccessibilityVisualization } from "../ui/AccessibilityVisualization";

// Sample impact metrics data
const sampleImpactMetrics: ImpactMetrics[] = [
  {
    id: "cost-savings",
    category: "economic",
    title: "Cost Savings",
    description: "Reduced operational costs through AI optimization",
    currentValue: 2450000,
    targetValue: 3000000,
    unit: "$",
    trend: "up",
    change: 18.5,
    changePeriod: "vs last year",
    icon: "💰",
    color: "#00FF88",
    isAnimated: true,
    animationDuration: 2000,
    precision: 0,
    prefix: "$",
    format: "currency",
    lastUpdated: new Date(),
  },
  {
    id: "efficiency-gain",
    category: "efficiency",
    title: "Efficiency Gain",
    description: "Improved operational efficiency across all departments",
    currentValue: 78,
    targetValue: 85,
    unit: "%",
    trend: "up",
    change: 12.3,
    changePeriod: "vs last quarter",
    icon: "⚡",
    color: "#00D9FF",
    isAnimated: true,
    animationDuration: 1500,
    precision: 1,
    suffix: "%",
    format: "percentage",
    lastUpdated: new Date(),
  },
  {
    id: "carbon-reduction",
    category: "environmental",
    title: "Carbon Footprint Reduction",
    description: "Environmental impact through sustainable practices",
    currentValue: 45000,
    targetValue: 60000,
    unit: "tons",
    trend: "up",
    change: 25.8,
    changePeriod: "vs last year",
    icon: "🌱",
    color: "#22c55e",
    isAnimated: true,
    animationDuration: 2500,
    precision: 0,
    suffix: " tons CO₂",
    format: "number",
    lastUpdated: new Date(),
  },
  {
    id: "citizen-satisfaction",
    category: "social",
    title: "Citizen Satisfaction",
    description: "Improved quality of life and public services",
    currentValue: 92,
    targetValue: 95,
    unit: "%",
    trend: "up",
    change: 8.7,
    changePeriod: "vs last 6 months",
    icon: "😊",
    color: "#fbbf24",
    isAnimated: true,
    animationDuration: 1800,
    precision: 1,
    suffix: "%",
    format: "percentage",
    lastUpdated: new Date(),
  },
  {
    id: "response-time",
    category: "safety",
    title: "Emergency Response Time",
    description: "Faster emergency response and incident resolution",
    currentValue: 4.2,
    targetValue: 3.0,
    unit: "minutes",
    trend: "down",
    change: -15.4,
    changePeriod: "vs last year",
    icon: "🚑",
    color: "#ef4444",
    isAnimated: true,
    animationDuration: 2200,
    precision: 1,
    suffix: " min",
    format: "number",
    lastUpdated: new Date(),
  },
  {
    id: "energy-efficiency",
    category: "sustainability",
    title: "Energy Efficiency",
    description: "Reduced energy consumption and increased renewable usage",
    currentValue: 68,
    targetValue: 80,
    unit: "%",
    trend: "up",
    change: 22.1,
    changePeriod: "vs last year",
    icon: "⚡",
    color: "#9D4EDD",
    isAnimated: true,
    animationDuration: 2000,
    precision: 1,
    suffix: "%",
    format: "percentage",
    lastUpdated: new Date(),
  },
];

// Impact metrics collections
const impactCollections: ImpactMetricsCollection[] = [
  {
    id: "economic-impact",
    title: "Economic Impact",
    description: "Financial benefits and cost savings",
    category: "economic",
    metrics: sampleImpactMetrics.filter(m => m.category === "economic"),
    layout: "grid",
    isExpanded: true,
    showComparisons: true,
    showTrends: true,
    showTargets: true,
    animationDelay: 0,
    refreshInterval: 30000,
  },
  {
    id: "environmental-impact",
    title: "Environmental Impact",
    description: "Sustainability and environmental benefits",
    category: "environmental",
    metrics: sampleImpactMetrics.filter(m => m.category === "environmental"),
    layout: "grid",
    isExpanded: true,
    showComparisons: true,
    showTrends: true,
    showTargets: true,
    animationDelay: 200,
    refreshInterval: 30000,
  },
  {
    id: "social-impact",
    title: "Social Impact",
    description: "Community and citizen benefits",
    category: "social",
    metrics: sampleImpactMetrics.filter(m => m.category === "social"),
    layout: "grid",
    isExpanded: true,
    showComparisons: true,
    showTrends: true,
    showTargets: true,
    animationDelay: 400,
    refreshInterval: 30000,
  },
];

// Category filter component
function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className = "",
}: {
  selectedCategory: MetricCategory | "all";
  onCategoryChange: (category: MetricCategory | "all") => void;
  className?: string;
}) {
  const categories: (MetricCategory | "all")[] = [
    "all",
    "economic",
    "environmental",
    "social",
    "operational",
    "safety",
    "efficiency",
    "sustainability",
    "innovation",
  ];

  const categoryInfo = {
    all: { label: "All Metrics", icon: "📊", color: "#00D9FF" },
    economic: { label: "Economic", icon: "💰", color: "#00FF88" },
    environmental: { label: "Environmental", icon: "🌱", color: "#22c55e" },
    social: { label: "Social", icon: "😊", color: "#fbbf24" },
    operational: { label: "Operational", icon: "⚙️", color: "#f97316" },
    safety: { label: "Safety", icon: "🛡️", color: "#ef4444" },
    efficiency: { label: "Efficiency", icon: "⚡", color: "#00D9FF" },
    sustainability: { label: "Sustainability", icon: "🌍", color: "#9D4EDD" },
    innovation: { label: "Innovation", icon: "💡", color: "#a855f7" },
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => {
        const info = categoryInfo[category];
        const isSelected = selectedCategory === category;
        
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
              isSelected
                ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="mr-2">{info.icon}</span>
            {info.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Summary stats component
function SummaryStats({
  metrics,
  className = "",
}: {
  metrics: ImpactMetrics[];
  className?: string;
}) {
  const totalSavings = metrics
    .filter(m => m.category === "economic")
    .reduce((sum, m) => sum + m.currentValue, 0);

  const avgImprovement = metrics.reduce((sum, m) => sum + Math.abs(m.change), 0) / metrics.length;

  const targetAchievement = metrics
    .filter(m => m.targetValue)
    .reduce((sum, m) => sum + (m.currentValue / m.targetValue) * 100, 0) / 
    metrics.filter(m => m.targetValue).length;

  const positiveTrends = metrics.filter(m => m.trend === "up").length;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <AnimatedCounter
          value={totalSavings}
          duration={2000}
          prefix="$"
          precision={0}
          format="currency"
          className="text-3xl font-bold text-neon-green"
        />
        <div className="text-sm text-gray-400 mt-2">Total Savings</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <AnimatedCounter
          value={avgImprovement}
          duration={1500}
          suffix="%"
          precision={1}
          className="text-3xl font-bold text-neon-blue"
        />
        <div className="text-sm text-gray-400 mt-2">Avg Improvement</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <AnimatedCounter
          value={targetAchievement}
          duration={1800}
          suffix="%"
          precision={1}
          className="text-3xl font-bold text-neon-purple"
        />
        <div className="text-sm text-gray-400 mt-2">Target Achievement</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <AnimatedCounter
          value={positiveTrends}
          duration={1200}
          suffix={`/${metrics.length}`}
          precision={0}
          className="text-3xl font-bold text-yellow-500"
        />
        <div className="text-sm text-gray-400 mt-2">Positive Trends</div>
      </motion.div>
    </div>
  );
}

// Progress overview component
function ProgressOverview({
  metrics,
  className = "",
}: {
  metrics: ImpactMetrics[];
  className?: string;
}) {
  const topMetrics = metrics
    .filter(m => m.targetValue)
    .sort((a, b) => (b.currentValue / b.targetValue) - (a.currentValue / a.targetValue))
    .slice(0, 6);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {topMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProgressRing metric={metric} size={120} />
        </motion.div>
      ))}
    </div>
  );
}

// Main impact section component
export default function ImpactSection({
  title = "Real-World Impact",
  subtitle = "Measurable results that transform cities and improve lives",
  showSummary = true,
  showProgress = true,
  showFilters = true,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  showSummary?: boolean;
  showProgress?: boolean;
  showFilters?: boolean;
  className?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory | "all">("all");
  const [filteredMetrics, setFilteredMetrics] = useState(sampleImpactMetrics);
  const [selectedCollection, setSelectedCollection] = useState<ImpactMetricsCollection | null>(null);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredMetrics(sampleImpactMetrics);
    } else {
      setFilteredMetrics(sampleImpactMetrics.filter(m => m.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleCollectionClick = (collection: ImpactMetricsCollection) => {
    setSelectedCollection(collection);
    setSelectedCategory(collection.category);
  };

  return (
    <AccessibilityVisualization className={className}>
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <ScrollAnimation animation="fade" direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex mb-4">
                <div className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-full">
                  <span className="text-neon-green text-sm font-medium">
                    📈 Impact Metrics
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
            </div>
          </ScrollAnimation>

          {/* Summary Stats */}
          {showSummary && (
            <ScrollAnimation animation="slide" direction="up" delay={0.6}>
              <div className="mb-12">
                <SummaryStats metrics={filteredMetrics} />
              </div>
            </ScrollAnimation>
          )}

          {/* Category Filters */}
          {showFilters && (
            <ScrollAnimation animation="slide" direction="up" delay={0.8}>
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Filter by Category
                </h3>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  className="justify-center"
                />
              </div>
            </ScrollAnimation>
          )}

          {/* Impact Collections */}
          <ScrollAnimation animation="slide" direction="up" delay={1}>
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Impact Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {impactCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="glass rounded-lg border border-white/10 p-6 cursor-pointer hover:border-neon-blue/30 transition-colors"
                    onClick={() => handleCollectionClick(collection)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">
                        {collection.category === "economic" && "💰"}
                        {collection.category === "environmental" && "🌱"}
                        {collection.category === "social" && "😊"}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{collection.title}</h4>
                        <p className="text-sm text-gray-400">{collection.description}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {collection.metrics.slice(0, 3).map((metric) => (
                        <div key={metric.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">{metric.title}</span>
                          <span className="text-sm font-bold" style={{ color: metric.color }}>
                            {metric.change > 0 ? "+" : ""}{metric.change}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Metrics Grid */}
          <ScrollAnimation animation="slide" direction="up" delay={1.2}>
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {selectedCategory === "all" ? "All Metrics" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Metrics`}
              </h3>
              <StatsGrid metrics={filteredMetrics} columns={3} />
            </div>
          </ScrollAnimation>

          {/* Progress Overview */}
          {showProgress && (
            <ScrollAnimation animation="slide" direction="up" delay={1.4}>
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Progress Towards Goals
                </h3>
                <ProgressOverview metrics={filteredMetrics} />
              </div>
            </ScrollAnimation>
          )}

          {/* Call to Action */}
          <ScrollAnimation animation="slide" direction="up" delay={1.6}>
            <div className="text-center">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Transform Your City Today
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Join the growing number of cities achieving remarkable results with our AI-powered solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors">
                    Get Started
                  </button>
                  <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-medium hover:border-white/40 transition-colors">
                    View Case Studies
                  </button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </AccessibilityVisualization>
  );
}

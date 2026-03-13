// Problem-Solution Visualization Types

export interface UrbanProblem {
  id: string;
  title: string;
  description: string;
  category: "traffic" | "pollution" | "waste" | "energy";
  severity: "low" | "medium" | "high" | "critical";
  impact: {
    economic: number; // Cost in millions
    environmental: number; // Impact score 0-100
    social: number; // Quality of life impact 0-100
  };
  metrics: ProblemMetrics;
  solutions: Solution[];
}

export interface ProblemMetrics {
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "improving" | "stable" | "worsening";
  historicalData: DataPoint[];
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  context?: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  type: "ai-optimization" | "predictive-analytics" | "automation" | "monitoring";
  effectiveness: number; // 0-100 percentage
  implementationTime: string; // e.g., "3 months"
  cost: number; // Implementation cost in millions
  roi: number; // Return on investment percentage
  metrics: SolutionMetrics;
}

export interface SolutionMetrics {
  improvementRate: number; // Percentage improvement
  timeToImpact: string; // Time to see results
  sustainabilityScore: number; // 0-100
  scalability: "low" | "medium" | "high";
}

export interface ProblemSolutionPair {
  problem: UrbanProblem;
  solution: Solution;
  visualization: VisualizationConfig;
}

export interface VisualizationConfig {
  type: "chart" | "graph" | "heatmap" | "timeline" | "comparison";
  chartType?: "line" | "bar" | "pie" | "area" | "scatter";
  dataSource: string;
  updateInterval: number; // milliseconds
  interactive: boolean;
  animations: boolean;
  colorScheme: "blue" | "green" | "purple" | "orange" | "red";
}

// Traffic-specific types
export interface TrafficProblem {
  id: string;
  title: string;
  description: string;
  category: "traffic";
  severity: "low" | "medium" | "high" | "critical";
  impact: {
    economic: number; // Cost in millions
    environmental: number; // Impact score 0-100
    social: number; // Quality of life impact 0-100
  };
  metrics: {
    congestionLevel: ProblemMetrics;
    averageSpeed: ProblemMetrics;
    incidentRate: ProblemMetrics;
    publicTransportUsage: ProblemMetrics;
  };
  solutions: TrafficSolution[];
}

export interface TrafficSolution extends Solution {
  type: "ai-optimization" | "predictive-analytics" | "automation" | "monitoring";
  features: {
    signalOptimization: boolean;
    routePlanning: boolean;
    incidentPrediction: boolean;
    demandManagement: boolean;
  };
}

// Pollution-specific types
export interface PollutionProblem {
  id: string;
  title: string;
  description: string;
  category: "pollution";
  severity: "low" | "medium" | "high" | "critical";
  impact: {
    economic: number; // Cost in millions
    environmental: number; // Impact score 0-100
    social: number; // Quality of life impact 0-100
  };
  metrics: {
    airQualityIndex: ProblemMetrics;
    particulateMatter: ProblemMetrics;
    carbonEmissions: ProblemMetrics;
    noiseLevels: ProblemMetrics;
  };
  solutions: PollutionSolution[];
}

export interface PollutionSolution extends Solution {
  type: "ai-optimization" | "predictive-analytics" | "automation" | "monitoring";
  features: {
    emissionMonitoring: boolean;
    qualityPrediction: boolean;
    sourceIdentification: boolean;
    alertSystem: boolean;
  };
}

// Waste-specific types
export interface WasteProblem {
  id: string;
  title: string;
  description: string;
  category: "waste";
  severity: "low" | "medium" | "high" | "critical";
  impact: {
    economic: number; // Cost in millions
    environmental: number; // Impact score 0-100
    social: number; // Quality of life impact 0-100
  };
  metrics: {
    collectionEfficiency: ProblemMetrics;
    recyclingRate: ProblemMetrics;
    landfillUsage: ProblemMetrics;
    operationalCosts: ProblemMetrics;
  };
  solutions: WasteSolution[];
}

export interface WasteSolution extends Solution {
  type: "ai-optimization" | "predictive-analytics" | "automation" | "monitoring";
  features: {
    routeOptimization: boolean;
    fillLevelMonitoring: boolean;
    predictiveScheduling: boolean;
    wasteSorting: boolean;
  };
}

// Energy-specific types
export interface EnergyProblem {
  id: string;
  title: string;
  description: string;
  category: "energy";
  severity: "low" | "medium" | "high" | "critical";
  impact: {
    economic: number; // Cost in millions
    environmental: number; // Impact score 0-100
    social: number; // Quality of life impact 0-100
  };
  metrics: {
    consumption: ProblemMetrics;
    efficiency: ProblemMetrics;
    renewableUsage: ProblemMetrics;
    gridStability: ProblemMetrics;
  };
  solutions: EnergySolution[];
}

export interface EnergySolution extends Solution {
  type: "ai-optimization" | "predictive-analytics" | "automation" | "monitoring";
  features: {
    demandForecasting: boolean;
    loadBalancing: boolean;
    renewableIntegration: boolean;
    storageOptimization: boolean;
  };
}

// Chart and visualization types
export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartConfig {
  type: "line" | "bar" | "pie" | "doughnut" | "area" | "scatter";
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: "top" | "bottom" | "left" | "right";
    };
    tooltip: {
      enabled: boolean;
      backgroundColor: string;
      titleColor: string;
      bodyColor: string;
    };
  };
  scales?: {
    x: {
      display: boolean;
      title: string;
      grid: {
        display: boolean;
        color: string;
      };
    };
    y: {
      display: boolean;
      title: string;
      grid: {
        display: boolean;
        color: string;
      };
      beginAtZero: boolean;
    };
  };
}

// Animation and interaction types
export interface AnimationConfig {
  duration: number;
  easing: "linear" | "easeIn" | "easeOut" | "easeInOut";
  delay: number;
  repeat: boolean;
  repeatDelay: number;
}

export interface InteractionConfig {
  hover: {
    enabled: boolean;
    highlightColor: string;
    tooltipDelay: number;
  };
  click: {
    enabled: boolean;
    action: "drill-down" | "details" | "filter";
  };
  zoom: {
    enabled: boolean;
    min: number;
    max: number;
  };
}

// Component props types
export interface VisualizationProps {
  data: UrbanProblem | ProblemSolutionPair;
  config: VisualizationConfig;
  width?: number;
  height?: number;
  className?: string;
  onDataPointClick?: (data: DataPoint) => void;
  onAnimationComplete?: () => void;
}

export interface ChartProps extends VisualizationProps {
  chartData: ChartData;
  chartConfig: ChartConfig;
  animationConfig?: AnimationConfig;
  interactionConfig?: InteractionConfig;
}

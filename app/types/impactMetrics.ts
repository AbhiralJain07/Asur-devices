// Impact Metrics Types

export interface ImpactMetrics {
  id: string;
  category: MetricCategory;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: MetricUnit;
  trend: MetricTrend;
  change: number;
  changePeriod: string;
  icon: string;
  color: string;
  backgroundColor?: string;
  isAnimated: boolean;
  animationDuration?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  format?: "number" | "currency" | "percentage" | "custom";
  customFormatter?: (value: number) => string;
  milestones?: MetricMilestone[];
  comparisons?: MetricComparison[];
  sources?: DataSource[];
  lastUpdated: Date;
}

export type MetricCategory = 
  | "environmental"
  | "economic"
  | "social"
  | "operational"
  | "safety"
  | "efficiency"
  | "sustainability"
  | "innovation"
  | "cost";

export type MetricUnit = 
  | "%"
  | "$"
  | "tons"
  | "kg"
  | "kWh"
  | "hours"
  | "minutes"
  | "days"
  | "people"
  | "vehicles"
  | "buildings"
  | "km"
  | "m²"
  | "count"
  | "score";

export type MetricTrend = "up" | "down" | "stable" | "volatile";

export interface MetricMilestone {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  achievedDate?: Date;
  targetDate: Date;
  isCompleted: boolean;
  description: string;
}

export interface MetricComparison {
  id: string;
  label: string;
  value: number;
  period: string;
  baseline?: number;
  color?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: "sensor" | "api" | "manual" | "calculated";
  reliability: number; // 0-100
  lastSync: Date;
  url?: string;
}

export interface ImpactMetricsCollection {
  id: string;
  title: string;
  description: string;
  category: MetricCategory;
  metrics: ImpactMetrics[];
  layout: MetricsLayout;
  isExpanded: boolean;
  showComparisons: boolean;
  showTrends: boolean;
  showTargets: boolean;
  animationDelay: number;
  refreshInterval: number;
}

export type MetricsLayout = 
  | "grid"
  | "list"
  | "carousel"
  | "timeline"
  | "pyramid"
  | "circular";

export interface ImpactMetricsState {
  isLoading: boolean;
  error: string | null;
  collections: ImpactMetricsCollection[];
  selectedCategory: MetricCategory | "all";
  animationEnabled: boolean;
  autoRefresh: boolean;
  lastUpdated: Date;
  filters: MetricsFilters;
}

export interface MetricsFilters {
  category?: MetricCategory;
  trend?: MetricTrend;
  hasTarget?: boolean;
  hasComparison?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  format?: "number" | "currency" | "percentage" | "custom";
  customFormatter?: (value: number) => string;
  onStart?: () => void;
  onComplete?: () => void;
  className?: string;
}

export interface MetricDisplayProps {
  metric: ImpactMetrics;
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  showMilestones?: boolean;
  isCompact?: boolean;
  animationDelay?: number;
  className?: string;
}

export interface MetricCardProps {
  metric: ImpactMetrics;
  size: "small" | "medium" | "large";
  variant: "default" | "minimal" | "detailed";
  showIcon?: boolean;
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface MetricProgressProps {
  metric: ImpactMetrics;
  showPercentage?: boolean;
  showLabel?: boolean;
  showTarget?: boolean;
  animated?: boolean;
  height?: number;
  className?: string;
}

export interface MetricChartProps {
  metric: ImpactMetrics;
  chartType: "line" | "bar" | "area" | "pie";
  historicalData?: MetricDataPoint[];
  predictions?: MetricDataPoint[];
  showTarget?: boolean;
  showTrend?: boolean;
  height?: number;
  className?: string;
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface MetricAlert {
  id: string;
  metricId: string;
  type: "threshold" | "trend" | "anomaly" | "target";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  value: number;
  threshold?: number;
  timestamp: Date;
  isRead: boolean;
  actions?: AlertAction[];
}

export interface AlertAction {
  id: string;
  label: string;
  action: () => void;
  type: "primary" | "secondary" | "danger";
}

export interface MetricGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  category: MetricCategory;
  priority: "low" | "medium" | "high" | "critical";
  status: "on-track" | "at-risk" | "behind" | "completed";
  owner?: string;
  progress: number; // 0-100
  milestones: GoalMilestone[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  dueDate: Date;
  isCompleted: boolean;
  completedDate?: Date;
}

export interface ImpactSummary {
  totalMetrics: number;
  categories: {
    [key in MetricCategory]: {
      count: number;
      averageImprovement: number;
      onTarget: number;
    };
  };
  overallTrend: MetricTrend;
  topPerformers: ImpactMetrics[];
  areasForImprovement: ImpactMetrics[];
  recentAchievements: MetricMilestone[];
  upcomingDeadlines: GoalMilestone[];
  lastUpdated: Date;
}

export interface ImpactReport {
  id: string;
  title: string;
  description: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: ImpactSummary;
  sections: ReportSection[];
  format: "pdf" | "excel" | "json";
  status: "generating" | "completed" | "failed";
  downloadUrl?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: "summary" | "metrics" | "charts" | "goals" | "trends";
  content: any;
  order: number;
}

// Legacy interfaces for backward compatibility
export interface ImpactCategory {
  title: string;
  description: string;
  icon: string;
  metrics: ImpactMetrics[];
  totalSavings?: number;
  totalImprovement?: number;
}

// Action types for state management
export type ImpactMetricsActionType =
  | "SET_LOADING"
  | "SET_ERROR"
  | "SET_METRICS"
  | "UPDATE_METRIC"
  | "ADD_METRIC"
  | "REMOVE_METRIC"
  | "SET_CATEGORY_FILTER"
  | "SET_FILTERS"
  | "TOGGLE_ANIMATION"
  | "TOGGLE_AUTO_REFRESH"
  | "EXPORT_METRICS"
  | "GENERATE_REPORT"
  | "SET_TARGET"
  | "ADD_MILESTONE"
  | "DISMISS_ALERT";

export interface ImpactMetricsActionPayload {
  type: ImpactMetricsActionType;
  payload?: any;
}

// Context interface for React Context
export interface ImpactMetricsContextType {
  state: ImpactMetricsState;
  metrics: ImpactMetrics[];
  collections: ImpactMetricsCollection[];
  alerts: MetricAlert[];
  goals: MetricGoal[];
  summary: ImpactSummary | null;
  dispatch: (action: ImpactMetricsActionPayload) => void;
  actions: {
    refreshMetrics: () => void;
    updateMetric: (id: string, updates: Partial<ImpactMetrics>) => void;
    setTarget: (metricId: string, target: number) => void;
    addMilestone: (metricId: string, milestone: MetricMilestone) => void;
    dismissAlert: (alertId: string) => void;
    generateReport: (format: "pdf" | "excel" | "json") => void;
  };
}

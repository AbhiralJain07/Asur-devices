// Dashboard Types and State Management

export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date;
  selectedTimeRange: TimeRange;
  selectedMetrics: MetricType[];
  filters: DashboardFilters;
  realTimeMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  isActive: boolean;
  activeWidgets: DashboardWidget[];
  alerts: DashboardAlert[];
}

export interface DashboardFilters {
  cityRegion?: string;
  problemCategory?: string;
  severity?: "low" | "medium" | "high" | "critical";
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d" | "90d";

export type MetricType = 
  | "traffic" 
  | "pollution" 
  | "waste" 
  | "energy" 
  | "public_safety" 
  | "infrastructure"
  | "citizen_satisfaction";

export interface DashboardMetrics {
  timestamp: Date;
  traffic: TrafficMetrics;
  pollution: PollutionMetrics;
  waste: WasteMetrics;
  energy: EnergyMetrics;
  publicSafety: PublicSafetyMetrics;
  infrastructure: InfrastructureMetrics;
  citizenSatisfaction: CitizenSatisfactionMetrics;
}

export interface TrafficMetrics {
  averageSpeed: number;
  congestionLevel: number;
  incidentCount: number;
  publicTransportUsage: number;
  flowRate: number;
  travelTimeIndex: number;
  parkingUtilization: number;
}

export interface PollutionMetrics {
  airQualityIndex: number;
  particulateMatter25: number;
  particulateMatter10: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulfurDioxide: number;
  ozone: number;
  noiseLevel: number;
}

export interface WasteMetrics {
  collectionEfficiency: number;
  recyclingRate: number;
  landfillUsage: number;
  operationalCost: number;
  wasteGeneration: number;
  processingCapacity: number;
  routeOptimization: number;
}

export interface EnergyMetrics {
  consumption: number;
  efficiency: number;
  renewablePercentage: number;
  gridStability: number;
  peakDemand: number;
  carbonFootprint: number;
  storageUtilization: number;
}

export interface PublicSafetyMetrics {
  emergencyResponseTime: number;
  crimeRate: number;
  incidentResolution: number;
  policeActivity: number;
  fireSafetyScore: number;
  medicalEmergencyResponse: number;
  publicSafetyIndex: number;
}

export interface InfrastructureMetrics {
  roadCondition: number;
  bridgeStatus: number;
  waterSupply: number;
  sewageSystem: number;
  publicTransport: number;
  digitalConnectivity: number;
  maintenanceBacklog: number;
}

export interface CitizenSatisfactionMetrics {
  overallSatisfaction: number;
  serviceQuality: number;
  responseTime: number;
  complaintResolution: number;
  publicTrust: number;
  engagementLevel: number;
  satisfactionTrend: number;
}

export interface DashboardWidget {
  id: string;
  type: "chart" | "metric" | "map" | "alert" | "feed";
  title: string;
  data: any;
  metrics: MetricType[];
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  size: "small" | "medium" | "large" | "full";
  refreshInterval?: number;
  isVisible: boolean;
  isMinimized: boolean;
  settings: WidgetSettings;
}

export interface WidgetSettings {
  showTrends: boolean;
  showComparisons: boolean;
  showTargets: boolean;
  showAlerts: boolean;
  colorScheme: "default" | "dark" | "high-contrast";
  animationSpeed: "slow" | "normal" | "fast";
  dataPoints: number;
}

export interface DashboardAlert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  isRead: boolean;
  actions?: AlertAction[];
  metadata?: Record<string, any>;
}

export interface AlertAction {
  id: string;
  label: string;
  action: () => void;
  type: "primary" | "secondary" | "danger";
}

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
  type?: "line" | "bar" | "area";
}

export interface RealTimeUpdate {
  metric: MetricType;
  data: Partial<DashboardMetrics>;
  timestamp: Date;
  source: string;
  confidence: number;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  alertTypes: string[];
  quietHours: {
    start: string;
    end: string;
  };
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
}

// Action types for state management
export type DashboardActionType =
  | "SET_LOADING"
  | "SET_ERROR"
  | "SET_METRICS"
  | "UPDATE_METRICS"
  | "SET_TIME_RANGE"
  | "SET_FILTERS"
  | "TOGGLE_REAL_TIME"
  | "SET_AUTO_REFRESH"
  | "ADD_WIDGET"
  | "REMOVE_WIDGET"
  | "UPDATE_WIDGET"
  | "ADD_ALERT"
  | "DISMISS_ALERT"
  | "SET_PREFERENCES"
  | "EXPORT_DATA"
  | "SHARE_DASHBOARD";

export interface DashboardActionPayload {
  type: DashboardActionType;
  payload?: any;
}

// Utility types
export type MetricValue = number | string | boolean;
export type MetricUnit = "%" | "km/h" | "AQI" | "MW" | "tons" | "minutes" | "hours" | "days" | "$" | "count";

export interface MetricDefinition {
  key: keyof DashboardMetrics;
  label: string;
  unit: MetricUnit;
  type: "gauge" | "trend" | "counter" | "chart";
  category: MetricType;
  icon: string;
  color: string;
  target?: number;
  thresholds?: {
    good: number;
    warning: number;
    critical: number;
  };
}

// State management hooks interface
export interface DashboardHookReturn {
  state: DashboardState;
  metrics: DashboardMetrics | null;
  alerts: DashboardAlert[];
  widgets: DashboardWidget[];
  dispatch: (action: DashboardActionPayload) => void;
  actions: {
    refresh: () => void;
    updateFilters: (filters: Partial<DashboardFilters>) => void;
    toggleRealTime: () => void;
    addWidget: (widget: DashboardWidget) => void;
    removeWidget: (widgetId: string) => void;
    updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
    dismissAlert: (alertId: string) => void;
  };
}

// Context interface for React Context
export interface DashboardContextType {
  state: DashboardState;
  metrics: DashboardMetrics | null;
  alerts: DashboardAlert[];
  widgets: DashboardWidget[];
  preferences: UserPreferences;
  dispatch: (action: DashboardActionPayload) => void;
  actions: DashboardHookReturn["actions"];
}

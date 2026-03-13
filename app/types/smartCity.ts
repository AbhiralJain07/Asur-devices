// Smart City Data Types
export interface SmartCityData {
  id: string;
  timestamp: Date;
  cityId: string;
  metrics: {
    traffic: TrafficMetrics;
    pollution: PollutionMetrics;
    waste: WasteMetrics;
    energy: EnergyMetrics;
  };
}

export interface TrafficMetrics {
  flowRate: number; // 0-100 percentage
  congestionLevel: number; // 0-100 percentage
  averageSpeed: number; // km/h
  incidents: TrafficIncident[];
}

export interface TrafficIncident {
  id: string;
  type: "accident" | "construction" | "weather";
  severity: "low" | "medium" | "high";
  location: {
    lat: number;
    lng: number;
  };
}

export interface PollutionMetrics {
  airQualityIndex: number; // 0-500 AQI scale
  pm25: number; // μg/m³
  pm10: number; // μg/m³
  no2: number; // ppb
  o3: number; // ppb
}

export interface WasteMetrics {
  collectionEfficiency: number; // 0-100 percentage
  binFillLevel: number; // 0-100 percentage
  trucksActive: number;
  routesOptimized: number;
}

export interface EnergyMetrics {
  consumption: number; // MW
  efficiency: number; // 0-100 percentage
  renewablePercentage: number; // 0-100 percentage
  gridStability: number; // 0-100 percentage
}

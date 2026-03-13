# Data Model: Smart City Command Center Landing Page

**Created**: 2026-03-12  
**Purpose**: Entity definitions and data structures for the landing page

## Core Entities

### SmartCityData

Real-time and simulated data for smart city metrics.

```typescript
interface SmartCityData {
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

interface TrafficMetrics {
  flowRate: number; // 0-100 percentage
  congestionLevel: number; // 0-100 percentage
  averageSpeed: number; // km/h
  incidents: TrafficIncident[];
}

interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'weather';
  severity: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
  };
}

interface PollutionMetrics {
  airQualityIndex: number; // 0-500 AQI scale
  pm25: number; // μg/m³
  pm10: number; // μg/m³
  no2: number; // ppb
  o3: number; // ppb
}

interface WasteMetrics {
  collectionEfficiency: number; // 0-100 percentage
  binFillLevel: number; // 0-100 percentage
  trucksActive: number;
  routesOptimized: number;
}

interface EnergyMetrics {
  consumption: number; // MW
  efficiency: number; // 0-100 percentage
  renewablePercentage: number; // 0-100 percentage
  gridStability: number; // 0-100 percentage
}
```

### CityLocation

Geographic and demographic data for global city implementations.

```typescript
interface CityLocation {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  implementationDate: Date;
  status: 'planned' | 'active' | 'expanding';
  metrics: SmartCityData;
}

interface CityMarker {
  cityId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  isActive: boolean;
  data: SmartCityData;
}
```

### ImpactMetrics

Quantified benefits and achievements for business case justification.

```typescript
interface ImpactMetrics {
  category: 'cost' | 'efficiency' | 'environmental' | 'social';
  metric: string;
  value: number;
  unit: string;
  improvement: number; // percentage change
  timeframe: string;
  description: string;
}

interface ImpactCategory {
  title: string;
  description: string;
  icon: string;
  metrics: ImpactMetrics[];
  totalSavings?: number;
  totalImprovement?: number;
}
```

### CustomerTestimonial

Fictional but realistic testimonials for social proof.

```typescript
interface CustomerTestimonial {
  id: string;
  cityName: string;
  officialName: string;
  officialTitle: string;
  citySize: 'small' | 'medium' | 'large';
  implementationDate: Date;
  quote: string;
  results: TestimonialResult[];
  imageUrl?: string;
}

interface TestimonialResult {
  metric: string;
  value: string;
  improvement?: string;
}
```

### TechnologyComponent

Platform capabilities and technical features.

```typescript
interface TechnologyComponent {
  id: string;
  name: string;
  category: 'ai' | 'iot' | 'visualization' | 'integration';
  description: string;
  capabilities: string[];
  icon: string;
  status: 'core' | 'advanced' | 'experimental';
}

interface TechnologyStack {
  categories: TechnologyCategory[];
}

interface TechnologyCategory {
  title: string;
  description: string;
  components: TechnologyComponent[];
}
```

## UI State Models

### VisualizationState

State management for 3D visualizations and interactions.

```typescript
interface VisualizationState {
  isLoading: boolean;
  isInteractive: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  activeSection: string;
  scrollProgress: number;
  animations: {
    isPlaying: boolean;
    currentAnimation: string;
    progress: number;
  };
}

interface GlobeState {
  isRotating: boolean;
  rotationSpeed: number;
  zoom: number;
  selectedCity?: CityLocation;
  hoveredCity?: CityLocation;
  markers: CityMarker[];
}

interface CityVisualizationState {
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  activeDistricts: string[];
  dataOverlay: 'traffic' | 'pollution' | 'energy' | 'none';
  isPaused: boolean;
}
```

### DashboardState

Live command dashboard simulation state.

```typescript
interface DashboardState {
  isActive: boolean;
  selectedTimeRange: '1h' | '6h' | '24h' | '7d';
  activeWidgets: DashboardWidget[];
  alerts: DashboardAlert[];
  refreshInterval: number;
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'map' | 'alert';
  title: string;
  data: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DashboardAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  isRead: boolean;
}
```

## Data Validation Rules

### SmartCityData Validation

```typescript
const validateSmartCityData = (data: SmartCityData): boolean => {
  // Traffic validation
  if (data.metrics.traffic.flowRate < 0 || data.metrics.traffic.flowRate > 100) {
    return false;
  }
  
  // Pollution validation
  if (data.metrics.pollution.airQualityIndex < 0 || data.metrics.pollution.airQualityIndex > 500) {
    return false;
  }
  
  // Waste validation
  if (data.metrics.waste.collectionEfficiency < 0 || data.metrics.waste.collectionEfficiency > 100) {
    return false;
  }
  
  // Energy validation
  if (data.metrics.energy.consumption < 0 || data.metrics.energy.efficiency < 0 || data.metrics.energy.efficiency > 100) {
    return false;
  }
  
  return true;
};
```

### Geographic Validation

```typescript
const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};
```

## State Transitions

### Visualization Lifecycle

```typescript
type VisualizationEvent = 
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; data: SmartCityData }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'INTERACTION_START'; interaction: string }
  | { type: 'INTERACTION_END'; interaction: string }
  | { type: 'PERFORMANCE_MODE_CHANGE'; mode: 'high' | 'medium' | 'low' }
  | { type: 'SECTION_CHANGE'; section: string };
```

### Data Update Lifecycle

```typescript
type DataUpdateEvent = 
  | { type: 'UPDATE_START'; cityId: string }
  | { type: 'UPDATE_SUCCESS'; cityId: string; data: SmartCityData }
  | { type: 'UPDATE_ERROR'; cityId: string; error: string }
  | { type: 'BATCH_UPDATE'; cities: SmartCityData[] };
```

## Mock Data Generation

### City Data Generator

```typescript
interface CityDataGenerator {
  generateTrafficMetrics(): TrafficMetrics;
  generatePollutionMetrics(): PollutionMetrics;
  generateWasteMetrics(): WasteMetrics;
  generateEnergyMetrics(): EnergyMetrics;
  generateCityData(cityId: string): SmartCityData;
  updateData(existingData: SmartCityData): SmartCityData;
}
```

### Testimonial Generator

```typescript
interface TestimonialGenerator {
  generateTestimonial(citySize: 'small' | 'medium' | 'large'): CustomerTestimonial;
  generateResults(category: string): TestimonialResult[];
}
```

## Performance Considerations

### Data Optimization

- Use object pooling for frequently created/destroyed objects
- Implement efficient data structures for spatial queries
- Cache computed values to avoid redundant calculations
- Use lazy loading for large datasets

### Memory Management

- Implement data cleanup for unused city data
- Use weak references for cached visualizations
- Monitor memory usage and implement garbage collection triggers
- Optimize texture and model memory usage

### Network Optimization

- Implement data compression for large datasets
- Use incremental updates for real-time data
- Cache frequently accessed data locally
- Implement offline data fallbacks

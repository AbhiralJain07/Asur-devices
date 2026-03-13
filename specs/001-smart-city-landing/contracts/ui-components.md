# UI Component Contracts

**Created**: 2026-03-12  
**Purpose**: Interface definitions for landing page components

## Visualization Component Contracts

### BaseVisualizationProps

Common props for all visualization components.

```typescript
interface BaseVisualizationProps {
  id: string;
  className?: string;
  isLoading?: boolean;
  isInteractive?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  onDataUpdate?: (data: any) => void;
  onError?: (error: string) => void;
}
```

### CityVisualizationProps

Props for the 3D smart city hero component.

```typescript
interface CityVisualizationProps extends BaseVisualizationProps {
  cityData: SmartCityData;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  autoRotate?: boolean;
  dataOverlay?: 'traffic' | 'pollution' | 'energy' | 'none';
  onDistrictHover?: (districtId: string) => void;
  onDistrictClick?: (districtId: string) => void;
}
```

### GlobeVisualizationProps

Props for the interactive globe component.

```typescript
interface GlobeVisualizationProps extends BaseVisualizationProps {
  cities: CityLocation[];
  selectedCity?: string;
  rotationSpeed?: number;
  showMarkers?: boolean;
  showDataOverlay?: boolean;
  onCityHover?: (city: CityLocation) => void;
  onCityClick?: (city: CityLocation) => void;
  onMarkerClick?: (cityId: string) => void;
}
```

## Section Component Contracts

### HeroSectionProps

Props for the hero section with 3D visualization.

```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  visualization: CityVisualizationProps;
  scrollIndicator?: boolean;
}
```

### FeatureSectionProps

Props for feature showcase sections.

```typescript
interface FeatureSectionProps {
  title: string;
  description: string;
  features: FeatureItem[];
  layout: 'grid' | 'carousel' | 'stacked';
  visualization?: {
    type: 'chart' | 'animation' | '3d-scene';
    props: any;
  };
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  metrics?: {
    label: string;
    value: string;
    improvement?: string;
  }[];
}
```

### DashboardSectionProps

Props for the live command dashboard section.

```typescript
interface DashboardSectionProps {
  title: string;
  subtitle: string;
  widgets: DashboardWidget[];
  timeRangeOptions: string[];
  defaultTimeRange: string;
  refreshInterval: number;
  isInteractive: boolean;
  onWidgetClick?: (widgetId: string) => void;
  onTimeRangeChange?: (range: string) => void;
}
```

### TestimonialSectionProps

Props for the testimonials section.

```typescript
interface TestimonialSectionProps {
  title: string;
  subtitle: string;
  testimonials: CustomerTestimonial[];
  layout: 'grid' | 'carousel';
  showMetrics?: boolean;
  onTestimonialClick?: (testimonialId: string) => void;
}
```

## Data Component Contracts

### MetricsDisplayProps

Props for animated metric displays.

```typescript
interface MetricsDisplayProps {
  metrics: {
    label: string;
    value: number;
    unit: string;
    targetValue?: number;
    trend?: 'up' | 'down' | 'stable';
  }[];
  animationDuration?: number;
  showTrends?: boolean;
  formatValue?: (value: number, unit: string) => string;
}
```

### ChartProps

Props for data visualization charts.

```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: ChartData;
  config: ChartConfig;
  isAnimated?: boolean;
  isInteractive?: boolean;
  onPointClick?: (point: ChartPoint) => void;
  onLegendClick?: (series: string) => void;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    backgroundColor?: string;
  }[];
}

interface ChartConfig {
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animationDuration?: number;
}
```

## Layout Component Contracts

### NavigationProps

Props for site navigation.

```typescript
interface NavigationProps {
  logo: {
    src: string;
    alt: string;
    href: string;
  };
  links: {
    text: string;
    href: string;
    isActive?: boolean;
  }[];
  callToAction?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  isSticky?: boolean;
  isTransparent?: boolean;
}
```

### FooterProps

Props for site footer.

```typescript
interface FooterProps {
  logo: {
    src: string;
    alt: string;
  };
  sections: {
    title: string;
    links: {
      text: string;
      href: string;
    }[];
  }[];
  socialLinks: {
    platform: string;
    href: string;
    icon: string;
  }[];
  copyright: string;
}
```

## Animation Component Contracts

### ScrollAnimationProps

Props for scroll-triggered animations.

```typescript
interface ScrollAnimationProps {
  children: React.ReactNode;
  animation: 'fade' | 'slide' | 'scale' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  triggerOffset?: number;
  repeat?: boolean;
}
```

### TransitionProps

Props for page transitions.

```typescript
interface TransitionProps {
  children: React.ReactNode;
  type: 'fade' | 'slide' | 'scale' | 'flip';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}
```

## Form Component Contracts

### DemoRequestFormProps

Props for the demo request form.

```typescript
interface DemoRequestFormProps {
  title: string;
  description: string;
  fields: FormField[];
  submitButton: {
    text: string;
    loadingText?: string;
  };
  onSuccess?: (data: FormData) => void;
  onError?: (error: string) => void;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'tel';
  required?: boolean;
  placeholder?: string;
  options?: {
    value: string;
    label: string;
  }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}
```

## Event Contracts

### UserInteractionEvents

Events for user interactions.

```typescript
interface UserInteractionEvent {
  type: 'click' | 'hover' | 'scroll' | 'resize';
  target: string;
  timestamp: Date;
  data?: any;
}

interface VisualizationInteractionEvent extends UserInteractionEvent {
  type: 'visualization_click' | 'visualization_hover' | 'visualization_zoom';
  visualizationId: string;
  interactionData: {
    element?: string;
    coordinates?: { x: number; y: number };
    value?: any;
  };
}
```

### PerformanceEvents

Events for performance monitoring.

```typescript
interface PerformanceEvent {
  type: 'fps_update' | 'memory_warning' | 'load_time' | 'interaction_delay';
  timestamp: Date;
  metrics: {
    fps?: number;
    memoryUsage?: number;
    loadTime?: number;
    interactionDelay?: number;
  };
  context?: string;
}
```

## Service Contracts

### DataSimulationService

Service for generating realistic smart city data.

```typescript
interface DataSimulationService {
  startSimulation(cityId: string): void;
  stopSimulation(cityId: string): void;
  updateData(cityId: string): SmartCityData;
  subscribeToUpdates(cityId: string, callback: (data: SmartCityData) => void): () => void;
  getHistoricalData(cityId: string, timeRange: TimeRange): SmartCityData[];
}
```

### PerformanceMonitoringService

Service for monitoring application performance.

```typescript
interface PerformanceMonitoringService {
  startMonitoring(): void;
  stopMonitoring(): void;
  recordMetric(name: string, value: number): void;
  getMetrics(): PerformanceMetrics;
  subscribeToMetrics(callback: (metrics: PerformanceMetrics) => void): () => void;
}
```

## Validation Contracts

### ComponentValidation

Validation rules for component props.

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

interface ComponentValidator {
  validateProps<T>(props: T, rules: Record<keyof T, ValidationRule<T>>): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}
```

## Theme Contracts

### ThemeConfiguration

Theme configuration for consistent styling.

```typescript
interface ThemeConfiguration {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
```

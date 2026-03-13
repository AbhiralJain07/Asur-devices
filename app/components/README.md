# Component Documentation

This directory contains comprehensive documentation for all React components in the Smart City Command Center landing page.

## Component Categories

### UI Components
- **AccessibilityVisualization.tsx** - Accessibility wrapper components
- **AnimatedCounter.tsx** - Animated number counters and progress indicators
- **CallToAction.tsx** - Call-to-action forms and buttons
- **LoadingStates.tsx** - Loading states and error handling components
- **MetricDisplay.tsx** - Metric display components with animations
- **Navigation.tsx** - Global navigation and footer components
- **ProgressiveLoading.tsx** - Progressive loading for slow connections
- **ResponsiveVisualization.tsx** - Responsive design utilities
- **SmoothScroll.tsx** - Smooth scrolling animations
- **TestimonialCard.tsx** - Customer testimonial components

### Section Components
- **AnalyticsSection.tsx** - Analytics dashboard section
- **GlobeSection.tsx** - 3D globe visualization section
- **ImpactSection.tsx** - Impact metrics section
- **ProblemSolutionSection.tsx** - Problem-solution visualization section
- **TechnologyStackSection.tsx** - Technology showcase section
- **TestimonialsSection.tsx** - Customer testimonials section

### Visualization Components
- **Charts.tsx** - Data visualization charts
- **GlobeVisualization.tsx** - 3D globe component
- **PollutionMonitoring.tsx** - Pollution monitoring visualization
- **ProblemVisualization.tsx** - Problem-solution visualization
- **ResponsiveVisualization.tsx** - Responsive design utilities
- **TrafficPrediction.tsx** - Traffic prediction visualization
- **WasteManagement.tsx** - Waste management visualization
- **EnergyOptimization.tsx** - Energy optimization visualization

## Documentation Standards

Each component should include:
1. **Purpose** - What the component does
2. **Props** - All props with types and descriptions
3. **Usage Examples** - How to use the component
4. **Accessibility** - ARIA labels and keyboard navigation
5. **Performance** - Performance considerations
6. **Dependencies** - Required dependencies

## Component Index

### AccessibilityVisualization

**Purpose**: Provides accessibility wrapper components with screen reader support and keyboard navigation.

**Props**:
```typescript
interface AccessibilityVisualizationProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

**Usage**:
```tsx
<AccessibilityVisualization className="p-4" role="region" ariaLabel="Metrics dashboard">
  <MetricDisplay metric={metric} />
</AccessibilityVisualization>
```

**Accessibility**: Full WCAG 2.1 AA compliance with proper ARIA labels, keyboard navigation, and screen reader announcements.

**Performance**: Minimal overhead, uses React.memo for optimization.

**Dependencies**: React, useScreenReaderAnnouncements hook.

---

### AnimatedCounter

**Purpose**: Animated number counter with customizable easing and formatting options.

**Props**:
```typescript
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  format?: "number" | "currency" | "percentage" | "custom";
  customFormatter?: (value: number) => string;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "easeOutQuart" | "easeInQuart";
  autoStart?: boolean;
  loop?: boolean;
  delay?: number;
  onComplete?: () => void;
  onStart?: () => void;
  className?: string;
}
```

**Usage**:
```tsx
<AnimatedCounter
  value={2500000}
  duration={2000}
  prefix="$"
  format="currency"
  easing="easeOutQuart"
  onComplete={() => console.log('Animation complete')}
/>
```

**Accessibility**: Live regions for screen readers, announces final values.

**Performance**: Uses requestAnimationFrame for smooth 60fps animations, intersection observer for lazy loading.

**Dependencies**: React, Framer Motion.

---

### CallToAction

**Purpose**: Call-to-action components including buttons, forms, and scheduling interfaces.

**Components**:
- `CTAButton` - Versatile button component
- `DemoScheduleForm` - Demo scheduling form
- `ContactForm` - Contact form
- `NewsletterSignup` - Newsletter signup
- `PricingCTA` - Pricing call-to-action

**CTAButton Props**:
```typescript
interface CTAButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}
```

**Usage**:
```tsx
<CTAButton
  variant="primary"
  size="large"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Schedule Demo
</CTAButton>
```

**Accessibility**: Proper button semantics, loading states, keyboard navigation.

**Performance**: Optimized animations, minimal re-renders.

**Dependencies**: React, Framer Motion.

---

### LoadingStates

**Purpose**: Comprehensive loading states and error handling components.

**Components**:
- `LoadingSpinner` - Animated loading spinner
- `PulseLoader` - Pulsing dots loader
- `SkeletonLoader` - Skeleton placeholder loader
- `CardSkeleton` - Card skeleton loader
- `TableSkeleton` - Table skeleton loader
- `LoadingOverlay` - Full-screen loading overlay
- `ProgressBarLoader` - Progress bar loader
- `ErrorBoundary` - React error boundary
- `ErrorMessage` - Error message component
- `SuccessMessage` - Success message component
- `ToastContainer` - Toast notification system

**LoadingSpinner Props**:
```typescript
interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "neon-blue" | "neon-green" | "neon-purple" | "white";
  className?: string;
}
```

**Usage**:
```tsx
<LoadingSpinner size="medium" color="neon-blue" />
```

**Accessibility**: Proper ARIA labels, loading announcements.

**Performance**: CSS animations for optimal performance.

**Dependencies**: React, Framer Motion.

---

### MetricDisplay

**Purpose**: Display metrics with animated counters and progress indicators.

**Components**:
- `AnimatedCounter` - Animated number counter
- `MetricDisplay` - Complete metric display
- `CompactMetricCard` - Compact metric card
- `StatsGrid` - Grid of statistics
- `ProgressRing` - Circular progress indicator

**MetricDisplay Props**:
```typescript
interface MetricDisplayProps {
  metric: ImpactMetrics;
  showTrend?: boolean;
  showComparison?: boolean;
  showTarget?: boolean;
  showMilestones?: boolean;
  isCompact?: boolean;
  animationDelay?: number;
  className?: string;
}
```

**Usage**:
```tsx
<MetricDisplay
  metric={impactMetric}
  showTrend={true}
  showTarget={true}
  animationDelay={200}
/>
```

**Accessibility**: Live regions for dynamic content, proper semantic markup.

**Performance**: Intersection observer for lazy loading, optimized animations.

**Dependencies**: React, Framer Motion, ImpactMetrics types.

---

### Navigation

**Purpose**: Global navigation and footer components.

**Components**:
- `Navigation` - Main navigation component
- `BreadcrumbNavigation` - Breadcrumb navigation
- `Footer` - Footer component
- `QuickActions` - Floating quick actions

**Navigation Props**:
```typescript
interface NavigationProps {
  className?: string;
  variant?: "default" | "transparent" | "sticky";
}
```

**Usage**:
```tsx
<Navigation variant="sticky" className="custom-nav" />
```

**Accessibility**: Keyboard navigation, ARIA labels, focus management.

**Performance**: Optimized scroll handling, minimal re-renders.

**Dependencies**: React, Framer Motion, SmoothScroll.

---

### ProgressiveLoading

**Purpose**: Progressive loading components for slow connections.

**Components**:
- `ProgressiveImage` - Progressive image loader
- `LazyLoad` - Lazy load wrapper
- `BandwidthAware` - Bandwidth-aware component
- `ConnectionStatus` - Connection status indicator
- `ProgressiveDataTable` - Progressive data table
- `ProgressiveImageGallery` - Progressive image gallery

**ProgressiveImage Props**:
```typescript
interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}
```

**Usage**:
```tsx
<ProgressiveImage
  src="/images/city.jpg"
  alt="City skyline"
  priority={true}
  quality={75}
/>
```

**Accessibility**: Loading announcements, error handling.

**Performance**: Intersection observer, adaptive quality, caching.

**Dependencies**: React, LoadingStates.

---

### ResponsiveVisualization

**Purpose**: Responsive design utilities and components.

**Components**:
- `ResponsiveMetricCard` - Responsive metric card
- `ResponsiveMetricGrid` - Responsive metric grid
- `ResponsiveTestimonialCard` - Responsive testimonial card
- `ResponsiveTestimonialGrid` - Responsive testimonial grid
- `ResponsiveStats` - Responsive statistics
- `ResponsiveProgressSection` - Responsive progress section

**ResponsiveMetricCard Props**:
```typescript
interface ResponsiveMetricCardProps {
  metric: ImpactMetrics;
  variant?: "compact" | "default" | "detailed";
  className?: string;
}
```

**Usage**:
```tsx
<ResponsiveMetricCard metric={impactMetric} variant="default" />
```

**Accessibility**: Maintains accessibility across all screen sizes.

**Performance**: Optimized for mobile devices, minimal layout shifts.

**Dependencies**: React, useScreenSize hook.

---

### SmoothScroll

**Purpose**: Smooth scrolling animations and utilities.

**Components**:
- `useSmoothScroll` - Smooth scroll hook
- `ScrollProgress` - Scroll progress indicator
- `ScrollToTopButton` - Scroll to top button
- `SectionNavigation` - Section navigation dots
- `ScrollReveal` - Scroll reveal animation
- `Parallax` - Parallax effect
- `useScrollSpy` - Scroll spy hook
- `SmoothScrollLink` - Smooth scroll link
- `ScrollAnimation` - Scroll animation wrapper
- `SmoothScrollProvider` - Smooth scroll provider

**useSmoothScroll Hook**:
```typescript
interface UseSmoothScrollReturn {
  scrollToElement: (elementId: string, offset?: number) => void;
  scrollToTop: () => void;
  isScrolling: boolean;
}
```

**Usage**:
```tsx
const { scrollToElement, scrollToTop, isScrolling } = useSmoothScroll();
```

**Accessibility**: Keyboard navigation, focus management.

**Performance**: Optimized scroll handling, requestAnimationFrame.

**Dependencies**: React, Intersection Observer API.

---

### TestimonialCard

**Purpose**: Customer testimonial display components.

**Components**:
- `TestimonialCard` - Main testimonial card
- `TestimonialCarousel` - Testimonial carousel
- `TestimonialGrid` - Testimonial grid
- `TestimonialCollection` - Testimonial collection
- `FeaturedTestimonial` - Featured testimonial

**TestimonialCard Props**:
```typescript
interface TestimonialCardProps {
  testimonial: CustomerTestimonial;
  variant?: "default" | "compact" | "detailed" | "featured";
  showAvatar?: boolean;
  showCompany?: boolean;
  showRating?: boolean;
  showResults?: boolean;
  showMedia?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  className?: string;
}
```

**Usage**:
```tsx
<TestimonialCard
  testimonial={customerTestimonial}
  variant="detailed"
  showResults={true}
/>
```

**Accessibility**: Proper semantic markup, keyboard navigation.

**Performance**: Lazy loading, optimized animations.

**Dependencies**: React, Framer Motion, CustomerTestimonial types.

---

## Section Components

### AnalyticsSection

**Purpose**: Analytics dashboard section with real-time charts and metrics.

**Props**:
```typescript
interface AnalyticsSectionProps {
  title?: string;
  subtitle?: string;
  showRealTimeData?: boolean;
  className?: string;
}
```

**Usage**:
```tsx
<AnalyticsSection
  title="Real-Time Analytics"
  subtitle="Monitor city operations in real-time"
  showRealTimeData={true}
/>
```

**Features**: Real-time data updates, interactive charts, responsive design.

**Dependencies**: React, Framer Motion, Charts components.

---

### GlobeSection

**Purpose**: 3D globe visualization showing global smart city network.

**Props**:
```typescript
interface GlobeSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}
```

**Usage**:
```tsx
<GlobeSection
  title="Global Network"
  subtitle="Smart cities around the world"
/>
```

**Features**: 3D globe, city markers, interactive controls.

**Dependencies**: React, Three.js, React Three Fiber.

---

### ImpactSection

**Purpose**: Impact metrics section with animated counters and progress indicators.

**Props**:
```typescript
interface ImpactSectionProps {
  title?: string;
  subtitle?: string;
  showSummary?: boolean;
  showProgress?: boolean;
  showFilters?: boolean;
  className?: string;
}
```

**Usage**:
```tsx
<ImpactSection
  title="Real-World Impact"
  subtitle="Measurable results that transform cities"
  showSummary={true}
  showProgress={true}
/>
```

**Features**: Animated counters, progress indicators, category filtering.

**Dependencies**: React, Framer Motion, MetricDisplay components.

---

### ProblemSolutionSection

**Purpose**: Problem-solution visualization section.

**Props**:
```typescript
interface ProblemSolutionSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}
```

**Usage**:
```tsx
<ProblemSolutionSection
  title="Problem to Solution"
  subtitle="How we solve urban challenges"
/>
```

**Features**: Interactive visualizations, problem-solution mapping.

**Dependencies**: React, Framer Motion, ProblemVisualization.

---

### TechnologyStackSection

**Purpose**: Technology showcase section highlighting platform capabilities.

**Props**:
```typescript
interface TechnologyStackSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}
```

**Usage**:
```tsx
<TechnologyStackSection
  title="Powered by Modern Technology"
  subtitle="Built with cutting-edge technologies"
/>
```

**Features**: Tech categories, performance metrics, architecture diagram.

**Dependencies**: React, Framer Motion.

---

### TestimonialsSection

**Purpose**: Customer testimonials section with filtering and layout options.

**Props**:
```typescript
interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showStats?: boolean;
  layout?: "grid" | "carousel" | "mixed";
  className?: string;
}
```

**Usage**:
```tsx
<TestimonialsSection
  title="What Our Customers Say"
  subtitle="Real stories from cities and organizations"
  showFilters={true}
  layout="mixed"
/>
```

**Features**: Testimonial filtering, multiple layouts, statistics.

**Dependencies**: React, Framer Motion, TestimonialCard components.

---

## Best Practices

### Component Design
1. **Single Responsibility** - Each component has one clear purpose
2. **Composition** - Prefer composition over inheritance
3. **Props Interface** - Clear, typed props with good defaults
4. **Accessibility** - WCAG 2.1 AA compliance by default
5. **Performance** - Optimized for 60fps animations

### Code Organization
1. **File Naming** - PascalCase for components, camelCase for utilities
2. **Export Structure** - Named exports for multiple components, default for main
3. **Type Definitions** - Separate types file for complex interfaces
4. **Documentation** - JSDoc comments for all props and methods

### Performance Guidelines
1. **React.memo** - Use for pure components
2. **useCallback/useMemo** - Optimize expensive operations
3. **Lazy Loading** - Use for heavy components
4. **Intersection Observer** - For scroll-based animations

### Accessibility Standards
1. **Semantic HTML** - Use appropriate HTML elements
2. **ARIA Labels** - Provide descriptive labels
3. **Keyboard Navigation** - Full keyboard support
4. **Screen Readers** - Announce dynamic content changes

## Testing

Each component should have:
1. **Unit Tests** - Test component behavior
2. **Integration Tests** - Test component interactions
3. **Accessibility Tests** - Test WCAG compliance
4. **Performance Tests** - Test rendering performance

## Contributing

When adding new components:
1. Follow the existing patterns and conventions
2. Add comprehensive documentation
3. Include accessibility features
4. Add appropriate tests
5. Update this documentation

## Dependencies

### Core Dependencies
- React 19+
- TypeScript 5+
- Framer Motion
- Next.js 16+

### Visualization Dependencies
- Three.js
- React Three Fiber
- Drei

### Utility Dependencies
- TailwindCSS
- Chart.js (for data visualization)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Animation FPS**: 60fps

For more detailed information about each component, see their respective documentation files.

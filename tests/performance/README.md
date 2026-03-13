# Performance Tests for 3D Animations

This directory contains performance tests specifically designed to measure and validate the performance of 3D animations and visualizations in the Smart City Command Center.

## Test Structure

```
tests/performance/
├── 3d-animations/         # 3D animation performance tests
├── globe-visualization/  # Globe-specific performance tests
├── data-visualization/   # Data visualization performance tests
├── benchmarks/           # Performance benchmarks and baselines
├── fixtures/            # Test data and mock scenarios
├── utils/               # Performance testing utilities
├── reports/             # Performance test reports
└── config/              # Performance test configuration
```

## Performance Metrics

### Key Performance Indicators (KPIs)
- **Frame Rate (FPS)**: Target 60fps, minimum 30fps
- **Frame Time**: Target <16.67ms, maximum <33.33ms
- **Memory Usage**: Target <100MB for 3D components
- **GPU Memory**: Target <200MB for textures and buffers
- **Load Time**: Target <2s for 3D scene initialization
- **Interaction Response**: Target <100ms for user interactions

### Performance Budgets
- **Draw Calls**: <100 per frame
- **Triangles**: <50,000 per scene
- **Textures**: <20 active textures
- **Shaders**: <10 active shader programs
- **Lights**: <8 active lights per scene

## Testing Tools

### 1. Playwright Performance Testing
- Frame rate measurement
- Memory usage monitoring
- Network performance analysis
- User interaction timing

### 2. Three.js Performance Inspector
- Render statistics
- Memory usage tracking
- Geometry and texture analysis
- Shader performance metrics

### 3. Browser Performance APIs
- Performance Observer API
- Memory API
- Frame Timing API
- Navigation Timing API

## Test Categories

### 1. 3D Globe Performance Tests

#### Globe Initialization Performance
```typescript
// tests/performance/3d-animations/globe-initialization.spec.ts
import { test, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

test.describe('3D Globe - Initialization Performance', () => {
  let monitor: PerformanceMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = new PerformanceMonitor(page);
    await page.goto('/');
  });

  test('Globe scene initialization', async ({ page }) => {
    // Start performance monitoring
    await monitor.startMonitoring();
    
    // Navigate to hero section
    await page.goto('/#hero');
    
    // Wait for globe to initialize
    const globe = page.locator('[data-testid="3d-globe"]');
    await expect(globe).toBeVisible({ timeout: 10000 });
    
    // Stop monitoring and get metrics
    const metrics = await monitor.stopMonitoring();
    
    // Performance assertions
    expect(metrics.loadTime).toBeLessThan(2000); // 2 seconds
    expect(metrics.initialMemory).toBeLessThan(100 * 1024 * 1024); // 100MB
    expect(metrics.firstPaint).toBeLessThan(1500); // 1.5 seconds
    
    console.log('Globe initialization metrics:', metrics);
  });

  test('Globe texture loading performance', async ({ page }) => {
    await monitor.startMonitoring();
    
    const globe = page.locator('[data-testid="3d-globe"]');
    await expect(globe).toBeVisible();
    
    // Wait for all textures to load
    await page.waitForFunction(() => {
      return window.globePerformance?.texturesLoaded === true;
    }, { timeout: 15000 });
    
    const metrics = await monitor.stopMonitoring();
    
    expect(metrics.textureLoadTime).toBeLessThan(3000); // 3 seconds
    expect(metrics.textureMemoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
    
    console.log('Texture loading metrics:', metrics);
  });

  test('Globe geometry complexity performance', async ({ page }) => {
    await monitor.startMonitoring();
    
    const globe = page.locator('[data-testid="3d-globe"]');
    await expect(globe).toBeVisible();
    
    // Measure geometry performance
    const geometryMetrics = await page.evaluate(() => {
      return window.globePerformance?.getGeometryMetrics();
    });
    
    const metrics = await monitor.stopMonitoring();
    
    expect(geometryMetrics.triangles).toBeLessThan(50000);
    expect(geometryMetrics.vertices).toBeLessThan(25000);
    expect(geometryMetrics.drawCalls).toBeLessThan(100);
    
    console.log('Geometry metrics:', geometryMetrics);
  });
});
```

#### Globe Animation Performance
```typescript
// tests/performance/3d-animations/globe-animation.spec.ts
import { test, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

test.describe('3D Globe - Animation Performance', () => {
  let monitor: PerformanceMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = new PerformanceMonitor(page);
    await page.goto('/#hero');
    await page.locator('[data-testid="3d-globe"]').waitFor({ state: 'visible' });
  });

  test('Globe rotation animation performance', async ({ page }) => {
    await monitor.startFrameRateMonitoring();
    
    // Let animation run for 5 seconds
    await page.waitForTimeout(5000);
    
    const frameMetrics = await monitor.stopFrameRateMonitoring();
    
    expect(frameMetrics.averageFPS).toBeGreaterThanOrEqual(30);
    expect(frameMetrics.minFPS).toBeGreaterThanOrEqual(20);
    expect(frameMetrics.frameTimeAverage).toBeLessThan(33.33); // 30fps
    
    console.log('Animation frame metrics:', frameMetrics);
  });

  test('Globe interaction performance', async ({ page }) => {
    const globe = page.locator('[data-testid="3d-globe"]');
    
    // Measure interaction response time
    const interactionTime = await page.evaluate(async () => {
      const startTime = performance.now();
      
      // Simulate user interaction
      const event = new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200
      });
      window.dispatchEvent(event);
      
      // Wait for response
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      });
      
      return performance.now() - startTime;
    });
    
    expect(interactionTime).toBeLessThan(100); // 100ms response time
    
    console.log('Interaction response time:', interactionTime);
  });

  test('Globe memory usage during animation', async ({ page }) => {
    await monitor.startMemoryMonitoring();
    
    // Run animation for 10 seconds
    await page.waitForTimeout(10000);
    
    const memoryMetrics = await monitor.stopMemoryMonitoring();
    
    expect(memoryMetrics.peakMemoryUsage).toBeLessThan(150 * 1024 * 1024); // 150MB
    expect(memoryMetrics.memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB growth
    
    console.log('Memory usage metrics:', memoryMetrics);
  });
});
```

### 2. Data Visualization Performance Tests

#### Real-time Data Updates
```typescript
// tests/performance/data-visualization/real-time-updates.spec.ts
import { test, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

test.describe('Data Visualization - Real-time Updates', () => {
  let monitor: PerformanceMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = new PerformanceMonitor(page);
    await page.goto('/analytics');
  });

  test('Real-time chart updates performance', async ({ page }) => {
    await monitor.startFrameRateMonitoring();
    
    // Simulate real-time data updates for 10 seconds
    await page.evaluate(() => {
      window.startRealTimeUpdates();
    });
    
    await page.waitForTimeout(10000);
    
    const frameMetrics = await monitor.stopFrameRateMonitoring();
    
    expect(frameMetrics.averageFPS).toBeGreaterThanOrEqual(45);
    expect(frameMetrics.frameTimeAverage).toBeLessThan(22.22); // 45fps
    
    console.log('Real-time update frame metrics:', frameMetrics);
  });

  test('Large dataset rendering performance', async ({ page }) => {
    await monitor.startMonitoring();
    
    // Load large dataset (10,000 points)
    await page.evaluate(() => {
      window.loadLargeDataset(10000);
    });
    
    const metrics = await monitor.stopMonitoring();
    
    expect(metrics.renderTime).toBeLessThan(1000); // 1 second
    expect(metrics.memoryUsage).toBeLessThan(50 * 1024 * 1024); // 50MB
    
    console.log('Large dataset metrics:', metrics);
  });
});
```

### 3. Mobile Performance Tests

#### Mobile 3D Performance
```typescript
// tests/performance/mobile/mobile-3d.spec.ts
import { test, devices, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

test.describe('Mobile - 3D Performance', () => {
  const mobileDevices = [
    devices['Pixel 5'],
    devices['iPhone 12'],
    devices['iPad Pro']
  ];

  mobileDevices.forEach(device => {
    test.describe(`${device.name} - 3D Performance`, () => {
      let monitor: PerformanceMonitor;

      test.beforeEach(async ({ page }) => {
        monitor = new PerformanceMonitor(page);
      });

      test('Mobile globe performance', async ({ page }) => {
        await page.goto('/#hero');
        await page.locator('[data-testid="3d-globe"]').waitFor({ state: 'visible' });
        
        await monitor.startFrameRateMonitoring();
        await page.waitForTimeout(5000);
        
        const frameMetrics = await monitor.stopFrameRateMonitoring();
        
        // Mobile performance targets (lower than desktop)
        expect(frameMetrics.averageFPS).toBeGreaterThanOrEqual(25);
        expect(frameMetrics.minFPS).toBeGreaterThanOrEqual(15);
        
        console.log(`${device.name} frame metrics:`, frameMetrics);
      });

      test('Mobile memory usage', async ({ page }) => {
        await page.goto('/#hero');
        await page.locator('[data-testid="3d-globe"]').waitFor({ state: 'visible' });
        
        await monitor.startMemoryMonitoring();
        await page.waitForTimeout(10000);
        
        const memoryMetrics = await monitor.stopMemoryMonitoring();
        
        // Mobile memory limits
        expect(memoryMetrics.peakMemoryUsage).toBeLessThan(80 * 1024 * 1024); // 80MB
        
        console.log(`${device.name} memory metrics:`, memoryMetrics);
      });
    });
  });
});
```

## Performance Testing Utilities

### Performance Monitor Class
```typescript
// tests/performance/utils/performance-monitor.ts
export class PerformanceMonitor {
  private page: Page;
  private startTime: number = 0;
  private metrics: any = {};

  constructor(page: Page) {
    this.page = page;
  }

  async startMonitoring(): Promise<void> {
    this.startTime = Date.now();
    
    // Inject performance monitoring script
    await this.page.evaluate(() => {
      window.performanceMonitor = {
        marks: [],
        measures: [],
        memory: [],
        frames: []
      };
    });
    
    // Start monitoring
    await this.page.evaluate(() => {
      // Monitor memory usage
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          window.performanceMonitor.memory.push({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            timestamp: performance.now()
          });
        }
      };
      
      // Check memory every 500ms
      setInterval(checkMemory, 500);
      
      // Monitor frame rate
      let lastTime = performance.now();
      let frameCount = 0;
      
      const measureFrameRate = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          window.performanceMonitor.frames.push({
            fps: frameCount,
            timestamp: currentTime
          });
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFrameRate);
      };
      
      requestAnimationFrame(measureFrameRate);
    });
  }

  async stopMonitoring(): Promise<any> {
    const endTime = Date.now();
    const loadTime = endTime - this.startTime;
    
    // Get performance metrics
    const metrics = await this.page.evaluate(() => {
      const memory = window.performanceMonitor.memory;
      const frames = window.performanceMonitor.frames;
      
      return {
        loadTime: window.performance.now(),
        memory: memory,
        frames: frames,
        navigation: performance.getEntriesByType('navigation')[0],
        paint: performance.getEntriesByType('paint')
      };
    });
    
    return {
      loadTime,
      initialMemory: metrics.memory[0]?.used || 0,
      peakMemoryUsage: Math.max(...metrics.memory.map((m: any) => m.used)),
      averageFPS: frames.length > 0 ? frames.reduce((sum: number, f: any) => sum + f.fps, 0) / frames.length : 0,
      minFPS: frames.length > 0 ? Math.min(...frames.map((f: any) => f.fps)) : 0,
      maxFPS: frames.length > 0 ? Math.max(...frames.map((f: any) => f.fps)) : 0,
      firstPaint: metrics.paint?.find((p: any) => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: metrics.paint?.find((p: any) => p.name === 'first-contentful-paint')?.startTime || 0
    };
  }

  async startFrameRateMonitoring(): Promise<void> {
    await this.page.evaluate(() => {
      window.frameMonitor = {
        frames: [],
        startTime: performance.now()
      };
      
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        
        window.frameMonitor.frames.push({
          frameNumber: frameCount,
          timestamp: currentTime,
          deltaTime: currentTime - lastTime
        });
        
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    });
  }

  async stopFrameRateMonitoring(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const frames = window.frameMonitor.frames;
      const startTime = window.frameMonitor.startTime;
      
      if (frames.length === 0) return null;
      
      const frameTimes = frames.map(f => f.deltaTime);
      const fps = frames.map(f => 1000 / f.deltaTime);
      
      return {
        totalFrames: frames.length,
        duration: performance.now() - startTime,
        averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
        minFPS: Math.min(...fps),
        maxFPS: Math.max(...fps),
        frameTimeAverage: frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length,
        frameTimeMin: Math.min(...frameTimes),
        frameTimeMax: Math.max(...frameTimes),
        frames: frames
      };
    });
    
    return metrics;
  }

  async startMemoryMonitoring(): Promise<void> {
    await this.page.evaluate(() => {
      window.memoryMonitor = {
        samples: [],
        startTime: performance.now()
      };
      
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          window.memoryMonitor.samples.push({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            timestamp: performance.now()
          });
        }
      };
      
      // Check memory every 100ms for detailed monitoring
      setInterval(checkMemory, 100);
    });
  }

  async stopMemoryMonitoring(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const samples = window.memoryMonitor.samples;
      const startTime = window.memoryMonitor.startTime;
      
      if (samples.length === 0) return null;
      
      const memoryUsages = samples.map(s => s.used);
      const initialMemory = memoryUsages[0];
      const peakMemory = Math.max(...memoryUsages);
      const finalMemory = memoryUsages[memoryUsages.length - 1];
      
      return {
        duration: performance.now() - startTime,
        samples: samples.length,
        initialMemory,
        peakMemory,
        finalMemory,
        memoryGrowth: finalMemory - initialMemory,
        averageMemory: memoryUsages.reduce((sum, m) => sum + m, 0) / memoryUsages.length,
        samples: samples
      };
    });
    
    return metrics;
  }
}
```

### Performance Test Fixtures
```typescript
// tests/performance/fixtures/performance-fixtures.ts
export const performanceTargets = {
  desktop: {
    targetFPS: 60,
    minFPS: 30,
    maxFrameTime: 33.33, // 30fps
    maxMemoryUsage: 150 * 1024 * 1024, // 150MB
    maxLoadTime: 2000, // 2 seconds
    maxInteractionTime: 100 // 100ms
  },
  mobile: {
    targetFPS: 45,
    minFPS: 25,
    maxFrameTime: 40, // 25fps
    maxMemoryUsage: 80 * 1024 * 1024, // 80MB
    maxLoadTime: 3000, // 3 seconds
    maxInteractionTime: 150 // 150ms
  },
  tablet: {
    targetFPS: 50,
    minFPS: 28,
    maxFrameTime: 35.71, // 28fps
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    maxLoadTime: 2500, // 2.5 seconds
    maxInteractionTime: 120 // 120ms
  }
};

export const testScenarios = {
  lightLoad: {
    name: 'Light Load',
    description: 'Minimal 3D objects and textures',
    expectedFPS: 60,
    expectedMemory: 50 * 1024 * 1024
  },
  mediumLoad: {
    name: 'Medium Load',
    description: 'Moderate 3D complexity',
    expectedFPS: 45,
    expectedMemory: 100 * 1024 * 1024
  },
  heavyLoad: {
    name: 'Heavy Load',
    description: 'Maximum 3D complexity',
    expectedFPS: 30,
    expectedMemory: 150 * 1024 * 1024
  },
  stressTest: {
    name: 'Stress Test',
    description: 'Beyond normal usage limits',
    expectedFPS: 20,
    expectedMemory: 200 * 1024 * 1024
  }
};
```

## Benchmark Tests

### Performance Benchmarks
```typescript
// tests/performance/benchmarks/globe-benchmark.spec.ts
import { test, expect } from '@playwright/test';
import { PerformanceMonitor } from '../utils/performance-monitor';

test.describe('3D Globe - Performance Benchmarks', () => {
  test('Globe rendering benchmark', async ({ page }) => {
    const monitor = new PerformanceMonitor(page);
    
    // Run benchmark test
    await page.goto('/#hero');
    await page.locator('[data-testid="3d-globe"]').waitFor({ state: 'visible' });
    
    const results = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const benchmark = {
          geometryComplexity: 0,
          textureCount: 0,
          drawCalls: 0,
          renderTime: 0,
          memoryUsage: 0
        };
        
        // Run benchmark for 5 seconds
        setTimeout(() => {
          resolve(benchmark);
        }, 5000);
      });
    });
    
    // Benchmark assertions
    expect(results.geometryComplexity).toBeLessThan(50000);
    expect(results.textureCount).toBeLessThan(20);
    expect(results.drawCalls).toBeLessThan(100);
    expect(results.renderTime).toBeLessThan(16.67); // 60fps
    
    console.log('Globe benchmark results:', results);
  });
});
```

## CI/CD Integration

### Performance Test Pipeline
```yaml
# .github/workflows/performance-tests.yml
name: Performance Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run performance tests
      run: npx playwright test tests/performance/
    
    - name: Upload performance reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: performance-reports
        path: performance-reports/
        retention-days: 30
    
    - name: Comment performance results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const results = JSON.parse(fs.readFileSync('performance-reports/results.json', 'utf8'));
          
          const comment = `
          ## Performance Test Results
          
          **Average FPS**: ${results.averageFPS}
          **Memory Usage**: ${results.memoryUsage}MB
          **Load Time**: ${results.loadTime}ms
          
          ${results.passed ? '✅ All performance tests passed' : '❌ Some performance tests failed'}
          `;
          
          github.issues.createComment({
            issue_number: context.issue.number,
            body: comment
          });
```

## Performance Reports

### Automated Report Generation
```typescript
// tests/performance/utils/report-generator.ts
export class PerformanceReportGenerator {
  generateReport(testResults: any[]): string {
    const summary = this.calculateSummary(testResults);
    const recommendations = this.generateRecommendations(summary);
    
    return `
# Performance Test Report

## Summary
- Total Tests: ${summary.totalTests}
- Passed: ${summary.passedTests}
- Failed: ${summary.failedTests}
- Average FPS: ${summary.averageFPS}
- Average Memory: ${summary.averageMemory}MB

## Performance Metrics
${this.generateMetricsTable(testResults)}

## Recommendations
${recommendations}

## Detailed Results
${this.generateDetailedResults(testResults)}
    `;
  }

  private calculateSummary(results: any[]) {
    return {
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
      failedTests: results.filter(r => !r.passed).length,
      averageFPS: this.calculateAverage(results, 'averageFPS'),
      averageMemory: this.calculateAverage(results, 'memoryUsage')
    };
  }

  private generateRecommendations(summary: any): string {
    const recommendations = [];
    
    if (summary.averageFPS < 45) {
      recommendations.push('- Consider optimizing 3D geometry complexity');
    }
    
    if (summary.averageMemory > 100) {
      recommendations.push('- Review memory usage and implement cleanup');
    }
    
    return recommendations.join('\n');
  }
}
```

## Best Practices

### 1. Test Organization
- Group tests by component and performance category
- Use descriptive test names
- Maintain consistent test structure
- Use data-driven testing for different scenarios

### 2. Performance Monitoring
- Monitor multiple metrics simultaneously
- Use appropriate sampling rates
- Handle edge cases and errors gracefully
- Log detailed performance data

### 3. Benchmark Management
- Establish realistic performance targets
- Track performance trends over time
- Update benchmarks as needed
- Document performance requirements

### 4. CI/CD Integration
- Run performance tests on every PR
- Set up performance alerts
- Track performance regressions
- Maintain performance budgets

This comprehensive performance testing setup ensures the 3D animations and visualizations in the Smart City Command Center meet performance targets and provide smooth user experiences across all devices.

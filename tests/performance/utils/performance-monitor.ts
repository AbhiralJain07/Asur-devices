import { Page } from '@playwright/test';

// Type declarations for performance monitoring
declare global {
  interface Window {
    performanceMonitor?: {
      marks: any[];
      measures: any[];
      memory: any[];
      frames: any[];
      interactions: any[];
      startTime: number;
      cleanup?: () => void;
    };
    frameMonitor?: {
      frames: any[];
      startTime: number;
    };
    memoryMonitor?: {
      samples: any[];
      startTime: number;
      cleanup?: () => void;
    };
    sceneMonitor?: {
      renderCalls: number;
      triangles: number;
      textures: number;
      drawCalls: number;
      startTime: number;
    };
    THREE?: any;
  }
}

/**
 * Performance monitoring utility for measuring 3D animation performance
 * Tracks FPS, memory usage, load times, and interaction response times
 */
export class PerformanceMonitor {
  private page: Page;
  private startTime: number = 0;
  private metrics: any = {};

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start comprehensive performance monitoring
   * Injects monitoring scripts into the page
   */
  async startMonitoring(): Promise<void> {
    this.startTime = Date.now();
    
    // Inject performance monitoring script
    await this.page.evaluate(() => {
      window.performanceMonitor = {
        marks: [],
        measures: [],
        memory: [],
        frames: [],
        interactions: [],
        startTime: performance.now()
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
            limit: memory.jsHeapSizeLimit,
            timestamp: performance.now()
          });
        }
      };
      
      // Check memory every 500ms
      const memoryInterval = setInterval(checkMemory, 500);
      
      // Monitor frame rate
      let lastTime = performance.now();
      let frameCount = 0;
      
      const measureFrameRate = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          window.performanceMonitor.frames.push({
            fps: frameCount,
            timestamp: currentTime,
            duration: currentTime - lastTime
          });
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFrameRate);
      };
      
      requestAnimationFrame(measureFrameRate);
      
      // Monitor interaction response times
      const measureInteraction = (eventName: string) => {
        const startTime = performance.now();
        
        const handleInteraction = () => {
          const responseTime = performance.now() - startTime;
          window.performanceMonitor.interactions.push({
            event: eventName,
            responseTime,
            timestamp: performance.now()
          });
        };
        
        return handleInteraction;
      };
      
      // Set up interaction listeners
      window.addEventListener('click', measureInteraction('click'));
      window.addEventListener('mousemove', measureInteraction('mousemove'));
      window.addEventListener('touchstart', measureInteraction('touchstart'));
      
      // Store cleanup function
      window.performanceMonitor.cleanup = () => {
        clearInterval(memoryInterval);
      };
    });
  }

  /**
   * Stop monitoring and return collected metrics
   */
  async stopMonitoring(): Promise<any> {
    const endTime = Date.now();
    const loadTime = endTime - this.startTime;
    
    // Get performance metrics
    const metrics = await this.page.evaluate(() => {
      // Cleanup monitoring
      if (window.performanceMonitor?.cleanup) {
        window.performanceMonitor.cleanup();
      }
      
      const memory = window.performanceMonitor?.memory || [];
      const frames = window.performanceMonitor?.frames || [];
      const interactions = window.performanceMonitor?.interactions || [];
      
      return {
        memory,
        frames,
        interactions,
        navigation: performance.getEntriesByType('navigation')[0],
        paint: performance.getEntriesByType('paint'),
        resource: performance.getEntriesByType('resource')
      };
    });
    
    // Calculate derived metrics
    const derivedMetrics = this.calculateDerivedMetrics(metrics, loadTime);
    
    return {
      ...derivedMetrics,
      rawMetrics: metrics
    };
  }

  /**
   * Start frame rate monitoring specifically
   */
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

  /**
   * Stop frame rate monitoring and return metrics
   */
  async stopFrameRateMonitoring(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const frames = window.frameMonitor?.frames || [];
      const startTime = window.frameMonitor?.startTime || performance.now();
      
      if (frames.length === 0) return null;
      
      const frameTimes = frames.map(f => f.deltaTime);
      const fps = frames.map(f => 1000 / f.deltaTime);
      
      return {
        totalFrames: frames.length,
        duration: performance.now() - startTime,
        averageFPS: fps.reduce((sum: number, f: number) => sum + f, 0) / fps.length,
        minFPS: Math.min(...fps),
        maxFPS: Math.max(...fps),
        frameTimeAverage: frameTimes.reduce((sum: number, t: number) => sum + t, 0) / frameTimes.length,
        frameTimeMin: Math.min(...frameTimes),
        frameTimeMax: Math.max(...frameTimes),
        frames: frames
      };
    });
    
    return metrics;
  }

  /**
   * Start memory monitoring specifically
   */
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
      const memoryInterval = setInterval(checkMemory, 100);
      
      window.memoryMonitor.cleanup = () => {
        clearInterval(memoryInterval);
      };
    });
  }

  /**
   * Stop memory monitoring and return metrics
   */
  async stopMemoryMonitoring(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      // Cleanup monitoring
      if (window.memoryMonitor?.cleanup) {
        window.memoryMonitor.cleanup();
      }
      
      const samples = window.memoryMonitor?.samples || [];
      const startTime = window.memoryMonitor?.startTime || performance.now();
      
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
        averageMemory: memoryUsages.reduce((sum: number, m: number) => sum + m, 0) / memoryUsages.length,
        samples: samples
      };
    });
    
    return metrics;
  }

  /**
   * Monitor 3D scene performance specifically
   */
  async start3DSceneMonitoring(): Promise<void> {
    await this.page.evaluate(() => {
      window.sceneMonitor = {
        renderCalls: 0,
        triangles: 0,
        textures: 0,
        drawCalls: 0,
        startTime: performance.now()
      };
      
      // Hook into Three.js renderer if available
      if (window.THREE && window.THREE.WebGLRenderer) {
        const originalRender = window.THREE.WebGLRenderer.prototype.render;
        
        window.THREE.WebGLRenderer.prototype.render = function(...args: any[]) {
          window.sceneMonitor.renderCalls++;
          
          // Get scene statistics if available
          if (args[0] && args[0].info) {
            const info = args[0].info;
            window.sceneMonitor.triangles = info.geometry.triangles;
            window.sceneMonitor.textures = info.memory.textures;
            window.sceneMonitor.drawCalls = info.render.calls;
          }
          
          return originalRender.apply(this, args);
        };
      }
    });
  }

  /**
   * Stop 3D scene monitoring and return metrics
   */
  async stop3DSceneMonitoring(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const duration = performance.now() - window.sceneMonitor.startTime;
      
      return {
        duration,
        renderCalls: window.sceneMonitor.renderCalls,
        averageRenderCallsPerSecond: window.sceneMonitor.renderCalls / (duration / 1000),
        triangles: window.sceneMonitor.triangles,
        textures: window.sceneMonitor.textures,
        drawCalls: window.sceneMonitor.drawCalls
      };
    });
    
    return metrics;
  }

  /**
   * Measure interaction response time
   */
  async measureInteractionResponse(selector: string, action: string): Promise<number> {
    const responseTime = await this.page.evaluate(async ({ selector, action }) => {
      const startTime = performance.now();
      
      const element = document.querySelector(selector);
      if (!element) return -1;
      
      // Perform action
      switch (action) {
        case 'click':
          element.click();
          break;
        case 'hover':
          element.dispatchEvent(new MouseEvent('mouseover'));
          break;
        case 'focus':
          element.focus();
          break;
        default:
          return -1;
      }
      
      // Wait for next frame
      await new Promise(resolve => {
        requestAnimationFrame(resolve);
      });
      
      return performance.now() - startTime;
    }, { selector, action });
    
    return responseTime;
  }

  /**
   * Measure load time for a specific component
   */
  async measureComponentLoadTime(selector: string, timeout: number = 10000): Promise<number> {
    const startTime = Date.now();
    
    try {
      await this.page.waitForSelector(selector, { timeout });
      return Date.now() - startTime;
    } catch (error) {
      return timeout; // Return timeout if component doesn't load
    }
  }

  /**
   * Calculate derived metrics from raw data
   */
  private calculateDerivedMetrics(metrics: any, loadTime: number): any {
    const memory = metrics.memory || [];
    const frames = metrics.frames || [];
    const interactions = metrics.interactions || [];
    const paint = metrics.paint || [];
    
    // Memory metrics
    const memoryUsages = memory.map((m: any) => m.used);
    const initialMemory = memoryUsages[0] || 0;
    const peakMemory = memoryUsages.length > 0 ? Math.max(...memoryUsages) : 0;
    
    // Frame rate metrics
    const frameRates = frames.map((f: any) => f.fps);
    const averageFPS = frameRates.length > 0 ? 
      frameRates.reduce((sum: number, fps: number) => sum + fps, 0) / frameRates.length : 0;
    const minFPS = frameRates.length > 0 ? Math.min(...frameRates) : 0;
    const maxFPS = frameRates.length > 0 ? Math.max(...frameRates) : 0;
    
    // Interaction metrics
    const interactionTimes = interactions.map((i: any) => i.responseTime);
    const averageInteractionTime = interactionTimes.length > 0 ?
      interactionTimes.reduce((sum: number, time: number) => sum + time, 0) / interactionTimes.length : 0;
    
    // Paint metrics
    const firstPaint = paint.find((p: any) => p.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find((p: any) => p.name === 'first-contentful-paint')?.startTime || 0;
    
    return {
      loadTime,
      initialMemory,
      peakMemory,
      memoryUsage: peakMemory,
      averageFPS,
      minFPS,
      maxFPS,
      averageInteractionTime,
      firstPaint,
      firstContentfulPaint,
      totalFrames: frames.length,
      totalInteractions: interactions.length,
      memorySamples: memory.length
    };
  }

  /**
   * Generate performance report
   */
  generateReport(metrics: any): string {
    return `
Performance Test Report
=====================

Load Time: ${metrics.loadTime}ms
Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
Peak Memory: ${(metrics.peakMemory / 1024 / 1024).toFixed(2)}MB
Average FPS: ${metrics.averageFPS.toFixed(2)}
Min FPS: ${metrics.minFPS}
Max FPS: ${metrics.maxFPS}
Average Interaction Time: ${metrics.averageInteractionTime.toFixed(2)}ms
First Paint: ${metrics.firstPaint.toFixed(2)}ms
First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms

Frame Count: ${metrics.totalFrames}
Interaction Count: ${metrics.totalInteractions}
Memory Samples: ${metrics.memorySamples}
    `.trim();
  }

  /**
   * Check if performance meets targets
   */
  meetsTargets(metrics: any, targets: any): boolean {
    return (
      metrics.averageFPS >= targets.minFPS &&
      metrics.memoryUsage <= targets.maxMemoryUsage &&
      metrics.loadTime <= targets.maxLoadTime &&
      metrics.averageInteractionTime <= targets.maxInteractionTime
    );
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.averageFPS < 45) {
      recommendations.push('Consider optimizing 3D geometry complexity or reducing texture sizes');
    }
    
    if (metrics.memoryUsage > 100 * 1024 * 1024) {
      recommendations.push('Memory usage is high. Consider implementing texture compression or geometry reduction');
    }
    
    if (metrics.loadTime > 2000) {
      recommendations.push('Load time is slow. Consider lazy loading or asset optimization');
    }
    
    if (metrics.averageInteractionTime > 100) {
      recommendations.push('Interaction response time is slow. Consider optimizing event handlers');
    }
    
    if (metrics.minFPS < 20) {
      recommendations.push('Minimum FPS is too low. Consider reducing scene complexity');
    }
    
    return recommendations;
  }
}

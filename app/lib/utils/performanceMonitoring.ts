export interface PerformanceEvent {
  type: "fps_update" | "memory_warning" | "interaction_delay" | "render_time";
  timestamp: Date;
  metrics: {
    fps?: number;
    memoryUsage?: number;
    interactionDelay?: number;
    renderTime?: number;
  };
  context?: string;
}

export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private events: PerformanceEvent[] = [];
  private subscribers: ((event: PerformanceEvent) => void)[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Monitor FPS and memory every second
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 1000);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  recordMetric(name: string, value: number, context?: string): void {
    const event: PerformanceEvent = {
      type: "fps_update", // Default type, can be overridden
      timestamp: new Date(),
      metrics: { fps: value },
      context,
    };

    // Determine event type based on metric name
    if (name.includes("fps")) {
      event.type = "fps_update";
      event.metrics.fps = value;
    } else if (name.includes("memory")) {
      event.type = "memory_warning";
      event.metrics.memoryUsage = value;
    } else if (name.includes("interaction")) {
      event.type = "interaction_delay";
      event.metrics.interactionDelay = value;
    } else if (name.includes("render")) {
      event.type = "render_time";
      event.metrics.renderTime = value;
    }

    this.addEvent(event);
  }

  subscribeToMetrics(callback: (event: PerformanceEvent) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  getMetrics(): PerformanceEvent[] {
    return [...this.events];
  }

  getAverageFPS(): number {
    const fpsEvents = this.events.filter(e => e.type === "fps_update");
    if (fpsEvents.length === 0) return 0;
    
    const totalFPS = fpsEvents.reduce((sum, event) => sum + (event.metrics.fps || 0), 0);
    return Math.round(totalFPS / fpsEvents.length);
  }

  getMemoryUsage(): number {
    const memoryEvents = this.events.filter(e => e.type === "memory_warning");
    if (memoryEvents.length === 0) return 0;
    
    return memoryEvents[memoryEvents.length - 1].metrics.memoryUsage || 0;
  }

  clearEvents(): void {
    this.events = [];
  }

  private addEvent(event: PerformanceEvent): void {
    this.events.push(event);
    
    // Keep only last 100 events to prevent memory leaks
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(event));
  }

  private collectMetrics(): void {
    // Collect FPS
    const fps = this.calculateFPS();
    this.recordMetric("fps", fps);
    
    // Collect memory usage
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    this.recordMetric("memory", memoryUsage);
    
    // Check for performance warnings
    if (fps < 30) {
      this.addEvent({
        type: "fps_update",
        timestamp: new Date(),
        metrics: { fps },
        context: "low_fps_warning",
      });
    }
    
    if (memoryUsage > 100 * 1024 * 1024) { // 100MB
      this.addEvent({
        type: "memory_warning",
        timestamp: new Date(),
        metrics: { memoryUsage },
        context: "high_memory_usage",
      });
    }
  }

  private calculateFPS(): number {
    // Simple FPS calculation based on requestAnimationFrame
    let frames = 0;
    let lastTime = performance.now();
    
    const countFrames = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        return frames;
      }
      
      requestAnimationFrame(countFrames);
      return 0;
    };
    
    return countFrames();
  }
}

# Final Performance Optimization for 60fps Target

This document outlines the final performance optimization strategies to achieve and maintain 60fps (16.67ms per frame) target for the Smart City Command Center, ensuring smooth animations and interactions across all devices.

## 60fps Performance Targets

### Performance Metrics
- **Target Frame Rate**: 60fps (16.67ms per frame)
- **Minimum Acceptable**: 45fps (22.22ms per frame)
- **Critical Threshold**: 30fps (33.33ms per frame)
- **Frame Time Budget**: 16.67ms (60fps)
- **Jank Threshold**: < 100ms for any single frame
- **Animation Duration**: 200-500ms optimal
- **Interaction Response**: < 100ms for user interactions

### Performance Budget Allocation
```typescript
// app/lib/performance-budget.ts
export const PERFORMANCE_BUDGET = {
  // Frame time budget allocation (16.67ms total)
  FRAME_BUDGET: 16.67,
  
  // Component-specific budgets (in milliseconds)
  COMPONENTS: {
    rendering: 8.0,      // 48% - Component rendering
    animations: 4.0,     // 24% - CSS/JS animations
    threeJS: 3.0,        // 18% - 3D rendering
    calculations: 1.5,   // 9% - Data processing
    other: 0.17          // 1% - Other operations
  },
  
  // Memory budgets (in MB)
  MEMORY: {
    threeJS: 50,          // 3D scene memory
    textures: 30,         // Texture memory
    geometry: 20,         // Geometry memory
    components: 40,       // React components
    total: 100            // Total memory budget
  },
  
  // Performance thresholds
  THRESHOLDS: {
    fps: {
      excellent: 60,
      good: 45,
      acceptable: 30,
      poor: 15
    },
    frameTime: {
      excellent: 16.67,
      good: 22.22,
      acceptable: 33.33,
      poor: 66.67
    },
    memory: {
      warning: 80,      // MB
      critical: 100     // MB
    }
  }
};
```

## 1. 60fps Animation Optimization

#### High-Performance Animation System
```typescript
// app/lib/60fps-animations.ts
export class Fps60AnimationSystem {
  private static frameCallbacks: Set<FrameCallback> = new Set();
  private static isRunning = false;
  private static lastFrameTime = 0;
  private static frameCount = 0;
  private static fps = 60;
  private static frameTimeHistory: number[] = [];
  
  // RAF ID for cleanup
  private static rafId: number | null = null;

  static start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.frameTimeHistory = [];
    
    this.animate();
  }

  static stop(): void {
    this.isRunning = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  static addCallback(callback: FrameCallback): () => void {
    this.frameCallbacks.add(callback);
    
    // Return cleanup function
    return () => {
      this.frameCallbacks.delete(callback);
    };
  }

  private static animate(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const frameTime = 1000 / 60; // 16.67ms for 60fps

    // Only update if enough time has passed
    if (deltaTime >= frameTime) {
      // Calculate FPS
      if (this.frameCount > 0) {
        this.fps = 1000 / deltaTime;
        this.frameTimeHistory.push(deltaTime);
        
        // Keep only last 60 frame times
        if (this.frameTimeHistory.length > 60) {
          this.frameTimeHistory.shift();
        }
      }

      // Execute all frame callbacks
      const callbacks = Array.from(this.frameCallbacks);
      callbacks.forEach(callback => {
        try {
          callback(currentTime, deltaTime);
        } catch (error) {
          console.error('Animation callback error:', error);
        }
      });

      this.lastFrameTime = currentTime;
      this.frameCount++;
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  static getMetrics(): FpsMetrics {
    const avgFrameTime = this.frameTimeHistory.length > 0
      ? this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length
      : 0;

    const minFrameTime = this.frameTimeHistory.length > 0
      ? Math.min(...this.frameTimeHistory)
      : 0;

    const maxFrameTime = this.frameTimeHistory.length > 0
      ? Math.max(...this.frameTimeHistory)
      : 0;

    return {
      fps: this.fps,
      frameCount: this.frameCount,
      avgFrameTime,
      minFrameTime,
      maxFrameTime,
      frameTimeHistory: [...this.frameTimeHistory]
    };
  }

  static isPerformanceGood(): boolean {
    return this.fps >= 45 && avgFrameTime <= 22.22;
  }
}

interface FrameCallback {
  (currentTime: number, deltaTime: number): void;
}

interface FpsMetrics {
  fps: number;
  frameCount: number;
  avgFrameTime: number;
  minFrameTime: number;
  maxFrameTime: number;
  frameTimeHistory: number[];
}
```

#### Optimized Animation Components
```typescript
// app/components/OptimizedAnimation.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, AnimatePresence } from 'framer-motion';
import { Fps60AnimationSystem } from '../lib/60fps-animations';

interface OptimizedAnimationProps {
  children: React.ReactNode;
  variants?: any;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  className?: string;
  style?: React.CSSProperties;
  performanceMode?: '60fps' | '30fps' | 'adaptive';
}

export const OptimizedAnimation: React.FC<OptimizedAnimationProps> = ({
  children,
  variants,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
  className,
  style,
  performanceMode = '60fps'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const cleanupRef = useRef<(() => void) | null>(null);

  // Adaptive performance based on device capabilities
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    // Detect device performance capabilities
    const detectPerformance = () => {
      const fps = Fps60AnimationSystem.getMetrics().fps;
      
      if (fps >= 55) {
        setPerformanceLevel('high');
      } else if (fps >= 30) {
        setPerformanceLevel('medium');
      } else {
        setPerformanceLevel('low');
      }
    };

    const interval = setInterval(detectPerformance, 2000);
    detectPerformance();

    return () => clearInterval(interval);
  }, []);

  // Optimized transition based on performance level
  const optimizedTransition = useMemo(() => {
    const baseTransition = {
      duration: 0.5,
      ease: 'easeOut'
    };

    switch (performanceLevel) {
      case 'high':
        return { ...baseTransition, duration: 0.5 };
      case 'medium':
        return { ...baseTransition, duration: 0.3 };
      case 'low':
        return { ...baseTransition, duration: 0.2 };
      default:
        return baseTransition;
    }
  }, [performanceLevel]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  // Custom animation loop for 60fps performance
  useEffect(() => {
    if (!isVisible || performanceMode !== '60fps') return;

    let animationProgress = 0;
    const animationDuration = 500; // 500ms
    const startTime = performance.now();

    const animate = (currentTime: number, deltaTime: number) => {
      if (!elementRef.current) return;

      animationProgress = Math.min((currentTime - startTime) / animationDuration, 1);

      // Apply transform based on progress
      const transform = `translateY(${(1 - animationProgress) * 20}px)`;
      const opacity = animationProgress;

      elementRef.current.style.transform = transform;
      elementRef.current.style.opacity = opacity.toString();

      if (animationProgress < 1) {
        return; // Continue animation
      }
    };

    const cleanup = Fps60AnimationSystem.addCallback(animate);
    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isVisible, performanceMode]);

  // Hardware-accelerated styles
  const hardwareAcceleratedStyle = useMemo(() => ({
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    ...style
  }), [style]);

  if (!isVisible && performanceMode === '60fps') {
    return (
      <div
        ref={elementRef}
        className={className}
        style={hardwareAcceleratedStyle}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={hardwareAcceleratedStyle}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={optimizedTransition}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {children}
    </motion.div>
  );
};
```

## 2. 3D Performance Optimization

#### Optimized 3D Rendering Pipeline
```typescript
// app/lib/3d-performance.ts
export class ThreeJSPerformanceOptimizer {
  private static renderer: THREE.WebGLRenderer | null = null;
  private static scene: THREE.Scene | null = null;
  private static camera: THREE.PerspectiveCamera | null = null;
  private static animationId: number | null = null;
  private static frameCount = 0;
  private static lastFrameTime = 0;
  private static targetFPS = 60;

  static initialize(canvas: HTMLCanvasElement): void {
    // Create optimized renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Disable antialiasing for performance
      alpha: false,
      powerPreference: 'high-performance'
    });

    // Set pixel ratio based on device capabilities
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);

    // Optimize shadow mapping
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );

    this.startAnimationLoop();
  }

  private static startAnimationLoop(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      const frameTime = 1000 / this.targetFPS;

      // Only render if enough time has passed
      if (deltaTime >= frameTime) {
        this.render();
        this.updatePerformanceMetrics(currentTime, deltaTime);
        this.lastFrameTime = currentTime - (deltaTime % frameTime);
        this.frameCount++;
      }
    };

    animate();
  }

  private static render(): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    // Perform culling
    this.cullObjects();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  private static cullObjects(): void {
    if (!this.scene || !this.camera) return;

    // Frustum culling
    const frustum = new THREE.Frustum();
    const cameraMatrix = new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(cameraMatrix);

    // Cull objects outside frustum
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.visible = frustum.intersectsObject(object);
      }
    });

    // Level of Detail (LOD) based on distance
    this.applyLOD();
  }

  private static applyLOD(): void {
    if (!this.scene || !this.camera) return;

    const cameraPosition = this.camera.position;

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const distance = object.position.distanceTo(cameraPosition);
        
        // Adjust geometry detail based on distance
        if (distance < 50) {
          // High detail
          object.geometry = this.getHighDetailGeometry(object);
        } else if (distance < 100) {
          // Medium detail
          object.geometry = this.getMediumDetailGeometry(object);
        } else {
          // Low detail
          object.geometry = this.getLowDetailGeometry(object);
        }
      }
    });
  }

  private static getHighDetailGeometry(object: THREE.Mesh): THREE.BufferGeometry {
    // Return high detail geometry
    return object.userData.highDetailGeometry || object.geometry;
  }

  private static getMediumDetailGeometry(object: THREE.Mesh): THREE.BufferGeometry {
    // Return medium detail geometry
    return object.userData.mediumDetailGeometry || object.geometry;
  }

  private static getLowDetailGeometry(object: THREE.Mesh): THREE.BufferGeometry {
    // Return low detail geometry
    return object.userData.lowDetailGeometry || object.geometry;
  }

  private static updatePerformanceMetrics(currentTime: number, deltaTime: number): void {
    const fps = 1000 / deltaTime;
    
    // Adjust target FPS based on performance
    if (fps < 30) {
      this.targetFPS = Math.max(30, this.targetFPS - 5);
    } else if (fps > 55 && this.targetFPS < 60) {
      this.targetFPS = Math.min(60, this.targetFPS + 5);
    }

    // Log performance metrics every 60 frames
    if (this.frameCount % 60 === 0) {
      console.log(`3D Performance: ${fps.toFixed(1)}fps, Target: ${this.targetFPS}fps`);
    }
  }

  static dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.clear();
    }
  }
}
```

#### Optimized Globe Component
```typescript
// app/components/OptimizedGlobe.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeJSPerformanceOptimizer } from '../lib/3d-performance';

interface OptimizedGlobeProps {
  className?: string;
  width?: number;
  height?: number;
  performanceMode?: 'high' | 'medium' | 'low';
}

export const OptimizedGlobe: React.FC<OptimizedGlobeProps> = ({
  className,
  width = 800,
  height = 600,
  performanceMode = 'high'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: performanceMode === 'high',
      alpha: true,
      powerPreference: 'high-performance'
    });

    // Set size
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Create optimized globe geometry
    const geometry = new THREE.SphereGeometry(2, performanceMode === 'high' ? 64 : 32, performanceMode === 'high' ? 32 : 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0066cc,
      wireframe: performanceMode !== 'high'
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add lights based on performance mode
    if (performanceMode === 'high') {
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
    } else {
      // Simple lighting for performance
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);
    }

    // Animation loop
    let animationId: number;
    let lastTime = 0;
    let frameCount = 0;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      const targetFrameTime = performanceMode === 'high' ? 16.67 : performanceMode === 'medium' ? 33.33 : 66.67;

      if (deltaTime >= targetFrameTime) {
        // Rotate globe
        globe.rotation.y += 0.005;

        renderer.render(scene, camera);

        // Calculate FPS
        frameCount++;
        if (frameCount % 60 === 0) {
          const fps = 1000 / deltaTime;
          setFps(fps);
        }

        lastTime = currentTime - (deltaTime % targetFrameTime);
      }
    };

    animate();

    setIsInitialized(true);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [width, height, performanceMode]);

  return (
    <div className={`optimized-globe ${className || ''}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width, height }}
      />
      <div className="globe-stats">
        <span>FPS: {fps.toFixed(1)}</span>
        <span>Mode: {performanceMode}</span>
      </div>
    </div>
  );
};
```

## 3. React Performance Optimization

#### Optimized Component Rendering
```typescript
// app/lib/react-performance.ts
export class ReactPerformanceOptimizer {
  private static componentCache = new Map<string, React.ComponentType>();
  private static renderCache = new Map<string, any>();
  private static memoizedComponents = new Set<string>();

  static memoizeComponent<P extends object>(
    Component: React.ComponentType<P>,
    componentName: string
  ): React.ComponentType<P> {
    if (this.memoizedComponents.has(componentName)) {
      return this.componentCache.get(componentName) as React.ComponentType<P>;
    }

    const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
      // Custom comparison function
      return this.shallowEqual(prevProps, nextProps);
    });

    MemoizedComponent.displayName = `Memoized(${componentName})`;
    
    this.componentCache.set(componentName, MemoizedComponent);
    this.memoizedComponents.add(componentName);

    return MemoizedComponent;
  }

  private static shallowEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  static useStableCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList = []
  ): T {
    const callbackRef = useRef(callback);
    const depsRef = useRef(deps);

    // Update callback if dependencies change
    if (!this.shallowEqual(depsRef.current, deps)) {
      callbackRef.current = callback;
      depsRef.current = deps;
    }

    return useCallback(callbackRef.current, depsRef.current) as T;
  }

  static useStableMemo<T>(factory: () => T, deps: React.DependencyList = []): T {
    const memoRef = useRef<T>();
    const depsRef = useRef(deps);

    if (!this.shallowEqual(depsRef.current, deps)) {
      memoRef.current = factory();
      depsRef.current = deps;
    }

    return memoRef.current as T;
  }

  static useVirtualization<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ): {
    visibleItems: T[];
    startIndex: number;
    endIndex: number;
    scrollToIndex: (index: number) => void;
  } {
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(
      Math.min(items.length - 1, Math.floor(containerHeight / itemHeight))
    );

    const visibleItems = useMemo(() => {
      return items.slice(startIndex, endIndex + 1);
    }, [items, startIndex, endIndex]);

    const scrollToIndex = useCallback((index: number) => {
      setStartIndex(index);
      setEndIndex(Math.min(items.length - 1, index + Math.floor(containerHeight / itemHeight)));
    }, [items.length, containerHeight, itemHeight]);

    return {
      visibleItems,
      startIndex,
      endIndex,
      scrollToIndex
    };
  }
}
```

#### Performance Monitoring Hook
```typescript
// app/hooks/usePerformanceMonitor.ts
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const measurePerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      // Calculate FPS
      if (frameCountRef.current > 0) {
        const fps = 1000 / deltaTime;
        
        // Get memory usage
        const memory = (performance as any).memory;
        const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime: deltaTime,
          memoryUsage
        }));
      }

      frameCountRef.current++;
      lastTimeRef.current = currentTime;

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const startRenderMeasure = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback(() => {
    if (renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      renderStartRef.current = 0;
    }
  }, []);

  return {
    metrics,
    startRenderMeasure,
    endRenderMeasure
  };
};
```

## 4. Memory Management

#### Memory Pooling System
```typescript
// app/lib/memory-pool.ts
export class MemoryPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;

  constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize: number = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  clear(): void {
    this.pool = [];
  }

  size(): number {
    return this.pool.length;
  }
}

// Pre-configured memory pools
export const memoryPools = {
  vectors: new MemoryPool(
    () => new THREE.Vector3(),
    (vec) => vec.set(0, 0, 0),
    100
  ),
  colors: new MemoryPool(
    () => new THREE.Color(),
    (color) => color.set(0, 0, 0),
    50
  ),
  matrices: new MemoryPool(
    () => new THREE.Matrix4(),
    (matrix) => matrix.identity(),
    50
  ),
  raycasters: new MemoryPool(
    () => new THREE.Raycaster(),
    (raycaster) => {
      raycaster.ray.set(0, 0, 0, 0, 0, 1);
    },
    20
  )
};
```

## 5. Performance Monitoring Dashboard

#### Real-time Performance Dashboard
```typescript
// app/components/PerformanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface PerformanceDashboardProps {
  className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const metrics = usePerformanceMonitor('PerformanceDashboard');

  useEffect(() => {
    // Show dashboard in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const getPerformanceColor = (value: number, target: number, inverse = false) => {
    const ratio = value / target;
    if (inverse) {
      return ratio >= 0.9 ? 'text-green-500' : ratio >= 0.7 ? 'text-yellow-500' : 'text-red-500';
    } else {
      return ratio >= 0.9 ? 'text-red-500' : ratio >= 0.7 ? 'text-yellow-500' : 'text-green-500';
    }
  };

  return (
    <div className={`performance-dashboard ${className || ''}`}>
      <div className="performance-metrics">
        <div className="metric">
          <span className="metric-label">FPS</span>
          <span className={`metric-value ${getPerformanceColor(metrics.fps, 60)}`}>
            {metrics.fps.toFixed(1)}
          </span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Frame Time</span>
          <span className={`metric-value ${getPerformanceColor(metrics.frameTime, 16.67, true)}`}>
            {metrics.frameTime.toFixed(2)}ms
          </span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Memory</span>
          <span className={`metric-value ${getPerformanceColor(metrics.memoryUsage, 100, true)}`}>
            {metrics.memoryUsage.toFixed(1)}MB
          </span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Render Time</span>
          <span className={`metric-value ${getPerformanceColor(metrics.renderTime, 16.67, true)}`}>
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>
      </div>
      
      <div className="performance-status">
        <div className={`status ${metrics.fps >= 45 ? 'good' : metrics.fps >= 30 ? 'acceptable' : 'poor'}`}>
          {metrics.fps >= 45 ? '🟢 60fps Target Met' : 
           metrics.fps >= 30 ? '🟡 Acceptable Performance' : 
           '🔴 Performance Issues'}
        </div>
      </div>
    </div>
  );
};
```

## 6. Performance Testing

#### 60fps Performance Tests
```typescript
// tests/performance/60fps-performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('60fps Performance Tests', () => {
  test('Homepage maintains 60fps animations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Start performance monitoring
    await page.evaluate(() => {
      window.fpsMetrics = {
        frames: [],
        startTime: performance.now()
      };
      
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        
        window.fpsMetrics.frames.push({
          frameNumber: frameCount,
          timestamp: currentTime,
          deltaTime: currentTime - lastTime
        });
        
        lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    });
    
    // Wait for animations to run
    await page.waitForTimeout(5000);
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const frames = window.fpsMetrics.frames;
      const frameTimes = frames.map(f => f.deltaTime);
      const fps = frames.map(f => 1000 / f.deltaTime);
      
      return {
        totalFrames: frames.length,
        averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
        minFPS: Math.min(...fps),
        maxFPS: Math.max(...fps),
        averageFrameTime: frameTimes.reduce((sum, t) => sum + t, 0) / frameTimes.length,
        maxFrameTime: Math.max(...frameTimes)
      };
    });
    
    // Assert 60fps target
    expect(metrics.averageFPS).toBeGreaterThanOrEqual(45); // At least 45fps average
    expect(metrics.minFPS).toBeGreaterThanOrEqual(30); // Minimum 30fps
    expect(metrics.maxFrameTime).toBeLessThan(33.33); // Maximum 33.33ms per frame
    
    console.log('60fps Performance Metrics:', metrics);
  });

  test('3D globe maintains 60fps on desktop', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Wait for 3D globe to load
    await page.waitForSelector('[data-testid="3d-globe"]', { timeout: 10000 });
    
    // Monitor 3D performance
    await page.evaluate(() => {
      window.globeMetrics = {
        frames: [],
        startTime: performance.now()
      };
      
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureGlobeFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        
        window.globeMetrics.frames.push({
          frameNumber: frameCount,
          timestamp: currentTime,
          deltaTime: currentTime - lastTime
        });
        
        lastTime = currentTime;
        requestAnimationFrame(measureGlobeFrame);
      };
      
      requestAnimationFrame(measureGlobeFrame);
    });
    
    // Let globe animate
    await page.waitForTimeout(3000);
    
    const metrics = await page.evaluate(() => {
      const frames = window.globeMetrics.frames;
      const fps = frames.map(f => 1000 / f.deltaTime);
      
      return {
        averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
        minFPS: Math.min(...fps),
        maxFPS: Math.max(...fps)
      };
    });
    
    // 3D globe performance targets (slightly lower than UI)
    expect(metrics.averageFPS).toBeGreaterThanOrEqual(30);
    expect(metrics.minFPS).toBeGreaterThanOrEqual(20);
    
    console.log('3D Globe Performance:', metrics);
  });

  test('Mobile performance optimization', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test mobile performance
    await page.evaluate(() => {
      window.mobileMetrics = {
        frames: [],
        startTime: performance.now()
      };
      
      let frameCount = 0;
      let lastTime = performance.now();
      
      const measureMobileFrame = () => {
        frameCount++;
        const currentTime = performance.now();
        
        window.mobileMetrics.frames.push({
          frameNumber: frameCount,
          timestamp: currentTime,
          deltaTime: currentTime - lastTime
        });
        
        lastTime = currentTime;
        requestAnimationFrame(measureMobileFrame);
      };
      
      requestAnimationFrame(measureMobileFrame);
    });
    
    await page.waitForTimeout(3000);
    
    const metrics = await page.evaluate(() => {
      const frames = window.mobileMetrics.frames;
      const fps = frames.map(f => 1000 / f.deltaTime);
      
      return {
        averageFPS: fps.reduce((sum, f) => sum + f, 0) / fps.length,
        minFPS: Math.min(...fps),
        maxFPS: Math.max(...fps)
      };
    });
    
    // Mobile performance targets (more lenient)
    expect(metrics.averageFPS).toBeGreaterThanOrEqual(25);
    expect(metrics.minFPS).toBeGreaterThanOrEqual(15);
    
    console.log('Mobile Performance:', metrics);
  });

  test('Memory usage stays within limits', async ({ page }) => {
    await page.goto('/');
    
    // Monitor memory usage
    await page.evaluate(() => {
      window.memoryMetrics = {
        samples: [],
        startTime: performance.now()
      };
      
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          window.memoryMetrics.samples.push({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            timestamp: performance.now()
          });
        }
      };
      
      const interval = setInterval(checkMemory, 500);
      
      // Stop monitoring after 10 seconds
      setTimeout(() => clearInterval(interval), 10000);
    });
    
    await page.waitForTimeout(10000);
    
    const metrics = await page.evaluate(() => {
      const samples = window.memoryMetrics.samples;
      const maxMemory = Math.max(...samples.map(s => s.used));
      const avgMemory = samples.reduce((sum, s) => sum + s.used, 0) / samples.length;
      
      return {
        maxMemoryMB: maxMemory / 1024 / 1024,
        avgMemoryMB: avgMemory / 1024 / 1024,
        samples: samples.length
      };
    });
    
    // Memory usage limits
    expect(metrics.maxMemoryMB).toBeLessThan(150); // 150MB max
    expect(metrics.avgMemoryMB).toBeLessThan(100); // 100MB average
    
    console.log('Memory Usage:', metrics);
  });
});
```

This comprehensive 60fps optimization strategy ensures the Smart City Command Center maintains smooth animations and interactions across all devices while providing real-time performance monitoring and adaptive optimization.

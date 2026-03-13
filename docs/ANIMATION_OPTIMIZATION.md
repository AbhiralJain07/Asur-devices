# Animation Performance Optimization Guide

This guide covers performance optimization techniques for animations across all user stories in the Smart City Command Center project.

## Performance Targets

### Animation Performance Goals
- **Target FPS**: 60fps (16.67ms per frame)
- **Jank Threshold**: < 100ms for any single frame
- **Animation Duration**: Optimal 200-500ms for UI animations
- **GPU Acceleration**: Use transform and opacity properties
- **Memory Usage**: < 50MB for animation-related assets

### Performance Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Interaction to Next Paint (INP)**: < 200ms

## Optimization Techniques

### 1. Hardware Acceleration

#### Use Transform and Opacity
```typescript
// Good - GPU accelerated
<motion.div
  animate={{ 
    scale: 1.2, 
    opacity: 0.8,
    transform: "translateX(100px)"
  }}
/>

// Bad - CPU intensive
<motion.div
  animate={{ 
    width: "200px",
    height: "200px",
    backgroundColor: "#ff0000"
  }}
/>
```

#### Will-Change Property
```typescript
// Use will-change for complex animations
const style = {
  willChange: "transform, opacity",
  transform: "translateX(0)"
};

// Remove will-change after animation
const cleanupStyle = {
  willChange: "auto"
};
```

### 2. Animation Scheduling

#### Use requestAnimationFrame
```typescript
const useOptimizedAnimation = () => {
  const animationRef = useRef<number>();
  const startTime = useRef<number>();
  
  const animate = useCallback((timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp;
    
    const elapsed = timestamp - startTime.current;
    const progress = Math.min(elapsed / 1000, 1); // 1 second animation
    
    // Animation logic here
    
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);
  
  return { animate };
};
```

#### Batch DOM Updates
```typescript
const useBatchedUpdates = () => {
  const [updates, setUpdates] = useState<(() => void)[]>([]);
  
  const flushUpdates = useCallback(() => {
    unstable_batchedUpdates(() => {
      updates.forEach(update => update());
      setUpdates([]);
    });
  }, [updates]);
  
  return { flushUpdates };
};
```

### 3. Component Optimization

#### React.memo for Animated Components
```typescript
const AnimatedMetricCard = React.memo(({ metric }: { metric: ImpactMetrics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MetricCard metric={metric} />
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.metric.id === nextProps.metric.id &&
         prevProps.metric.currentValue === nextProps.metric.currentValue;
});
```

#### useMemo for Complex Calculations
```typescript
const useOptimizedAnimation = (value: number) => {
  const animationConfig = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.5,
      ease: "easeOut",
      delay: value * 0.1 // Stagger animations
    }
  }), [value]);
  
  return animationConfig;
};
```

### 4. Asset Optimization

#### Optimize 3D Models
```typescript
// Use compressed GLTF models
const useOptimizedGlobe = () => {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  
  useEffect(() => {
    // Load compressed model
    const loader = new GLTFLoader();
    loader.load('/models/globe-compressed.glb', (gltf) => {
      // Optimize geometry
      const object = gltf.scene;
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }
      });
      setModel(object);
    });
  }, []);
  
  return model;
};
```

#### Image Optimization
```typescript
const useOptimizedImages = () => {
  const [images, setImages] = useState<Map<string, HTMLImageElement>>(new Map());
  
  const loadImage = useCallback((src: string, quality: number = 75) => {
    const img = new Image();
    img.src = `${src}?quality=${quality}`;
    img.onload = () => {
      setImages(prev => new Map(prev).set(src, img));
    };
    return img;
  }, []);
  
  return { images, loadImage };
};
```

## Component-Specific Optimizations

### 1. Globe Visualization

#### Level of Detail (LOD)
```typescript
const useLODGlobe = (cameraDistance: number) => {
  const getLODLevel = (distance: number) => {
    if (distance < 100) return 'high';
    if (distance < 500) return 'medium';
    return 'low';
  };
  
  const lodLevel = getLODLevel(cameraDistance);
  
  return {
    pointSize: lodLevel === 'high' ? 2 : lodLevel === 'medium' ? 1 : 0.5,
    segments: lodLevel === 'high' ? 64 : lodLevel === 'medium' ? 32 : 16,
    renderDistance: lodLevel === 'high' ? 1000 : lodLevel === 'medium' ? 500 : 200
  };
};
```

#### Frustum Culling
```typescript
const useFrustumCulling = (camera: THREE.Camera, objects: THREE.Object3D[]) => {
  const frustum = new THREE.Frustum();
  const cameraMatrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix, 
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(cameraMatrix);
  
  return objects.filter(object => frustum.intersectsObject(object));
};
```

#### Instance Rendering
```typescript
const useInstancedRendering = (cityData: CityData[]) => {
  const instancedMesh = useRef<THREE.InstancedMesh>();
  
  useEffect(() => {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    
    const mesh = new THREE.InstancedMesh(geometry, material, cityData.length);
    
    // Set instance matrices
    cityData.forEach((city, index) => {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(city.longitude, city.latitude, 0);
      mesh.setMatrixAt(index, matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
    instancedMesh.current = mesh;
  }, [cityData]);
  
  return instancedMesh.current;
};
```

### 2. Data Visualization

#### Canvas Optimization
```typescript
const useOptimizedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create offscreen canvas for complex rendering
    const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    offscreenCanvasRef.current = offscreen;
    
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;
    
    // Use requestAnimationFrame for smooth rendering
    let animationId: number;
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, offscreen.width, offscreen.height);
      
      // Render charts
      // ... rendering logic
      
      animationId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return canvasRef;
};
```

#### Chart Performance
```typescript
const useOptimizedChart = (data: ChartData[]) => {
  const chartRef = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Throttle chart updates
    const updateChart = throttle((newData: ChartData[]) => {
      chartRef.current?.data = newData;
      chartRef.current?.update('none'); // No animation for performance
    }, 100);
    
    updateChart(data);
    
    return () => {
      updateChart.cancel();
    };
  }, [data]);
  
  return chartRef;
};
```

### 3. Real-Time Data

#### Debounce Updates
```typescript
const useDebouncedData = (data: any, delay: number = 100) => {
  const [debouncedData, setDebouncedData] = useState(data);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedData(data);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [data, delay]);
  
  return debouncedData;
};
```

#### Virtual Scrolling
```typescript
const useVirtualScroll = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);
  
  return { visibleItems, setScrollTop };
};
```

## Memory Management

### 1. Cleanup Resources
```typescript
const useResourceCleanup = () => {
  const resources = useRef<Set<() => void>>(new Set());
  
  const addCleanup = useCallback((cleanup: () => void) => {
    resources.current.add(cleanup);
  }, []);
  
  useEffect(() => {
    return () => {
      resources.current.forEach(cleanup => cleanup());
      resources.current.clear();
    };
  }, []);
  
  return { addCleanup };
};
```

### 2. Object Pooling
```typescript
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  
  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }
  
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage for animation objects
const animationPool = new ObjectPool(
  () => ({ x: 0, y: 0, scale: 1, opacity: 1 }),
  (obj) => {
    obj.x = 0;
    obj.y = 0;
    obj.scale = 1;
    obj.opacity = 1;
  },
  50
);
```

## Performance Monitoring

### 1. FPS Counter
```typescript
const useFPSCounter = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  
  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    const animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return fps;
};
```

### 2. Performance Metrics
```typescript
const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0
  });
  
  useEffect(() => {
    const measure = () => {
      const memory = (performance as any).memory;
      const renderStart = performance.now();
      
      // Trigger re-render
      setMetrics({
        fps: metrics.fps,
        memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        renderTime: performance.now() - renderStart
      });
    };
    
    const interval = setInterval(measure, 1000);
    
    return () => clearInterval(interval);
  }, [metrics.fps]);
  
  return metrics;
};
```

## Best Practices Summary

### 1. Animation Principles
- Use transform and opacity for GPU acceleration
- Avoid layout thrashing (read before write)
- Use requestAnimationFrame for smooth animations
- Implement proper cleanup for animation resources

### 2. React Optimization
- Use React.memo for expensive components
- Implement proper comparison functions
- Use useMemo and useCallback for expensive operations
- Batch state updates when possible

### 3. Memory Management
- Clean up event listeners and timers
- Use object pooling for frequently created objects
- Implement proper resource disposal
- Monitor memory usage and prevent leaks

### 4. Performance Monitoring
- Implement FPS counters for critical animations
- Monitor memory usage
- Track render times
- Use performance budgets

### 5. User Experience
- Prioritize above-the-fold animations
- Use progressive enhancement
- Implement fallbacks for low-end devices
- Respect user's motion preferences

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up performance monitoring
- [ ] Implement FPS counters
- [ ] Create animation utilities
- [ ] Set up memory management

### Phase 2: Component Optimization
- [ ] Optimize Globe component
- [ ] Optimize Chart components
- [ ] Optimize Animation components
- [ ] Implement React.memo where needed

### Phase 3: Asset Optimization
- [ ] Compress 3D models
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Use CDN for static assets

### Phase 4: Advanced Optimizations
- [ ] Implement LOD for 3D objects
- [ ] Add frustum culling
- [ ] Use instanced rendering
- [ ] Implement virtual scrolling

### Phase 5: Monitoring and Testing
- [ ] Set up performance budgets
- [ ] Implement automated testing
- [ ] Monitor in production
- [ ] Continuously optimize

By following these guidelines, we ensure smooth 60fps animations across all user stories while maintaining excellent performance and user experience.

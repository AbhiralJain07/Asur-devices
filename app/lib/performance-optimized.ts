"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Performance monitoring utilities
export const useFPSCounter = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId.current = requestAnimationFrame(measureFPS);
    };
    
    animationId.current = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return fps;
};

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0
  });

  useEffect(() => {
    const measure = () => {
      const memory = (performance as any).memory;
      const renderStart = performance.now();
      
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
          renderTime: performance.now() - renderStart
        }));
      }, 0);
    };
    
    const interval = setInterval(measure, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

// Optimized animation hook
export const useOptimizedAnimation = (
  duration: number = 500,
  easing: string = "easeOut"
) => {
  const animationConfig = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration,
      ease: easing,
      willChange: "transform, opacity"
    },
    exit: { opacity: 0, scale: 0.8 }
  }), [duration, easing]);

  return animationConfig;
};

// Debounced animation
export const useDebouncedAnimation = (delay: number = 100) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const triggerAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setShouldAnimate(true);
      setTimeout(() => setShouldAnimate(false), 1000);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { shouldAnimate, triggerAnimation };
};

// Optimized stagger animation
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay: number = 100
) => {
  return useMemo(() => {
    return Array.from({ length: itemCount }, (_, index) => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 500,
        delay: index * staggerDelay,
        ease: "easeOut"
      }
    }));
  }, [itemCount, staggerDelay]);
};

// Intersection Observer for lazy animations
export const useLazyAnimation = (
  threshold: number = 0.1,
  rootMargin: string = "50px"
) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

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
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible };
};

// Reduced motion support
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

// Adaptive animation based on device performance
export const useAdaptiveAnimation = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const fps = useFPSCounter();

  useEffect(() => {
    if (fps >= 55) {
      setPerformanceLevel('high');
    } else if (fps >= 30) {
      setPerformanceLevel('medium');
    } else {
      setPerformanceLevel('low');
    }
  }, [fps]);

  const getAnimationConfig = useCallback((baseConfig: any) => {
    switch (performanceLevel) {
      case 'high':
        return baseConfig;
      case 'medium':
        return {
          ...baseConfig,
          transition: {
            ...baseConfig.transition,
            duration: baseConfig.transition?.duration * 0.7 || 350
          }
        };
      case 'low':
        return {
          ...baseConfig,
          transition: {
            ...baseConfig.transition,
            duration: baseConfig.transition?.duration * 0.5 || 250
          }
        };
    }
  }, [performanceLevel]);

  return { performanceLevel, getAnimationConfig };
};

// Memory-efficient animation pool
class AnimationPool {
  private pool: Map<string, any[]> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  acquire<T>(type: string, createFn: () => T): T {
    const typePool = this.pool.get(type) || [];
    
    if (typePool.length > 0) {
      return typePool.pop()!;
    }
    
    return createFn();
  }

  release<T>(type: string, obj: T, resetFn?: (obj: T) => void): void {
    const typePool = this.pool.get(type) || [];
    
    if (resetFn) {
      resetFn(obj);
    }
    
    if (typePool.length < this.maxSize) {
      typePool.push(obj);
      this.pool.set(type, typePool);
    }
  }

  clear(): void {
    this.pool.clear();
  }
}

export const animationPool = new AnimationPool();

// Optimized scroll-triggered animation
export const useScrollAnimation = (
  animationConfig: any,
  threshold: number = 0.1
) => {
  const { elementRef, isVisible } = useLazyAnimation(threshold);
  const prefersReducedMotion = useReducedMotion();
  const { getAnimationConfig } = useAdaptiveAnimation();

  const finalConfig = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: animationConfig.initial,
        animate: animationConfig.animate,
        transition: { duration: 0 }
      };
    }
    
    return getAnimationConfig(animationConfig);
  }, [animationConfig, prefersReducedMotion, getAnimationConfig]);

  return { elementRef, isVisible, config: finalConfig };
};

// Performance optimization utilities
export const performanceUtils = {
  // Throttle function for performance-critical operations
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return ((...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    }) as T;
  },

  // Debounce function for input handling
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  },

  // RequestAnimationFrame wrapper with cleanup
  raf: (callback: FrameRequestCallback) => {
    let animationId: number;
    
    const animate = (timestamp: number) => {
      animationId = requestAnimationFrame(animate);
      callback(timestamp);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  },

  // Memory usage checker
  checkMemoryUsage: () => {
    const memory = (performance as any).memory;
    if (!memory) return null;
    
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  },

  // Frame time measurement
  measureFrameTime: (callback: () => void) => {
    const start = performance.now();
    callback();
    return performance.now() - start;
  }
};

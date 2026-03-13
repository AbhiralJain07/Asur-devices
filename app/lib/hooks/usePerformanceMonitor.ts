"use client";

import { useEffect, useRef, useState } from "react";

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        }));
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  return metrics;
}

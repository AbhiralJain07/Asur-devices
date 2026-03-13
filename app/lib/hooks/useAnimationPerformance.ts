"use client";

import { useCallback, useRef, useEffect } from "react";

interface AnimationPerformanceConfig {
  targetFPS: number;
  maxFrameTime: number;
  enableOptimizations: boolean;
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  droppedFrames: number;
}

export function useAnimationPerformance(config: AnimationPerformanceConfig = {
  targetFPS: 60,
  maxFrameTime: 16.67, // 1000ms / 60fps
  enableOptimizations: true,
}) {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const droppedFramesRef = useRef(0);
  const metricsRef = useRef<PerformanceMetrics>({
    fps: config.targetFPS,
    frameTime: 0,
    memoryUsage: 0,
    droppedFrames: 0,
  });

  const measureFrame = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    frameCountRef.current++;
    
    // Check for dropped frames
    if (deltaTime > config.maxFrameTime) {
      droppedFramesRef.current++;
    }
    
    // Update metrics every second
    if (frameCountRef.current >= config.targetFPS) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      const frameTime = deltaTime;
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      metricsRef.current = {
        fps,
        frameTime,
        memoryUsage,
        droppedFrames: droppedFramesRef.current,
      };
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      droppedFramesRef.current = 0;
    }
  }, [config.targetFPS, config.maxFrameTime]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const shouldOptimize = useCallback(() => {
    const metrics = getMetrics();
    return config.enableOptimizations && (
      metrics.fps < config.targetFPS * 0.8 || 
      metrics.frameTime > config.maxFrameTime * 1.5 ||
      metrics.droppedFrames > 5
    );
  }, [config.enableOptimizations, config.targetFPS, config.maxFrameTime, getMetrics]);

  return {
    measureFrame,
    getMetrics,
    shouldOptimize,
  };
}

export function useAnimationOptimizer() {
  const optimizationLevelRef = useRef<"high" | "medium" | "low">("high");
  
  const setOptimizationLevel = useCallback((level: "high" | "medium" | "low") => {
    optimizationLevelRef.current = level;
  }, []);

  const getOptimizationSettings = useCallback(() => {
    const level = optimizationLevelRef.current;
    
    switch (level) {
      case "high":
        return {
          enableShadows: true,
          enableReflections: true,
          particleCount: 100,
          textureQuality: "high",
          antialiasing: true,
        };
      case "medium":
        return {
          enableShadows: false,
          enableReflections: false,
          particleCount: 50,
          textureQuality: "medium",
          antialiasing: true,
        };
      case "low":
        return {
          enableShadows: false,
          enableReflections: false,
          particleCount: 20,
          textureQuality: "low",
          antialiasing: false,
        };
    }
  }, []);

  return {
    setOptimizationLevel,
    getOptimizationSettings,
    currentLevel: optimizationLevelRef.current,
  };
}

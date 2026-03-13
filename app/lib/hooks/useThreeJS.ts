"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface UseThreeJSProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  performanceMode?: "high" | "medium" | "low";
}

export function useThreeJS({ containerRef, performanceMode = "high" }: UseThreeJSProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer setup with performance considerations
      const renderer = new THREE.WebGLRenderer({ 
        antialias: performanceMode !== "low",
        alpha: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceMode === "high" ? 2 : 1));
      rendererRef.current = renderer;

      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0x00d9ff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      setIsLoading(false);

      // Animation loop
      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize 3D scene");
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [containerRef, performanceMode]);

  return { scene: sceneRef.current, isLoading, error };
}

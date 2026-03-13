"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useThreeJS } from "../../app/lib/hooks/useThreeJS";
import { usePerformanceMonitor } from "../../app/lib/hooks/usePerformanceMonitor";
import { SmartCityData } from "../../app/types";

interface CityVisualizationProps {
  cityData: SmartCityData;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  autoRotate?: boolean;
  dataOverlay?: "traffic" | "pollution" | "energy" | "none";
  onDistrictHover?: (districtId: string) => void;
  onDistrictClick?: (districtId: string) => void;
}

// Camera animation component
function CameraAnimation({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (autoRotate && camera) {
      const time = state.clock.elapsedTime;
      const radius = 25;
      camera.position.x = Math.sin(time * 0.1) * radius;
      camera.position.z = Math.cos(time * 0.1) * radius;
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
}

// Building component
function Building({ position, height, color, onClick }: {
  position: [number, number, number];
  height: number;
  color: string;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial
        color={hovered ? "#00D9FF" : color}
        emissive={hovered ? "#00D9FF" : "#000000"}
        emissiveIntensity={hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

// City component
function City({ cityData, onDistrictClick }: {
  cityData: SmartCityData;
  onDistrictClick?: (districtId: string) => void;
}) {
  const buildings = [];
  
  // Generate buildings based on city data
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const height = Math.random() * 3 + 1;
      const position: [number, number, number] = [
        (i - 10) * 2,
        height / 2,
        (j - 10) * 2
      ];
      
      // Color based on traffic flow
      const trafficLevel = cityData.metrics.traffic.flowRate;
      let color = "#1A1A2E";
      if (trafficLevel > 80) color = "#00FF88";
      else if (trafficLevel > 60) color = "#FF006E";
      
      buildings.push(
        <Building
          key={`${i}-${j}`}
          position={position}
          height={height}
          color={color}
          onClick={() => onDistrictClick?.(`district-${i}-${j}`)}
        />
      );
    }
  }

  return <>{buildings}</>;
}

// Ground component
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#0A0A0F" />
    </mesh>
  );
}

export default function CityVisualization({
  cityData,
  cameraPosition = { x: 15, y: 10, z: 15 },
  autoRotate = true,
  dataOverlay = "none",
  onDistrictHover,
  onDistrictClick,
}: CityVisualizationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isLoading, error } = useThreeJS({ containerRef, performanceMode: "high" });
  const metrics = usePerformanceMonitor();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary">
        <div className="text-neon-blue">Loading 3D visualization...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary">
        <div className="text-red-500">Failed to load 3D visualization: {error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{ position: [cameraPosition.x, cameraPosition.y, cameraPosition.z] }}
        gl={{ antialias: true, alpha: true }}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={autoRotate}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={10}
          maxDistance={50}
        />
        
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, 10, -5]} intensity={0.5} color="#9D4EDD" />
        
        <CameraAnimation autoRotate={autoRotate} />
        <Ground />
        <City cityData={cityData} onDistrictClick={onDistrictClick} />
      </Canvas>
      
      {/* Performance overlay for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 text-xs text-neon-blue font-mono">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
        </div>
      )}
    </div>
  );
}

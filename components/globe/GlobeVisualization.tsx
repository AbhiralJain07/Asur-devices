"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useThreeJS } from "../../app/lib/hooks/useThreeJS";
import { usePerformanceMonitor } from "../../app/lib/hooks/usePerformanceMonitor";
import { GlobeState, type CityMarker } from "../../app/types";

interface GlobeVisualizationProps {
  globeState: GlobeState;
  onCityClick?: (cityId: string) => void;
  onCityHover?: (cityId: string | null) => void;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  autoRotate?: boolean;
  rotationSpeed?: number;
  zoom?: number;
}

// Globe sphere component
function Globe({ rotationSpeed, isRotating }: { 
  rotationSpeed: number; 
  isRotating: boolean; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[10, 64, 64]} />
      <meshPhongMaterial
        color="#0A0A0F"
        emissive="#1A1A2E"
        emissiveIntensity={0.2}
        shininess={10}
        specular="#00D9FF"
      />
    </mesh>
  );
}

// Globe grid lines
function GlobeGrid() {
  const gridLines = useMemo(() => {
    const lines = [];
    
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const points = [];
      for (let lng = -180; lng <= 180; lng += 10) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const radius = 10.1; // Slightly larger than globe
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    
    // Longitude lines
    for (let lng = -180; lng <= 180; lng += 30) {
      const points = [];
      for (let lat = -90; lat <= 90; lat += 10) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const radius = 10.1;
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    
    return lines;
  }, []);

  return (
    <>
      {gridLines.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00D9FF" opacity={0.2} transparent />
        </line>
      ))}
    </>
  );
}

// Atmosphere glow effect
function Atmosphere() {
  return (
    <mesh scale={[12, 12, 12]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#00D9FF"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// City marker component
function CityMarker({ 
  marker, 
  onClick, 
  onHover 
}: { 
  marker: CityMarker; 
  onClick?: (cityId: string) => void; 
  onHover?: (cityId: string | null) => void; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && marker.isActive) {
      const scale = hovered ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const handleClick = () => {
    onClick?.(marker.cityId);
  };

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(marker.cityId);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(null);
  };

  if (!marker.isActive) {
    return (
      <mesh
        ref={meshRef}
        position={[marker.position.x, marker.position.y, marker.position.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
    );
  }

  return (
    <mesh
      ref={meshRef}
      position={[marker.position.x, marker.position.y, marker.position.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial
        color={hovered ? "#00FF88" : "#00D9FF"}
      />
    </mesh>
  );
}

// Camera animation component
function CameraAnimation({ zoom }: { zoom: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (camera) {
      camera.position.multiplyScalar(zoom);
      camera.lookAt(0, 0, 0);
    }
  }, [camera, zoom]);
  
  return null;
}

export default function GlobeVisualization({
  globeState,
  onCityClick,
  onCityHover,
  cameraPosition = { x: 0, y: 0, z: 30 },
  autoRotate = true,
  rotationSpeed = 0.002,
  zoom = 1,
}: GlobeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isLoading, error } = useThreeJS({ containerRef, performanceMode: "high" });
  const metrics = usePerformanceMonitor();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary">
        <div className="text-neon-blue">Loading globe visualization...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary">
        <div className="text-red-500">Failed to load globe: {error}</div>
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
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={15}
          maxDistance={50}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, 10, -5]} intensity={0.5} color="#9D4EDD" />
        
        <CameraAnimation zoom={zoom} />
        <Atmosphere />
        <Globe rotationSpeed={rotationSpeed} isRotating={globeState.isRotating} />
        <GlobeGrid />
        
        {globeState.markers.map((marker) => (
          <CityMarker
            key={marker.cityId}
            marker={marker}
            onClick={onCityClick}
            onHover={onCityHover}
          />
        ))}
      </Canvas>
      
      {/* Performance overlay for development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 text-xs text-neon-blue font-mono">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
          <div>Cities: {globeState.markers.length}</div>
        </div>
      )}
    </div>
  );
}

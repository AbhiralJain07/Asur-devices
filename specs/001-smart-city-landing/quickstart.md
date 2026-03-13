# Quickstart Guide: Smart City Command Center Landing Page

**Created**: 2026-03-12  
**Purpose**: Development setup and initial implementation guide

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git
- Modern web browser with WebGL support
- Code editor (VS Code recommended)

## Project Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest smart-city-landing --typescript --tailwind --eslint --app
cd smart-city-landing
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install @react-three/fiber @react-three/drei three
npm install framer-motion
npm install lucide-react

# Development dependencies
npm install -D @types/three
npm install -D eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
```

### 3. Configure TailwindCSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        background: {
          primary: '#0A0A0F',
          secondary: '#1A1A2E',
          tertiary: '#16213E',
        },
        // Neon accent colors
        neon: {
          blue: '#00D9FF',
          purple: '#9D4EDD',
          green: '#00FF88',
          pink: '#FF006E',
        },
        // Surface colors
        surface: {
          primary: 'rgba(26, 26, 46, 0.8)',
          secondary: 'rgba(22, 33, 62, 0.6)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### 4. Create Project Structure

```bash
mkdir -p app/components/{ui,visualizations,sections,layout}
mkdir -p app/lib/{utils,hooks,constants}
mkdir -p app/styles
mkdir -p app/types
mkdir -p components/{globe,city-visualization,analytics,predictions,monitoring}
mkdir -p tests/{visual,performance,integration}
```

### 5. Setup Global Styles

Create `app/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-background-primary text-white;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-background-secondary;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-neon-blue/50;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-neon-blue/70;
  }
}

@layer components {
  /* Neon glow effects */
  .neon-glow {
    @apply shadow-[0_0_20px_rgba(0,217,255,0.5)];
  }
  
  .neon-glow-purple {
    @apply shadow-[0_0_20px_rgba(157,78,221,0.5)];
  }
  
  .neon-glow-green {
    @apply shadow-[0_0_20px_rgba(0,255,136,0.5)];
  }
  
  /* Glass morphism effect */
  .glass {
    @apply bg-surface-primary backdrop-blur-md border border-white/10;
  }
  
  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent;
  }
}
```

## Core Components

### 1. Base Layout Component

Create `app/components/layout/Layout.tsx`:

```typescript
'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background-primary">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

### 2. Navigation Component

Create `app/components/layout/Navigation.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Impact', href: '#impact' },
    { label: 'Technology', href: '#technology' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold gradient-text">
            SmartCity AI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button className="px-6 py-2 bg-neon-blue text-black font-semibold rounded-lg hover:bg-neon-blue/80 transition-colors">
              Schedule Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 glass rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-gray-300 hover:text-neon-blue transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full mt-4 px-6 py-2 bg-neon-blue text-black font-semibold rounded-lg hover:bg-neon-blue/80 transition-colors">
              Schedule Demo
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
```

### 3. 3D Visualization Hook

Create `app/lib/hooks/useThreeJS.ts`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface UseThreeJSProps {
  containerRef: React.RefObject<HTMLDivElement>;
  performanceMode?: 'high' | 'medium' | 'low';
}

export function useThreeJS({ containerRef, performanceMode = 'high' }: UseThreeJSProps) {
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
        antialias: performanceMode !== 'low',
        alpha: true,
        powerPreference: 'high-performance'
      });
      
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceMode === 'high' ? 2 : 1));
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
      setError(err instanceof Error ? err.message : 'Failed to initialize 3D scene');
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
```

## Data Simulation

### 1. Smart City Data Generator

Create `app/lib/utils/dataGenerator.ts`:

```typescript
import { SmartCityData, TrafficMetrics, PollutionMetrics, WasteMetrics, EnergyMetrics } from '../types/smartCity';

export class SmartCityDataGenerator {
  private updateInterval: NodeJS.Timeout | null = null;

  generateTrafficMetrics(): TrafficMetrics {
    return {
      flowRate: 70 + Math.random() * 25, // 70-95%
      congestionLevel: Math.random() * 30, // 0-30%
      averageSpeed: 30 + Math.random() * 40, // 30-70 km/h
      incidents: Math.random() > 0.8 ? [{
        id: `incident-${Date.now()}`,
        type: ['accident', 'construction', 'weather'][Math.floor(Math.random() * 3)] as any,
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        location: { lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.0060 + (Math.random() - 0.5) * 0.1 }
      }] : []
    };
  }

  generatePollutionMetrics(): PollutionMetrics {
    return {
      airQualityIndex: 50 + Math.random() * 100, // 50-150 AQI
      pm25: 10 + Math.random() * 20, // 10-30 μg/m³
      pm10: 15 + Math.random() * 35, // 15-50 μg/m³
      no2: 10 + Math.random() * 40, // 10-50 ppb
      o3: 20 + Math.random() * 60, // 20-80 ppb
    };
  }

  generateWasteMetrics(): WasteMetrics {
    return {
      collectionEfficiency: 80 + Math.random() * 15, // 80-95%
      binFillLevel: 60 + Math.random() * 30, // 60-90%
      trucksActive: Math.floor(10 + Math.random() * 20), // 10-30 trucks
      routesOptimized: Math.floor(15 + Math.random() * 25), // 15-40 routes
    };
  }

  generateEnergyMetrics(): EnergyMetrics {
    return {
      consumption: 800 + Math.random() * 400, // 800-1200 MW
      efficiency: 75 + Math.random() * 20, // 75-95%
      renewablePercentage: 20 + Math.random() * 60, // 20-80%
      gridStability: 85 + Math.random() * 14, // 85-99%
    };
  }

  generateCityData(cityId: string): SmartCityData {
    return {
      id: cityId,
      timestamp: new Date(),
      cityId,
      metrics: {
        traffic: this.generateTrafficMetrics(),
        pollution: this.generatePollutionMetrics(),
        waste: this.generateWasteMetrics(),
        energy: this.generateEnergyMetrics(),
      },
    };
  }

  updateData(existingData: SmartCityData): SmartCityData {
    // Smooth updates with realistic variations
    const variation = 0.1; // 10% max variation

    return {
      ...existingData,
      timestamp: new Date(),
      metrics: {
        traffic: {
          ...existingData.metrics.traffic,
          flowRate: Math.max(0, Math.min(100, 
            existingData.metrics.traffic.flowRate + (Math.random() - 0.5) * variation * 20
          )),
          congestionLevel: Math.max(0, Math.min(100,
            existingData.metrics.traffic.congestionLevel + (Math.random() - 0.5) * variation * 10
          )),
        },
        pollution: {
          ...existingData.metrics.pollution,
          airQualityIndex: Math.max(0, Math.min(500,
            existingData.metrics.pollution.airQualityIndex + (Math.random() - 0.5) * variation * 20
          )),
        },
        waste: {
          ...existingData.metrics.waste,
          binFillLevel: Math.max(0, Math.min(100,
            existingData.metrics.waste.binFillLevel + (Math.random() - 0.5) * variation * 10
          )),
        },
        energy: {
          ...existingData.metrics.energy,
          consumption: Math.max(0,
            existingData.metrics.energy.consumption + (Math.random() - 0.5) * variation * 100
          ),
        },
      },
    };
  }

  startSimulation(cityId: string, callback: (data: SmartCityData) => void, interval = 5000): () => void {
    // Initial data
    callback(this.generateCityData(cityId));

    // Periodic updates
    this.updateInterval = setInterval(() => {
      callback(this.generateCityData(cityId));
    }, interval);

    return () => {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    };
  }
}
```

## Development Commands

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## Performance Optimization

### 1. Next.js Configuration

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
          name: 'three',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;
```

### 2. Performance Monitoring

Create `app/lib/hooks/usePerformanceMonitor.ts`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';

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
```

## Next Steps

1. **Implement Hero Section**: Create the 3D city visualization component
2. **Build Globe Component**: Add interactive global data visualization
3. **Develop Feature Sections**: Create problem-solution visualization components
4. **Create Dashboard**: Build the live command dashboard mockup
5. **Add Animations**: Implement smooth scroll animations and transitions
6. **Optimize Performance**: Fine-tune 3D performance and loading
7. **Test Responsiveness**: Ensure mobile fallbacks work correctly
8. **Deploy**: Prepare for production deployment

## Troubleshooting

### Common Issues

1. **Three.js Performance**: Reduce polygon count or use LOD for complex models
2. **Memory Leaks**: Properly dispose of Three.js objects and event listeners
3. **Mobile Performance**: Implement proper fallbacks and reduce animation complexity
4. **Build Errors**: Check TypeScript types and ensure all dependencies are installed

### Debug Tools

- React DevTools for component debugging
- Three.js DevTools for 3D scene inspection
- Chrome DevTools Performance tab for profiling
- Lighthouse for performance auditing

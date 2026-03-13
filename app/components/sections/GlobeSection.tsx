"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { CityLocation, GlobeState } from "../../types";
import { CityDataGenerator } from "../../lib/utils/cityGenerator";
import Button from "../ui/Button";
import { ScrollAnimation } from "../ui";

// Lazy load the globe components
const GlobeVisualization = lazy(() => 
  import("../../../components/globe/GlobeVisualization")
);
const CityMarkers = lazy(() => 
  import("../../../components/globe/CityMarkers")
);

interface GlobeSectionProps {
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

// Loading fallback for globe
function GlobeFallback() {
  return (
    <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden glass border border-white/10 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mx-auto"></div>
        <div className="text-neon-blue">Loading Global Smart Cities...</div>
        <div className="text-sm text-gray-400">Connecting to cities worldwide</div>
      </div>
    </div>
  );
}

// Control panel for globe interaction
function GlobeControls({
  isRotating,
  onToggleRotation,
  selectedRegion,
  onRegionChange,
  zoom,
  onZoomChange,
}: {
  isRotating: boolean;
  onToggleRotation: () => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}) {
  const regions = [
    { id: "all", name: "All Cities", count: 24 },
    { id: "northAmerica", name: "North America", count: 6 },
    { id: "europe", name: "Europe", count: 5 },
    { id: "asia", name: "Asia", count: 7 },
    { id: "southAmerica", name: "South America", count: 3 },
    { id: "africa", name: "Africa", count: 2 },
    { id: "oceania", name: "Oceania", count: 1 },
  ];

  return (
    <div className="absolute top-4 left-4 p-4 glass rounded-lg border border-white/10 min-w-[200px]">
      <div className="space-y-4">
        <div className="text-xs font-bold text-neon-blue mb-2">Globe Controls</div>
        
        {/* Rotation Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Auto-Rotation</span>
          <button
            onClick={onToggleRotation}
            className={`w-12 h-6 rounded-full transition-colors ${
              isRotating ? "bg-neon-blue" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                isRotating ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="space-y-2">
          <span className="text-xs text-gray-400">Zoom Level</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              className="w-8 h-8 bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg flex items-center justify-center text-neon-blue"
            >
              -
            </button>
            <div className="flex-1 h-2 bg-gray-700 rounded-lg relative">
              <div
                className="absolute h-full bg-neon-blue rounded-lg"
                style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }}
              />
            </div>
            <button
              onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
              className="w-8 h-8 bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg flex items-center justify-center text-neon-blue"
            >
              +
            </button>
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <span className="text-xs text-gray-400">Filter by Region</span>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => onRegionChange(region.id)}
                className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                  selectedRegion === region.id
                    ? "bg-neon-blue/20 text-neon-blue"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {region.name} ({region.count})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// City detail panel
function CityDetailPanel({ city, onClose }: { city: CityLocation; onClose: () => void }) {
  const metrics = city.metrics.metrics;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="absolute top-4 right-4 w-80 p-4 glass rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-neon-blue">City Details</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* City Info */}
        <div className="border-b border-white/10 pb-3">
          <div className="font-bold text-white">{city.name}</div>
          <div className="text-xs text-gray-400">{city.country}</div>
          <div className="text-xs text-gray-400">
            Population: {city.population.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              city.status === "active" ? "bg-neon-green" : "bg-yellow-500"
            }`} />
            <span className="text-xs text-gray-300">
              {city.status === "active" ? "Active" : "Planned"}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-neon-blue">Performance Metrics</div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full opacity-50"></div>
                <span className="text-xs text-gray-400">Traffic Flow</span>
              </div>
              <div className="text-lg font-bold text-neon-blue">
                {Math.round(metrics.traffic.flowRate)}%
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-neon-blue rounded-full"
                  style={{ width: `${metrics.traffic.flowRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full opacity-50"></div>
                <span className="text-xs text-gray-400">Energy</span>
              </div>
              <div className="text-lg font-bold text-neon-green">
                {Math.round(metrics.energy.efficiency)}%
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-neon-green rounded-full"
                  style={{ width: `${metrics.energy.efficiency}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-purple rounded-full opacity-50"></div>
                <span className="text-xs text-gray-400">Air Quality</span>
              </div>
              <div className="text-lg font-bold text-neon-purple">
                {Math.round(metrics.pollution.airQualityIndex)}
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-neon-purple rounded-full"
                  style={{ width: `${Math.min(100, (100 - metrics.pollution.airQualityIndex) / 2)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full opacity-50"></div>
                <span className="text-xs text-gray-400">Waste</span>
              </div>
              <div className="text-lg font-bold text-yellow-500">
                {Math.round(metrics.waste.collectionEfficiency)}%
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${metrics.waste.collectionEfficiency}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Date */}
        <div className="text-xs text-gray-500 border-t border-white/10 pt-3">
          Implemented: {city.implementationDate.toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}

export default function GlobeSection({
  title = "Global Smart City Network",
  subtitle = "Explore our worldwide network of intelligent cities transforming urban living through AI-powered management systems",
  showControls = true,
  autoRotate = true,
  className = "",
}: GlobeSectionProps) {
  const [cities, setCities] = useState<CityLocation[]>([]);
  const [globeState, setGlobeState] = useState<GlobeState | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityLocation | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Generate initial city data
    const generator = new CityDataGenerator();
    const generatedCities = generator.generateGlobalCities();
    setCities(generatedCities);
    
    const generatedGlobeState = generator.generateGlobeState(generatedCities);
    setGlobeState(generatedGlobeState);

    // Update data every 10 seconds for real-time feel
    const interval = setInterval(() => {
      const updatedCities = generator.updateCityData(generatedCities);
      setCities(updatedCities);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCityClick = (city: CityLocation) => {
    setSelectedCity(city);
  };

  const handleCityHover = (city: CityLocation | null) => {
    setHoveredCity(city);
  };

  const handleToggleRotation = () => {
    setIsRotating(!isRotating);
    if (globeState) {
      setGlobeState({ ...globeState, isRotating: !isRotating });
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // Filter cities by region logic would go here
  };

  if (!globeState) {
    return <GlobeFallback />;
  }

  return (
    <section className={`relative py-20 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollAnimation animation="fade" direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex mb-4">
              <div className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                <span className="text-neon-blue text-sm font-medium">
                  🌍 Global Network
                </span>
              </div>
            </div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">{title}</span>
            </motion.h2>

            <motion.p 
              className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {subtitle}
            </motion.p>

            {/* Key Stats */}
            <ScrollAnimation animation="slide" direction="up" delay={0.6}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-blue mb-2">
                    {cities.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-green mb-2">
                    {cities.filter(c => c.status === "active").length}
                  </div>
                  <div className="text-sm text-gray-400">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-purple mb-2">
                    {Math.round(cities.reduce((sum, city) => sum + city.population, 0) / 1000000)}M
                  </div>
                  <div className="text-sm text-gray-400">Population</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-500 mb-2">
                    6
                  </div>
                  <div className="text-sm text-gray-400">Continents</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>

        {/* Globe Visualization */}
        <ScrollAnimation animation="fade" direction="up" delay={0.8}>
          <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden glass border border-white/10">
            <Suspense fallback={<GlobeFallback />}>
              <GlobeVisualization
                globeState={globeState}
                onCityClick={(cityId) => {
                  const city = cities.find(c => c.id === cityId);
                  if (city) handleCityClick(city);
                }}
                onCityHover={(cityId) => {
                  const city = cityId ? cities.find(c => c.id === cityId) : null;
                  handleCityHover(city || null);
                }}
                autoRotate={isRotating}
                zoom={zoom}
              />
              
              <CityMarkers
                cities={cities}
                markers={globeState.markers}
                onCityClick={handleCityClick}
                onCityHover={handleCityHover}
                selectedCity={selectedCity}
                hoveredCity={hoveredCity}
              />
            </Suspense>

            {/* Controls */}
            {showControls && (
              <GlobeControls
                isRotating={isRotating}
                onToggleRotation={handleToggleRotation}
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            )}

            {/* City Detail Panel */}
            {selectedCity && (
              <CityDetailPanel
                city={selectedCity}
                onClose={() => setSelectedCity(null)}
              />
            )}
          </div>
        </ScrollAnimation>

        {/* Call to Action */}
        <ScrollAnimation animation="slide" direction="up" delay={1}>
          <div className="text-center mt-16">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Join the Global Smart City Revolution
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how cities around the world are transforming urban living with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Explore Cities
                </Button>
                <Button variant="outline" size="lg">
                  Request Demo
                </Button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

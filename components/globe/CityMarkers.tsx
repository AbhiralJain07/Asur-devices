"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CityLocation, CityMarker } from "../../app/types";

interface CityMarkersProps {
  cities: CityLocation[];
  markers: CityMarker[];
  onCityClick?: (city: CityLocation) => void;
  onCityHover?: (city: CityLocation | null) => void;
  selectedCity?: CityLocation | null;
  hoveredCity?: CityLocation | null;
  showTooltips?: boolean;
  className?: string;
}

interface CityTooltipProps {
  city: CityLocation;
  position: { x: number; y: number };
  isVisible: boolean;
}

// Enhanced city tooltip component
function CityTooltip({ city, position, isVisible }: CityTooltipProps) {
  const trafficFlow = Math.round(city.metrics.metrics.traffic.flowRate);
  const energyEfficiency = Math.round(city.metrics.metrics.energy.efficiency);
  const airQuality = Math.round(city.metrics.metrics.pollution.airQualityIndex);
  const wasteEfficiency = Math.round(city.metrics.metrics.waste.collectionEfficiency);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 p-4 glass rounded-lg border border-neon-blue/30 min-w-[200px]"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="space-y-3">
            {/* City Header */}
            <div className="border-b border-white/10 pb-2">
              <div className="font-bold text-neon-blue text-sm">
                {city.name}, {city.country}
              </div>
              <div className="text-xs text-gray-400">
                Population: {city.population.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  city.status === "active" ? "bg-neon-green" : "bg-yellow-500"
                }`} />
                <span className="text-xs text-gray-300">
                  {city.status === "active" ? "Active" : "Planned"}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-blue rounded-full opacity-50"></div>
                  <span className="text-xs text-gray-400">Traffic</span>
                </div>
                <div className="text-lg font-bold text-neon-blue">
                  {trafficFlow}%
                </div>
                <div className="text-xs text-gray-500">
                  {trafficFlow > 80 ? "Excellent" : trafficFlow > 60 ? "Good" : "Needs Work"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-green rounded-full opacity-50"></div>
                  <span className="text-xs text-gray-400">Energy</span>
                </div>
                <div className="text-lg font-bold text-neon-green">
                  {energyEfficiency}%
                </div>
                <div className="text-xs text-gray-500">
                  {energyEfficiency > 85 ? "Optimal" : energyEfficiency > 70 ? "Good" : "Improving"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-purple rounded-full opacity-50"></div>
                  <span className="text-xs text-gray-400">Air Quality</span>
                </div>
                <div className="text-lg font-bold text-neon-purple">
                  {airQuality}
                </div>
                <div className="text-xs text-gray-500">
                  {airQuality < 50 ? "Excellent" : airQuality < 100 ? "Good" : "Moderate"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50"></div>
                  <span className="text-xs text-gray-400">Waste</span>
                </div>
                <div className="text-lg font-bold text-yellow-500">
                  {wasteEfficiency}%
                </div>
                <div className="text-xs text-gray-500">
                  {wasteEfficiency > 90 ? "Excellent" : wasteEfficiency > 80 ? "Good" : "Fair"}
                </div>
              </div>
            </div>

            {/* Implementation Date */}
            <div className="text-xs text-gray-500 border-t border-white/10 pt-2">
              Implemented: {city.implementationDate.toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// City legend component
function CityLegend() {
  return (
    <div className="absolute bottom-4 left-4 p-3 glass rounded-lg border border-white/10">
      <div className="space-y-2">
        <div className="text-xs font-bold text-neon-blue mb-2">City Status</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
          <span className="text-xs text-gray-300">Active Smart City</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-gray-300">Planned Implementation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <span className="text-xs text-gray-300">Inactive</span>
        </div>
      </div>
    </div>
  );
}

// City stats panel
function CityStatsPanel({ cities, selectedCity }: { 
  cities: CityLocation[]; 
  selectedCity?: CityLocation | null; 
}) {
  const activeCities = cities.filter(city => city.status === "active").length;
  const totalPopulation = cities.reduce((sum, city) => sum + city.population, 0);
  const avgTrafficFlow = Math.round(
    cities.reduce((sum, city) => sum + city.metrics.metrics.traffic.flowRate, 0) / cities.length
  );

  return (
    <div className="absolute top-4 right-4 p-4 glass rounded-lg border border-white/10 min-w-[200px]">
      <div className="space-y-3">
        <div className="text-xs font-bold text-neon-blue mb-2">Global Overview</div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Total Cities</span>
            <span className="text-sm font-bold text-neon-blue">{cities.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Active</span>
            <span className="text-sm font-bold text-neon-green">{activeCities}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Population Served</span>
            <span className="text-sm font-bold text-neon-purple">
              {(totalPopulation / 1000000).toFixed(1)}M
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Avg Traffic Flow</span>
            <span className="text-sm font-bold text-yellow-500">{avgTrafficFlow}%</span>
          </div>
        </div>

        {selectedCity && (
          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="text-xs font-bold text-neon-blue mb-2">Selected City</div>
            <div className="text-sm text-white font-medium">{selectedCity.name}</div>
            <div className="text-xs text-gray-400">{selectedCity.country}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CityMarkers({
  cities,
  markers,
  onCityClick,
  onCityHover,
  selectedCity,
  hoveredCity,
  showTooltips = true,
  className = "",
}: CityMarkersProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCityClick = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      onCityClick?.(city);
    }
  };

  const handleCityHover = (cityId: string | null) => {
    const city = cityId ? cities.find(c => c.id === cityId) : null;
    onCityHover?.(city || null);
    setShowTooltip(!!city);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* This component is primarily for UI overlays */}
      {/* The actual 3D markers are rendered in GlobeVisualization */}
      
      {/* Tooltip */}
      {showTooltips && hoveredCity && (
        <CityTooltip
          city={hoveredCity}
          position={tooltipPosition}
          isVisible={showTooltip}
        />
      )}

      {/* Legend */}
      <CityLegend />

      {/* Stats Panel */}
      <CityStatsPanel cities={cities} selectedCity={selectedCity} />

      {/* Selected City Highlight */}
      {selectedCity && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 p-3 glass rounded-lg border border-neon-blue/30"
        >
          <div className="text-center">
            <div className="text-sm font-bold text-neon-blue">
              {selectedCity.name}, {selectedCity.country}
            </div>
            <div className="text-xs text-gray-400">
              Click on other cities to explore
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

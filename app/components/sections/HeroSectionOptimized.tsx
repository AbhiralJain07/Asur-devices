"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SmartCityData } from "../../app/types";
import { SmartCityDataGenerator } from "../../app/lib/utils/dataGenerator";
import Button from "../ui/Button";
import { ScrollAnimation } from "../ui";

// Lazy load the 3D visualization component
const CityVisualization = lazy(() => 
  import("../../../components/city-visualization/CityVisualization").then(module => ({
    default: module.CityVisualization
  }))
);

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  callToAction?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  visualization?: {
    type: "city" | "globe" | "3d-scene";
    props: any;
  };
  scrollIndicator?: boolean;
}

// Loading fallback for 3D visualization
function VisualizationFallback() {
  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden glass border border-white/10 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mx-auto"></div>
        <div className="text-neon-blue">Loading 3D City Visualization...</div>
        <div className="text-sm text-gray-400">Preparing your smart city experience</div>
      </div>
    </div>
  );
}

export default function HeroSection({
  title = "Transform Your City with AI",
  subtitle = "Experience the future of urban management with our intelligent command center platform. Real-time analytics, predictive insights, and automated decision-making for smarter cities.",
  callToAction = {
    text: "Schedule a Personalized Demo",
    href: "#demo",
  },
  scrollIndicator = true,
}: HeroSectionProps) {
  const [cityData, setCityData] = useState<SmartCityData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isVisualizationLoaded, setIsVisualizationLoaded] = useState(false);

  useEffect(() => {
    // Generate initial city data
    const generator = new SmartCityDataGenerator();
    const initialData = generator.generateCityData("demo-city");
    setCityData(initialData);

    // Update data every 5 seconds for real-time feel
    const interval = setInterval(() => {
      const updatedData = generator.updateData(initialData);
      setCityData(updatedData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
  };

  const handleDemoClick = () => {
    // Handle demo scheduling
    console.log("Demo requested");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDemoClick();
    }
  };

  const handleLearnMoreKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      document.getElementById("features")?.scrollIntoView();
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisualizationLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("visualization-container");
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-neon-blue">Loading...</div>
      </div>
    );
  }

  return (
    <section 
      className="relative min-h-screen overflow-hidden"
      aria-label="Smart City Command Center Hero Section"
      role="banner"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-grid-pattern" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <ScrollAnimation animation="slide" direction="up">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex">
                <div className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                  <span className="text-neon-blue text-sm font-medium">
                    🚀 Trusted by 50+ Cities Worldwide
                  </span>
                </div>
              </div>

              {/* Title */}
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="gradient-text">{title}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>

              {/* Key Benefits */}
              <ScrollAnimation animation="slide" direction="up" delay={0.5}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                    <span className="text-gray-300">Reduce traffic congestion by up to 35%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <span className="text-gray-300">Improve air quality by 25% with AI monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                    <span className="text-gray-300">Save $2M+ annually through smart optimization</span>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Stats */}
              <ScrollAnimation animation="slide" direction="up" delay={0.6}>
                <div className="grid grid-cols-3 gap-4 sm:gap-8 py-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-blue mb-2">
                      {Math.round(cityData.metrics.traffic.flowRate)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Traffic Flow</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-green mb-2">
                      {Math.round(cityData.metrics.energy.efficiency)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Energy Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-neon-purple mb-2">
                      {Math.round(cityData.metrics.pollution.airQualityIndex)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Air Quality</div>
                  </div>
                </div>
              </ScrollAnimation>

              {/* Call to Action */}
              <ScrollAnimation animation="slide" direction="up" delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleDemoClick}
                    onKeyDown={handleKeyDown}
                    aria-label="Schedule a personalized demo with smart city specialist"
                  >
                    {callToAction.text}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => document.getElementById("features")?.scrollIntoView()}
                    onKeyDown={handleLearnMoreKeyDown}
                    aria-label="Learn more about smart city features"
                  >
                    Learn More
                  </Button>
                </div>
              </ScrollAnimation>

              {/* Selected district info */}
              {selectedDistrict && (
                <motion.div
                  className="p-4 glass rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-neon-blue">
                    Selected: {selectedDistrict}
                  </p>
                  <p className="text-xs text-gray-400">
                    Click on buildings to explore district data
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollAnimation>

          {/* Right side - 3D Visualization with lazy loading */}
          <ScrollAnimation animation="fade" delay={0.4}>
            <div id="visualization-container" className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden glass border border-white/10">
              {isVisualizationLoaded ? (
                <Suspense fallback={<VisualizationFallback />}>
                  <CityVisualization
                    cityData={cityData}
                    cameraPosition={{ x: 20, y: 15, z: 20 }}
                    autoRotate={true}
                    onDistrictClick={handleDistrictClick}
                  />
                </Suspense>
              ) : (
                <VisualizationFallback />
              )}
              
              {/* Overlay controls */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="px-2 sm:px-3 py-1 bg-background-secondary/80 backdrop-blur-sm rounded-lg text-xs text-neon-blue">
                  Live Data
                </div>
                <div className="px-2 sm:px-3 py-1 bg-background-secondary/80 backdrop-blur-sm rounded-lg text-xs text-neon-green">
                  60 FPS
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Scroll indicator */}
      {scrollIndicator && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-neon-blue/30 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1 h-3 bg-neon-blue rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

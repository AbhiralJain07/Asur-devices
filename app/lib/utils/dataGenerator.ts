import { SmartCityData, TrafficMetrics, PollutionMetrics, WasteMetrics, EnergyMetrics } from "../../types";

export class SmartCityDataGenerator {
  private updateInterval: NodeJS.Timeout | null = null;

  generateTrafficMetrics(): TrafficMetrics {
    return {
      flowRate: 70 + Math.random() * 25, // 70-95%
      congestionLevel: Math.random() * 30, // 0-30%
      averageSpeed: 30 + Math.random() * 40, // 30-70 km/h
      incidents: Math.random() > 0.8 ? [{
        id: `incident-${Date.now()}`,
        type: ["accident", "construction", "weather"][Math.floor(Math.random() * 3)] as any,
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
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

  stopSimulation(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

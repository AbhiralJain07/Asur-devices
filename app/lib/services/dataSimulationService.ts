import { SmartCityData } from "../../types";
import { SmartCityDataGenerator } from "../utils/dataGenerator";

export interface DataSimulationService {
  startSimulation(cityId: string): void;
  stopSimulation(cityId: string): void;
  updateData(cityId: string): SmartCityData;
  subscribeToUpdates(cityId: string, callback: (data: SmartCityData) => void): () => void;
  getHistoricalData(cityId: string, timeRange: TimeRange): SmartCityData[];
}

export type TimeRange = "1h" | "6h" | "24h" | "7d";

export class DataSimulationServiceImpl implements DataSimulationService {
  private generator = new SmartCityDataGenerator();
  private simulations = new Map<string, () => void>();
  private subscribers = new Map<string, ((data: SmartCityData) => void)[]>();
  private historicalData = new Map<string, SmartCityData[]>();
  private currentData = new Map<string, SmartCityData>();

  startSimulation(cityId: string): void {
    // Stop existing simulation if running
    this.stopSimulation(cityId);

    // Start new simulation
    const unsubscribe = this.generator.startSimulation(
      cityId,
      (data: SmartCityData) => {
        this.currentData.set(cityId, data);
        
        // Store in historical data (keep last 100 data points)
        const history = this.historicalData.get(cityId) || [];
        history.push(data);
        if (history.length > 100) {
          history.shift();
        }
        this.historicalData.set(cityId, history);

        // Notify subscribers
        const citySubscribers = this.subscribers.get(cityId) || [];
        citySubscribers.forEach(callback => callback(data));
      },
      5000 // Update every 5 seconds
    );

    // Store the unsubscribe function
    this.simulations.set(cityId, unsubscribe);
  }

  stopSimulation(cityId: string): void {
    const unsubscribe = this.simulations.get(cityId);
    if (unsubscribe) {
      unsubscribe();
      this.simulations.delete(cityId);
    }
  }

  updateData(cityId: string): SmartCityData {
    const current = this.currentData.get(cityId);
    const newData = current ? this.generator.updateData(current) : this.generator.generateCityData(cityId);
    
    this.currentData.set(cityId, newData);
    
    // Update subscribers
    const citySubscribers = this.subscribers.get(cityId) || [];
    citySubscribers.forEach(callback => callback(newData));
    
    return newData;
  }

  subscribeToUpdates(cityId: string, callback: (data: SmartCityData) => void): () => void {
    const citySubscribers = this.subscribers.get(cityId) || [];
    citySubscribers.push(callback);
    this.subscribers.set(cityId, citySubscribers);

    // Send current data immediately if available
    const currentData = this.currentData.get(cityId);
    if (currentData) {
      callback(currentData);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(cityId) || [];
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
        this.subscribers.set(cityId, subscribers);
      }
    };
  }

  getHistoricalData(cityId: string, timeRange: TimeRange): SmartCityData[] {
    const history = this.historicalData.get(cityId) || [];
    const now = new Date();
    
    // Calculate time range in milliseconds
    const timeRangeMs = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    }[timeRange];

    // Filter data within time range
    const cutoffTime = new Date(now.getTime() - timeRangeMs);
    return history.filter(data => data.timestamp >= cutoffTime);
  }

  // Utility methods
  getAllCurrentData(): Map<string, SmartCityData> {
    return new Map(this.currentData);
  }

  getActiveSimulations(): string[] {
    return Array.from(this.simulations.keys());
  }

  stopAllSimulations(): void {
    Array.from(this.simulations.keys()).forEach(cityId => {
      this.stopSimulation(cityId);
    });
  }
}

// Singleton instance
export const dataSimulationService = new DataSimulationServiceImpl();

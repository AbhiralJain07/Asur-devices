import { CityLocation, CityMarker, GlobeState } from "../../types";
import { SmartCityDataGenerator } from "./dataGenerator";

export interface CityDataGeneratorConfig {
  totalCities: number;
  activeCities: number;
  regions: {
    northAmerica: number;
    europe: number;
    asia: number;
    southAmerica: number;
    africa: number;
    oceania: number;
  };
}

export class CityDataGenerator {
  private smartCityGenerator = new SmartCityDataGenerator();
  private config: CityDataGeneratorConfig = {
    totalCities: 24,
    activeCities: 18,
    regions: {
      northAmerica: 6,
      europe: 5,
      asia: 7,
      southAmerica: 3,
      africa: 2,
      oceania: 1,
    },
  };

  private cityDatabase: Partial<CityLocation>[] = [
    // North America
    { name: "New York", country: "USA", coordinates: { lat: 40.7128, lng: -74.0060 }, population: 8336817 },
    { name: "San Francisco", country: "USA", coordinates: { lat: 37.7749, lng: -122.4194 }, population: 873965 },
    { name: "Toronto", country: "Canada", coordinates: { lat: 43.6532, lng: -79.3832 }, population: 2930000 },
    { name: "Mexico City", country: "Mexico", coordinates: { lat: 19.4326, lng: -99.1332 }, population: 9210000 },
    { name: "Chicago", country: "USA", coordinates: { lat: 41.8781, lng: -87.6298 }, population: 2693976 },
    { name: "Vancouver", country: "Canada", coordinates: { lat: 49.2827, lng: -123.1207 }, population: 675218 },
    
    // Europe
    { name: "London", country: "UK", coordinates: { lat: 51.5074, lng: -0.1278 }, population: 9648110 },
    { name: "Paris", country: "France", coordinates: { lat: 48.8566, lng: 2.3522 }, population: 2161000 },
    { name: "Berlin", country: "Germany", coordinates: { lat: 52.5200, lng: 13.4050 }, population: 3669491 },
    { name: "Amsterdam", country: "Netherlands", coordinates: { lat: 52.3676, lng: 4.9041 }, population: 872680 },
    { name: "Barcelona", country: "Spain", coordinates: { lat: 41.3851, lng: 2.1734 }, population: 1620343 },
    
    // Asia
    { name: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 }, population: 13960000 },
    { name: "Singapore", country: "Singapore", coordinates: { lat: 1.3521, lng: 103.8198 }, population: 5850342 },
    { name: "Dubai", country: "UAE", coordinates: { lat: 25.2048, lng: 55.2708 }, population: 3331000 },
    { name: "Seoul", country: "South Korea", coordinates: { lat: 37.5665, lng: 126.9780 }, population: 9720000 },
    { name: "Mumbai", country: "India", coordinates: { lat: 19.0760, lng: 72.8777 }, population: 20411000 },
    { name: "Shanghai", country: "China", coordinates: { lat: 31.2304, lng: 121.4737 }, population: 26317000 },
    { name: "Bangkok", country: "Thailand", coordinates: { lat: 13.7563, lng: 100.5018 }, population: 10462000 },
    
    // South America
    { name: "São Paulo", country: "Brazil", coordinates: { lat: -23.5505, lng: -46.6333 }, population: 12330000 },
    { name: "Buenos Aires", country: "Argentina", coordinates: { lat: -34.6118, lng: -58.3960 }, population: 3080000 },
    { name: "Santiago", country: "Chile", coordinates: { lat: -33.4489, lng: -70.6693 }, population: 6820000 },
    
    // Africa
    { name: "Cape Town", country: "South Africa", coordinates: { lat: -33.9249, lng: 18.4241 }, population: 4790000 },
    { name: "Cairo", country: "Egypt", coordinates: { lat: 30.0444, lng: 31.2357 }, population: 20900000 },
    
    // Oceania
    { name: "Sydney", country: "Australia", coordinates: { lat: -33.8688, lng: 151.2093 }, population: 5312000 },
  ];

  generateGlobalCities(): CityLocation[] {
    const cities: CityLocation[] = [];
    
    this.cityDatabase.forEach((cityData, index) => {
      const isActive = index < this.config.activeCities;
      const implementationDate = new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3 // 0-3 years ago
      );
      
      const city: CityLocation = {
        id: `city-${index + 1}`,
        name: cityData.name!,
        country: cityData.country!,
        coordinates: cityData.coordinates!,
        population: cityData.population!,
        implementationDate,
        status: isActive ? "active" : "planned",
        metrics: this.smartCityGenerator.generateCityData(`city-${index + 1}`),
      };
      
      cities.push(city);
    });
    
    return cities;
  }

  generateCityMarkers(cities: CityLocation[]): CityMarker[] {
    return cities.map(city => {
      // Convert lat/lng to 3D sphere coordinates
      const phi = (90 - city.coordinates.lat) * (Math.PI / 180);
      const theta = (city.coordinates.lng + 180) * (Math.PI / 180);
      
      const radius = 10; // Globe radius
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return {
        cityId: city.id,
        position: { x, y, z },
        isActive: city.status === "active",
        data: city.metrics,
      };
    });
  }

  generateGlobeState(cities: CityLocation[]): GlobeState {
    const markers = this.generateCityMarkers(cities);
    
    return {
      isRotating: true,
      rotationSpeed: 0.002,
      zoom: 1,
      markers,
    };
  }

  updateCityData(cities: CityLocation[]): CityLocation[] {
    return cities.map(city => ({
      ...city,
      metrics: this.smartCityGenerator.updateData(city.metrics),
    }));
  }

  getCityById(cities: CityLocation[], cityId: string): CityLocation | undefined {
    return cities.find(city => city.id === cityId);
  }

  getActiveCities(cities: CityLocation[]): CityLocation[] {
    return cities.filter(city => city.status === "active");
  }

  getCitiesByRegion(cities: CityLocation[]): Record<string, CityLocation[]> {
    const regions: Record<string, CityLocation[]> = {
      northAmerica: [],
      europe: [],
      asia: [],
      southAmerica: [],
      africa: [],
      oceania: [],
    };
    
    cities.forEach(city => {
      const country = city.country.toLowerCase();
      if (["usa", "canada", "mexico"].includes(country)) {
        regions.northAmerica.push(city);
      } else if (["uk", "france", "germany", "netherlands", "spain"].includes(country)) {
        regions.europe.push(city);
      } else if (["japan", "singapore", "uae", "south korea", "india", "china", "thailand"].includes(country)) {
        regions.asia.push(city);
      } else if (["brazil", "argentina", "chile"].includes(country)) {
        regions.southAmerica.push(city);
      } else if (["south africa", "egypt"].includes(country)) {
        regions.africa.push(city);
      } else if (["australia"].includes(country)) {
        regions.oceania.push(city);
      }
    });
    
    return regions;
  }

  generateCityTooltip(city: CityLocation): string {
    const trafficFlow = Math.round(city.metrics.metrics.traffic.flowRate);
    const energyEfficiency = Math.round(city.metrics.metrics.energy.efficiency);
    const airQuality = Math.round(city.metrics.metrics.pollution.airQualityIndex);
    
    return `
      <div class="text-sm">
        <div class="font-bold text-neon-blue">${city.name}, ${city.country}</div>
        <div class="text-gray-300">Population: ${city.population.toLocaleString()}</div>
        <div class="text-gray-300">Status: ${city.status === "active" ? "🟢 Active" : "🟡 Planned"}</div>
        <div class="mt-2 space-y-1">
          <div>🚦 Traffic: ${trafficFlow}%</div>
          <div>⚡ Energy: ${energyEfficiency}%</div>
          <div>🌬️ Air Quality: ${airQuality}</div>
        </div>
      </div>
    `;
  }
}

// City Location Types
import { SmartCityData } from "./smartCity";

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  implementationDate: Date;
  status: "planned" | "active" | "expanding";
  metrics: SmartCityData;
}

export interface CityMarker {
  cityId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  isActive: boolean;
  data: SmartCityData;
}

export interface GlobeState {
  isRotating: boolean;
  rotationSpeed: number;
  zoom: number;
  selectedCity?: CityLocation;
  hoveredCity?: CityLocation;
  markers: CityMarker[];
}

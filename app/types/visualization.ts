// Visualization Types
export interface VisualizationState {
  isLoading: boolean;
  isInteractive: boolean;
  performanceMode: "high" | "medium" | "low";
  activeSection: string;
  scrollProgress: number;
  animations: {
    isPlaying: boolean;
    currentAnimation: string;
    progress: number;
  };
}

export interface CityVisualizationState {
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  activeDistricts: string[];
  dataOverlay: "traffic" | "pollution" | "energy" | "none";
  isPaused: boolean;
}

export interface BaseVisualizationProps {
  id: string;
  className?: string;
  isLoading?: boolean;
  isInteractive?: boolean;
  performanceMode?: "high" | "medium" | "low";
  onDataUpdate?: (data: any) => void;
  onError?: (error: string) => void;
}

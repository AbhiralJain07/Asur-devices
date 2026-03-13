// Project constants
export const PROJECT_NAME = "Smart City Command Center";
export const PROJECT_VERSION = "1.0.0";

// Animation constants
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 1.0,
} as const;

// Performance constants
export const PERFORMANCE_TARGETS = {
  FPS: 60,
  INTERACTION_RESPONSE: 200, // ms
  PAGE_LOAD: 4000, // ms
} as const;

// Hardware baseline
export const HARDWARE_BASELINE = {
  GPU: "GTX 1660 / RX 580 equivalent",
  MEMORY: "8GB RAM",
  PROCESSOR: "Modern multi-core processor",
} as const;

// Color palette
export const COLORS = {
  NEON_BLUE: "#00D9FF",
  NEON_PURPLE: "#9D4EDD",
  NEON_GREEN: "#00FF88",
  NEON_PINK: "#FF006E",
  BG_PRIMARY: "#0A0A0F",
  BG_SECONDARY: "#1A1A2E",
  BG_TERTIARY: "#16213E",
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: "768px",
  TABLET: "1024px",
  DESKTOP: "1280px",
} as const;

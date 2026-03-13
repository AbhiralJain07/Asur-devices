// Environment configuration utilities
export const env = {
  // Performance settings
  PERFORMANCE_MONITORING: process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === "true",
  TARGET_FPS: parseInt(process.env.NEXT_PUBLIC_TARGET_FPS || "60"),
  HARDWARE_BASELINE: process.env.NEXT_PUBLIC_HARDWARE_BASELINE || "gtx1660",
  
  // Feature flags
  ENABLE_3D_VISUALIZATIONS: process.env.NEXT_PUBLIC_ENABLE_3D_VISUALIZATIONS === "true",
  ENABLE_ANIMATIONS: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS === "true",
  ENABLE_PERFORMANCE_OPTIMIZATIONS: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_OPTIMIZATIONS === "true",
  
  // API endpoints
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  
  // Analytics
  ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Development
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  SHOW_PERFORMANCE_OVERLAY: process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_OVERLAY === "true",
  
  // Build mode
  NODE_ENV: process.env.NODE_ENV,
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};

// Validation utilities
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required environment variables
  if (!env.TARGET_FPS || env.TARGET_FPS < 30 || env.TARGET_FPS > 120) {
    errors.push("TARGET_FPS must be between 30 and 120");
  }
  
  if (!env.HARDWARE_BASELINE) {
    errors.push("HARDWARE_BASELINE must be specified");
  }
  
  // Validate feature flags
  if (env.ENABLE_3D_VISUALIZATIONS && !env.ENABLE_PERFORMANCE_OPTIMIZATIONS) {
    errors.push("Performance optimizations should be enabled when 3D visualizations are active");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Runtime configuration
export function getRuntimeConfig() {
  const validation = validateEnvironment();
  
  if (!validation.isValid && env.DEBUG_MODE) {
    console.warn("Environment validation errors:", validation.errors);
  }
  
  return {
    performance: {
      monitoring: env.PERFORMANCE_MONITORING,
      targetFPS: env.TARGET_FPS,
      hardwareBaseline: env.HARDWARE_BASELINE,
      optimizations: env.ENABLE_PERFORMANCE_OPTIMIZATIONS,
    },
    features: {
      "3d": env.ENABLE_3D_VISUALIZATIONS,
      animations: env.ENABLE_ANIMATIONS,
      performanceOverlay: env.SHOW_PERFORMANCE_OVERLAY,
    },
    api: {
      baseUrl: env.API_BASE_URL,
      wsUrl: env.WS_URL,
    },
    development: {
      debug: env.DEBUG_MODE,
      isDev: env.IS_DEVELOPMENT,
      isProd: env.IS_PRODUCTION,
    },
  };
}

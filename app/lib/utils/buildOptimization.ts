import { env } from "../constants/env";

export interface BuildOptimizationConfig {
  compression: boolean;
  minification: boolean;
  treeshaking: boolean;
  codeSplitting: boolean;
  imageOptimization: boolean;
  bundleAnalysis: boolean;
}

export function getBuildOptimizationConfig(): BuildOptimizationConfig {
  const isProduction = env.IS_PRODUCTION;
  const isDevelopment = env.IS_DEVELOPMENT;
  
  return {
    compression: isProduction,
    minification: isProduction,
    treeshaking: true, // Always enabled for better performance
    codeSplitting: true, // Always enabled for better loading
    imageOptimization: true, // Always enabled
    bundleAnalysis: isDevelopment, // Only in development
  };
}

export function getPerformanceBudgets() {
  return {
    javascript: 250 * 1024, // 250KB
    css: 50 * 1024, // 50KB
    images: 500 * 1024, // 500KB
    fonts: 100 * 1024, // 100KB
    total: 1000 * 1024, // 1MB
  };
}

export function getOptimizationHints() {
  const config = getBuildOptimizationConfig();
  const budgets = getPerformanceBudgets();
  
  return {
    // Next.js specific optimizations
    next: {
      experimental: {
        optimizeCss: config.compression,
        optimizePackageImports: ["framer-motion", "three", "@react-three/fiber"],
        serverComponentsExternalPackages: ["three"],
      },
      images: {
        formats: ["image/webp", "image/avif"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      },
      webpack: (config: any) => {
        // Custom webpack optimizations
        config.optimization.splitChunks = {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "three",
              chunks: "all",
              priority: 10,
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              chunks: "all",
              priority: 10,
            },
          },
        };
        
        // Performance optimizations
        if (config.minimizer) {
          config.minimizer.forEach((minimizer: any) => {
            if (minimizer.constructor.name === "TerserPlugin") {
              minimizer.options.compress = {
                ...minimizer.options.compress,
                drop_console: env.IS_PRODUCTION,
                drop_debugger: env.IS_PRODUCTION,
              };
            }
          });
        }
        
        return config;
      },
    },
    
    // Performance budgets
    budgets,
    
    // Runtime optimizations
    runtime: {
      enableReactRefresh: env.IS_DEVELOPMENT,
      enableFastRefresh: env.IS_DEVELOPMENT,
      optimizeLoading: true,
      prefetchComponents: env.IS_PRODUCTION,
    },
  };
}

// Bundle analysis utilities
export function analyzeBundle(bundleStats: any) {
  const budgets = getPerformanceBudgets();
  const analysis = {
    totalSize: 0,
    bundles: [] as Array<{
      name: string;
      size: number;
      percentage: number;
      withinBudget: boolean;
    }>,
    warnings: [] as string[],
  };
  
  // Analyze each bundle
  Object.entries(bundleStats.assets || {}).forEach(([name, asset]: [string, any]) => {
    const size = asset.size || 0;
    const percentage = (size / budgets.total) * 100;
    
    analysis.bundles.push({
      name,
      size,
      percentage,
      withinBudget: size <= budgets.total,
    });
    
    analysis.totalSize += size;
  });
  
  // Check against budgets
  if (analysis.totalSize > budgets.total) {
    analysis.warnings.push(`Total bundle size ${Math.round(analysis.totalSize / 1024)}KB exceeds budget ${Math.round(budgets.total / 1024)}KB`);
  }
  
  // Sort bundles by size (largest first)
  analysis.bundles.sort((a, b) => b.size - a.size);
  
  return analysis;
}

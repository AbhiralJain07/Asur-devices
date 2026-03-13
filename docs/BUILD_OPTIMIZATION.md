# Build Optimization and Bundle Analysis

This document outlines the comprehensive build optimization and bundle analysis strategy for the Smart City Command Center, ensuring optimal performance, minimal bundle sizes, and efficient loading strategies.

## Build Optimization Strategy

### 1. Bundle Analysis and Optimization

#### Webpack Configuration Optimization
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Bundle analyzer
  webpack: (config, { isServer, dev }) => {
    // Add bundle analyzer in development
    if (!isServer && dev) {
      config.plugins.push(
        require('@next/bundle-analyzer')({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }

    // Production optimizations
    if (!dev && !isServer) {
      // Code splitting optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };

      // Minification optimizations
      config.optimization.minimize = true;
      config.optimization.minimizer.push(
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info'],
            },
            mangle: true,
            format: {
              comments: false,
            },
          },
        })
      );
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'self'; sandbox;",
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'three', 'react'],
    scrollRestoration: true,
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
        ],
      },
      {
        source: '/(.*).js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*).css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

#### Bundle Analysis Script
```typescript
// scripts/analyze-bundle.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

function analyzeBundle() {
  const analyzer = new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: path.resolve(__dirname, '../bundle-analysis/report.html'),
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: path.resolve(__dirname, '../bundle-analysis/stats.json'),
  });

  // Analyze the production build
  const config = require('../next.config.js');
  const webpackConfig = config.webpack(null, { isServer: false, dev: false });
  
  // Apply bundle analyzer plugin
  webpackConfig.plugins.push(analyzer);
  
  console.log('Bundle analysis complete!');
  console.log('Report available at: bundle-analysis/report.html');
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
```

### 2. Code Splitting Strategy

#### Route-Based Code Splitting
```typescript
// app/components/LazyComponents.tsx
import dynamic from 'next/dynamic';
import { LoadingSpinner } from './ui/LoadingSpinner';

// Heavy components loaded on demand
export const LazyGlobe = dynamic(
  () => import('./GlobeVisualization'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false // Client-side only for 3D components
  }
);

export const LazyAnalytics = dynamic(
  () => import('./AnalyticsSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const LazyTestimonials = dynamic(
  () => import('./TestimonialsSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true
  }
);

// Feature-based code splitting
export const LazyTechStack = dynamic(
  () => import('./TechnologyStackSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true
  }
);

export const LazyImpactMetrics = dynamic(
  () => import('./ImpactSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true
  }
);
```

#### Component-Level Code Splitting
```typescript
// app/components/CodeSplitProvider.tsx
import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface CodeSplitProviderProps {
  children: React.ReactNode;
}

export const CodeSplitProvider: React.FC<CodeSplitProviderProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// Lazy loading hooks
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    importFunc()
      .then(module => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err as Error);
        setLoading(false);
      });
  }, [importFunc]);

  return { Component, loading, error };
};
```

### 3. Asset Optimization

#### Image Optimization Pipeline
```typescript
// app/lib/image-optimizer.ts
export class ImageOptimizer {
  private static readonly SUPPORTED_FORMATS = ['webp', 'avif', 'jpg', 'png'];
  private static readonly QUALITY_LEVELS = {
    thumbnail: 30,
    small: 60,
    medium: 75,
    large: 85,
    original: 90
  };

  static async optimizeImage(
    imageFile: File,
    quality: keyof typeof ImageOptimizer.QUALITY_LEVELS = 'medium'
  ): Promise<{
    optimized: Blob;
    original: Blob;
    compression: number;
    format: string;
  }> {
    const original = imageFile.slice();
    
    // Convert to WebP if supported
    const webpBlob = await this.convertToWebP(imageFile, quality);
    
    // Calculate compression ratio
    const originalSize = original.size;
    const optimizedSize = webpBlob.size;
    const compression = ((originalSize - optimizedSize) / originalSize) * 100;
    
    return {
      optimized: webpBlob,
      original,
      compression,
      format: 'webp'
    };
  }

  private static async convertToWebP(
    file: File,
    quality: keyof typeof ImageOptimizer.QUALITY_LEVELS
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert to WebP'));
              }
            },
            'image/webp',
            ImageOptimizer.QUALITY_LEVELS[quality] / 100
          );
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static generateResponsiveSrcSet(
    baseUrl: string,
    sizes: number[]
  ): string {
    return sizes
      .map(size => `${baseUrl}?w=${size}&f=webp ${size}w`)
      .join(', ');
  }

  static generateOptimizedImageUrl(
    baseUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: keyof typeof ImageOptimizer.QUALITY_LEVELS;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): string {
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', ImageOptimizer.QUALITY_LEVELS[options.quality].toString());
    if (options.format) params.set('f', options.format);
    
    const paramString = params.toString();
    return paramString ? `${baseUrl}?${paramString}` : baseUrl;
  }
}
```

#### Font Optimization
```typescript
// app/lib/font-optimizer.ts
export class FontOptimizer {
  private static readonly FONT_DISPLAY = 'swap';
  private static readonly PRELOAD_FONTS = [
    'Inter',
    'Inter-Bold',
    'Inter-SemiBold'
  ];

  static preloadCriticalFonts(): void {
    if (typeof document === 'undefined') return;

    this.PRELOAD_FONTS.forEach(fontName => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `/fonts/${fontName}.woff2`;
      document.head.appendChild(link);
    });
  }

  static generateFontFaceCSS(): string {
    return `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: ${this.FONT_DISPLAY};
        src: url('/fonts/Inter-Regular.woff2') format('woff2'),
             url('/fonts/Inter-Regular.woff') format('woff');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-display: ${this.FONT_DISPLAY};
        src: url('/fonts/Inter-SemiBold.woff2') format('woff2'),
             url('/fonts/Inter-SemiBold.woff') format('woff');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-display: ${this.FONT_DISPLAY};
        src: url('/fonts/Inter-Bold.woff2') format('woff2'),
             url('/fonts/Inter-Bold.woff') format('woff');
      }
    `;
  }

  static optimizeFontLoading(): void {
    if (typeof document === 'undefined') return;

    // Create font loading observer
    if ('fonts' in document) {
      const fontFaces = [
        new FontFace('Inter', 'url(/fonts/Inter-Regular.woff2)', {
          style: 'normal',
          weight: '400',
          display: this.FONT_DISPLAY
        }),
        new FontFace('Inter', 'url(/fonts/Inter-SemiBold.woff2)', {
          style: 'normal',
          weight: '600',
          display: this.FONT_DISPLAY
        }),
        new FontFace('Inter', 'url(/fonts/Inter-Bold.woff2)', {
          style: 'normal',
          weight: '700',
          display: this.FONT_DISPLAY
        })
      ];

      fontFaces.forEach(fontFace => {
        (document as any).fonts.add(fontFace);
      });
    }
  }
}
```

### 4. Performance Optimization

#### Performance Monitoring
```typescript
// app/lib/performance-monitor.ts
export class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    bundleSize: 0,
    renderTime: 0
  };

  static startMonitoring(): void {
    this.observeWebVitals();
    this.observeBundleSize();
    this.observeRenderPerformance();
  }

  private static observeWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries[entries.length - 1];
      this.metrics.fcp = fcp.startTime;
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcp = entries[entries.length - 1];
      this.metrics.lcp = lcp.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.metrics.cls = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private static observeBundleSize(): void {
    // Monitor bundle size changes
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('bundle')) {
            this.metrics.bundleSize += entry.duration;
          }
        });
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private static observeRenderPerformance(): void {
    // Monitor render performance
    let renderStart = 0;
    
    if (typeof window !== 'undefined') {
      renderStart = performance.now();
      
      // Measure time to interactive
      const measureTTI = () => {
        const renderTime = performance.now() - renderStart;
        this.metrics.renderTime = renderTime;
        
        // Report metrics
        this.reportMetrics();
      };
      
      // Wait for page to be fully interactive
      if (document.readyState === 'complete') {
        measureTTI();
      } else {
        window.addEventListener('load', measureTTI);
      }
    }
  }

  private static reportMetrics(): void {
    const metrics = this.metrics;
    
    console.log('Performance Metrics:', {
      'First Contentful Paint': `${metrics.fcp.toFixed(2)}ms`,
      'Largest Contentful Paint': `${metrics.lcp.toFixed(2)}ms`,
      'First Input Delay': `${metrics.fid.toFixed(2)}ms`,
      'Cumulative Layout Shift': metrics.cls.toFixed(3),
      'Time to Interactive': `${metrics.renderTime.toFixed(2)}ms`,
      'Bundle Size': `${(metrics.bundleSize / 1024).toFixed(2)}KB`
    });

    // Send to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_metrics', {
        event_category: 'performance',
        custom_parameter_1: metrics.fcp,
        custom_parameter_2: metrics.lcp,
        custom_parameter_3: metrics.fid,
        custom_parameter_4: metrics.cls,
        custom_parameter_5: metrics.renderTime,
        custom_parameter_6: metrics.bundleSize
      });
    }
  }

  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  bundleSize: number;
  renderTime: number;
}
```

### 5. Bundle Size Optimization

#### Tree Shaking Configuration
```typescript
// app/lib/tree-shaking.ts
export class TreeShaker {
  static optimizeImports(): void {
    // Optimize imports for better tree shaking
    const optimizations = {
      // Use specific imports instead of entire libraries
      'framer-motion': {
        'motion': 'framer-motion/motion',
        'AnimatePresence': 'framer-motion/AnimatePresence',
        'useAnimation': 'framer-motion/useAnimation'
      },
      'three': {
        'WebGLRenderer': 'three/src/renderers/WebGLRenderer',
        'Scene': 'three/src/scenes/Scene',
        'PerspectiveCamera': 'three/src/cameras/PerspectiveCamera'
      }
    };

    // Generate optimized import statements
    Object.entries(optimizations).forEach(([library, imports]) => {
      console.log(`Optimizing ${library} imports:`, Object.keys(imports));
    });
  }

  static analyzeBundle(bundlePath: string): BundleAnalysis {
    // Analyze bundle for optimization opportunities
    return {
      totalSize: 0,
      dependencies: [],
      unusedExports: [],
      optimizationSuggestions: []
    };
  }
}

interface BundleAnalysis {
  totalSize: number;
  dependencies: string[];
  unusedExports: string[];
  optimizationSuggestions: string[];
}
```

### 6. Build Scripts

#### Production Build Script
```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:export": "next build && next export",
    "build:static": "next build && next export && cp -r .next/out/* out/",
    "analyze:bundle": "node scripts/analyze-bundle.js",
    "optimize:images": "node scripts/optimize-images.js",
    "optimize:fonts": "node scripts/optimize-fonts.js",
    "performance:audit": "node scripts/performance-audit.js",
    "size:check": "node scripts/bundle-size-check.js"
  }
}
```

#### Bundle Size Check Script
```typescript
// scripts/bundle-size-check.js
const fs = require('fs');
const path = require('path');

const BUNDLE_LIMITS = {
  'main.js': 250 * 1024, // 250KB
  'vendor.js': 500 * 1024, // 500KB
  'total': 750 * 1024 // 750KB
};

function checkBundleSizes() {
  const buildDir = path.join(__dirname, '../.next/static/chunks');
  const results = [];

  if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found. Run `npm run build` first.');
    return false;
  }

  const files = fs.readdirSync(buildDir);
  
  files.forEach(file => {
    const filePath = path.join(buildDir, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;

    if (BUNDLE_LIMITS[file]) {
      const limit = BUNDLE_LIMITS[file];
      const isWithinLimit = size <= limit;
      
      results.push({
        file,
        size: size,
        limit: limit,
        withinLimit: isWithinLimit,
        percentage: ((size / limit) * 100).toFixed(1)
      });

      if (!isWithinLimit) {
        console.error(`❌ ${file}: ${(size / 1024).toFixed(2)}KB (limit: ${(limit / 1024).toFixed(2)}KB)`);
      } else {
        console.log(`✅ ${file}: ${(size / 1024).toFixed(2)}KB (${results[results.length - 1].percentage}% of limit)`);
      }
    }
  });

  const totalSize = results.reduce((sum, result) => sum + result.size, 0);
  const totalLimit = BUNDLE_LIMITS.total;
  const totalWithinLimit = totalSize <= totalLimit;

  console.log(`\n📊 Total Bundle Size: ${(totalSize / 1024).toFixed(2)}KB`);
  console.log(`📊 Limit: ${(totalLimit / 1024).toFixed(2)}KB`);
  console.log(`📊 Usage: ${((totalSize / totalLimit) * 100).toFixed(1)}%`);

  if (!totalWithinLimit) {
    console.error('\n❌ Bundle size exceeds limits!');
    return false;
  } else {
    console.log('\n✅ All bundle sizes within limits!');
    return true;
  }
}

if (require.main === module) {
  const success = checkBundleSizes();
  process.exit(success ? 0 : 1);
}

module.exports = { checkBundleSizes };
```

### 7. CI/CD Integration

#### GitHub Actions Build Optimization
```yaml
# .github/workflows/build-optimization.yml
name: Build Optimization

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-analyze:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Analyze bundle size
      run: npm run size:check
    
    - name: Analyze bundle composition
      run: npm run analyze:bundle
    
    - name: Performance audit
      run: npm run performance:audit
    
    - name: Upload bundle analysis
      uses: actions/upload-artifact@v3
      with:
        name: bundle-analysis
        path: bundle-analysis/
        retention-days: 30
    
    - name: Performance budget check
      run: |
        # Check if performance budgets are met
        node scripts/performance-budget-check.js

  optimize-images:
    runs-on: ubuntu-latest
    needs: build-and-analyze
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Optimize images
      run: npm run optimize:images
    
    - name: Upload optimized images
      uses: actions/upload-artifact@v3
      with:
        name: optimized-images
        path: public/images/optimized/
        retention-days: 30
```

### 8. Performance Budget

#### Performance Budget Configuration
```typescript
// scripts/performance-budget-check.js
const BUDGET = {
  fcp: 2000,        // First Contentful Paint: 2s
  lcp: 2500,        // Largest Contentful Paint: 2.5s
  fid: 100,         // First Input Delay: 100ms
  cls: 0.1,         // Cumulative Layout Shift: 0.1
  ttfb: 600,        // Time to First Byte: 600ms
  bundleSize: 250 * 1024, // Bundle size: 250KB
  renderTime: 3000  // Render time: 3s
};

function checkPerformanceBudget() {
  // This would typically read from Lighthouse results
  const metrics = {
    fcp: 1800,
    lcp: 2200,
    fid: 80,
    cls: 0.05,
    ttfb: 500,
    bundleSize: 240 * 1024,
    renderTime: 2800
  };

  const results = [];
  let passed = true;

  Object.entries(BUDGET).forEach(([metric, budget]) => {
    const value = metrics[metric];
    const withinBudget = value <= budget;
    
    results.push({
      metric,
      value,
      budget,
      withinBudget,
      percentage: ((value / budget) * 100).toFixed(1)
    });

    if (!withinBudget) {
      passed = false;
      console.error(`❌ ${metric}: ${formatValue(metric, value)} (budget: ${formatValue(metric, budget)})`);
    } else {
      console.log(`✅ ${metric}: ${formatValue(metric, value)} (${results[results.length - 1].percentage}% of budget)`);
    }
  });

  console.log(`\n📊 Performance Budget: ${passed ? 'PASSED' : 'FAILED'}`);
  
  return passed;
}

function formatValue(metric: string, value: number): string {
  if (metric === 'bundleSize') {
    return `${(value / 1024).toFixed(2)}KB`;
  } else if (metric === 'cls') {
    return value.toFixed(3);
  } else {
    return `${value}ms`;
  }
}

if (require.main === module) {
  const passed = checkPerformanceBudget();
  process.exit(passed ? 0 : 1);
}

module.exports = { checkPerformanceBudget };
```

This comprehensive build optimization strategy ensures the Smart City Command Center achieves optimal performance, minimal bundle sizes, and efficient loading strategies for all users.

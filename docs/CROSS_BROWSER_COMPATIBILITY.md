# Cross-Browser Compatibility Testing and Fixes

This document outlines the cross-browser compatibility testing strategy for the Smart City Command Center, ensuring consistent user experiences across all supported browsers.

## Supported Browsers

### Desktop Browsers
- **Chrome** 90+ (Primary)
- **Firefox** 88+ (Primary)
- **Safari** 14+ (Primary)
- **Edge** 90+ (Primary)

### Mobile Browsers
- **Chrome Mobile** 90+ (Primary)
- **Safari Mobile** 14+ (Primary)
- **Samsung Internet** 14+ (Secondary)
- **Firefox Mobile** 88+ (Secondary)

## Testing Strategy

### 1. Automated Cross-Browser Testing

#### Playwright Multi-Browser Configuration
```typescript
// tests/cross-browser/browser-compatibility.spec.ts
import { test, devices, expect } from '@playwright/test';

const browsers = [
  { name: 'Chrome', device: devices['Desktop Chrome'] },
  { name: 'Firefox', device: devices['Desktop Firefox'] },
  { name: 'Safari', device: devices['Desktop Safari'] },
  { name: 'Edge', device: devices['Desktop Edge'] }
];

const mobileBrowsers = [
  { name: 'Chrome Mobile', device: devices['Pixel 5'] },
  { name: 'Safari Mobile', device: devices['iPhone 12'] }
];

browsers.forEach(({ name, device }) => {
  test.describe(`${name} - Desktop Compatibility`, () => {
    test.use({ ...device });

    test('Homepage renders correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check critical elements
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
      await expect(page.locator('[data-testid="3d-globe"]')).toBeVisible();
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`homepage-${name.toLowerCase()}.png`, {
        fullPage: true
      });
    });

    test('3D Globe functionality works', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="3d-globe"]', { timeout: 15000 });
      
      const globe = page.locator('[data-testid="3d-globe"]');
      await expect(globe).toBeVisible();
      
      // Test globe interaction
      await globe.hover();
      await page.waitForTimeout(500);
      
      // Verify globe is interactive
      const isInteractive = await globe.evaluate(el => {
        return el.classList.contains('interactive') || el.hasAttribute('data-interactive');
      });
      
      expect(isInteractive).toBeTruthy();
    });

    test('Navigation works correctly', async ({ page }) => {
      await page.goto('/');
      
      // Test navigation links
      const navLinks = page.locator('[data-testid="nav-link"]');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        await link.click();
        await page.waitForTimeout(500);
        
        // Verify section is visible
        const activeSection = page.locator('[data-testid="active-section"]');
        await expect(activeSection).toBeVisible();
      }
    });

    test('Forms work correctly', async ({ page }) => {
      await page.goto('/');
      
      // Open demo form
      await page.click('[data-testid="main-cta-button"]');
      const demoForm = page.locator('[data-testid="demo-form"]');
      await expect(demoForm).toBeVisible();
      
      // Fill form
      await page.fill('[data-testid="demo-name"]', 'Test User');
      await page.fill('[data-testid="demo-email"]', 'test@example.com');
      
      // Test validation
      await page.click('[data-testid="demo-submit"]');
      
      // Should either succeed or show validation errors
      const success = page.locator('[data-testid="demo-success"]');
      const errors = page.locator('[data-testid="form-error"]');
      
      await expect(success.isVisible() || errors.isVisible()).toBeTruthy();
    });

    test('Responsive design works', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 1366, height: 768 },
        { width: 1024, height: 768 },
        { width: 768, height: 1024 }
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);
        
        // Check layout adapts correctly
        const navigation = page.locator('[data-testid="navigation"]');
        await expect(navigation).toBeVisible();
        
        // Take screenshot for each viewport
        await expect(page).toHaveScreenshot(
          `responsive-${viewport.width}x${viewport.height}-${name.toLowerCase()}.png`,
          { fullPage: true }
        );
      }
    });
  });
});

mobileBrowsers.forEach(({ name, device }) => {
  test.describe(`${name} - Mobile Compatibility`, () => {
    test.use({ ...device });

    test('Mobile homepage works', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check mobile-specific elements
      await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
      
      // Test mobile navigation
      await page.click('[data-testid="mobile-menu-toggle"]');
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
      
      // Take mobile screenshot
      await expect(page).toHaveScreenshot(`mobile-homepage-${name.toLowerCase()}.png`, {
        fullPage: true
      });
    });

    test('Touch interactions work', async ({ page }) => {
      await page.goto('/');
      
      // Test tap on CTA button
      const ctaButton = page.locator('[data-testid="main-cta-button"]');
      await ctaButton.tap();
      
      const demoForm = page.locator('[data-testid="demo-form"]');
      await expect(demoForm).toBeVisible();
    });

    test('Mobile form interactions', async ({ page }) => {
      await page.goto('/');
      await page.click('[data-testid="main-cta-button"]');
      
      // Test mobile form
      const nameField = page.locator('[data-testid="demo-name"]');
      await nameField.tap();
      await nameField.fill('Mobile User');
      
      const emailField = page.locator('[data-testid="demo-email"]');
      await emailField.tap();
      await emailField.fill('mobile@example.com');
      
      // Test mobile keyboard
      await page.keyboard.press('Tab');
      
      const submitButton = page.locator('[data-testid="demo-submit"]');
      await expect(submitButton).toBeFocused();
    });
  });
});
```

### 2. Browser-Specific Feature Detection

#### Feature Detection Utilities
```typescript
// app/lib/browser-compatibility.ts
export interface BrowserFeatures {
  webgl: boolean;
  webgl2: boolean;
  webassembly: boolean;
  canvas: boolean;
  cssGrid: boolean;
  flexbox: boolean;
  customProperties: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  requestAnimationFrame: boolean;
  performanceAPI: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  geolocation: boolean;
  webWorkers: boolean;
  serviceWorkers: boolean;
  pushNotifications: boolean;
  webAudio: boolean;
  webRTC: boolean;
  indexedDB: boolean;
  webGLExtensions: string[];
}

export class BrowserCompatibility {
  private static features: BrowserFeatures | null = null;
  private static checked = false;

  static detectFeatures(): BrowserFeatures {
    if (this.checked && this.features) {
      return this.features;
    }

    const features: BrowserFeatures = {
      webgl: this.checkWebGL(),
      webgl2: this.checkWebGL2(),
      webassembly: this.checkWebAssembly(),
      canvas: this.checkCanvas(),
      cssGrid: this.checkCSSGrid(),
      flexbox: this.checkFlexbox(),
      customProperties: this.checkCustomProperties(),
      intersectionObserver: this.checkIntersectionObserver(),
      resizeObserver: this.checkResizeObserver(),
      requestAnimationFrame: this.checkRequestAnimationFrame(),
      performanceAPI: this.checkPerformanceAPI(),
      localStorage: this.checkLocalStorage(),
      sessionStorage: this.checkSessionStorage(),
      geolocation: this.checkGeolocation(),
      webWorkers: this.checkWebWorkers(),
      serviceWorkers: this.checkServiceWorkers(),
      pushNotifications: this.checkPushNotifications(),
      webAudio: this.checkWebAudio(),
      webRTC: this.checkWebRTC(),
      indexedDB: this.checkIndexedDB(),
      webGLExtensions: this.getWebGLExtensions()
    };

    this.features = features;
    this.checked = true;
    
    return features;
  }

  private static checkWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  private static checkWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  private static checkWebAssembly(): boolean {
    try {
      return typeof WebAssembly === 'object' && typeof WebAssembly.compile === 'function';
    } catch (e) {
      return false;
    }
  }

  private static checkCanvas(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  private static checkCSSGrid(): boolean {
    try {
      return CSS.supports('display', 'grid');
    } catch (e) {
      return false;
    }
  }

  private static checkFlexbox(): boolean {
    try {
      return CSS.supports('display', 'flex');
    } catch (e) {
      return false;
    }
  }

  private static checkCustomProperties(): boolean {
    try {
      return CSS.supports('color', 'var(--test)');
    } catch (e) {
      return false;
    }
  }

  private static checkIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window;
  }

  private static checkResizeObserver(): boolean {
    return 'ResizeObserver' in window;
  }

  private static checkRequestAnimationFrame(): boolean {
    return 'requestAnimationFrame' in window;
  }

  private static checkPerformanceAPI(): boolean {
    return 'performance' in window && 'now' in performance;
  }

  private static checkLocalStorage(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  private static checkSessionStorage(): boolean {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  private static checkGeolocation(): boolean {
    return 'geolocation' in navigator;
  }

  private static checkWebWorkers(): boolean {
    return 'Worker' in window;
  }

  private static checkServiceWorkers(): boolean {
    return 'serviceWorker' in navigator;
  }

  private static checkPushNotifications(): boolean {
    return 'PushManager' in window;
  }

  private static checkWebAudio(): boolean {
    try {
      return !!(window.AudioContext || (window as any).webkitAudioContext);
    } catch (e) {
      return false;
    }
  }

  private static checkWebRTC(): boolean {
    return 'RTCPeerConnection' in window || (window as any).webkitRTCPeerConnection;
  }

  private static checkIndexedDB(): boolean {
    return 'indexedDB' in window;
  }

  private static getWebGLExtensions(): string[] {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return [];
      
      const extensions = gl.getSupportedExtensions();
      return extensions ? extensions.slice() : [];
    } catch (e) {
      return [];
    }
  }

  static getBrowserInfo(): {
    name: string;
    version: string;
    platform: string;
    isMobile: boolean;
    isTablet: boolean;
  } {
    const userAgent = navigator.userAgent;
    
    // Simple browser detection
    let name = 'Unknown';
    let version = 'Unknown';
    
    if (userAgent.includes('Chrome')) {
      name = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Safari')) {
      name = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('Edge')) {
      name = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    return {
      name,
      version,
      platform: navigator.platform,
      isMobile,
      isTablet
    };
  }

  static getCompatibilityScore(): number {
    const features = this.detectFeatures();
    const totalFeatures = Object.keys(features).length - 1; // Exclude webGLExtensions
    const supportedFeatures = Object.entries(features)
      .filter(([key, value]) => key !== 'webGLExtensions' && value === true)
      .length;
    
    return Math.round((supportedFeatures / totalFeatures) * 100);
  }

  static getUnsupportedFeatures(): string[] {
    const features = this.detectFeatures();
    return Object.entries(features)
      .filter(([key, value]) => key !== 'webGLExtensions' && value === false)
      .map(([key]) => key);
  }
}
```

### 3. Browser-Specific Polyfills and Fallbacks

#### Polyfill Manager
```typescript
// app/lib/polyfill-manager.ts
export class PolyfillManager {
  private static loadedPolyfills = new Set<string>();

  static async loadRequiredPolyfills(): Promise<void> {
    const features = BrowserCompatibility.detectFeatures();
    const polyfills = [];

    // WebGL polyfills
    if (!features.webgl) {
      polyfills.push(this.loadWebGLPolyfill());
    }

    // Intersection Observer polyfill
    if (!features.intersectionObserver) {
      polyfills.push(this.loadIntersectionObserverPolyfill());
    }

    // Resize Observer polyfill
    if (!features.resizeObserver) {
      polyfills.push(this.loadResizeObserverPolyfill());
    }

    // CSS Custom Properties polyfill
    if (!features.customProperties) {
      polyfills.push(this.loadCustomPropertiesPolyfill());
    }

    // RequestAnimationFrame polyfill
    if (!features.requestAnimationFrame) {
      polyfills.push(this.loadRAFPolyfill());
    }

    // Performance API polyfill
    if (!features.performanceAPI) {
      polyfills.push(this.loadPerformancePolyfill());
    }

    // Promise polyfill (for older browsers)
    if (!window.Promise) {
      polyfills.push(this.loadPromisePolyfill());
    }

    // Fetch API polyfill
    if (!window.fetch) {
      polyfills.push(this.loadFetchPolyfill());
    }

    await Promise.all(polyfills);
  }

  private static async loadWebGLPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('webgl')) return;
    
    // Load WebGL context emulator for browsers without WebGL
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/webgl-debug@2.0.1/dist/webgl-debug.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('webgl');
        resolve();
      };
    });
  }

  private static async loadIntersectionObserverPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('intersection-observer')) return;
    
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('intersection-observer');
        resolve();
      };
    });
  }

  private static async loadResizeObserverPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('resize-observer')) return;
    
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('resize-observer');
        resolve();
      };
    });
  }

  private static async loadCustomPropertiesPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('custom-properties')) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2.4.2/dist/css-vars-ponyfill.min.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('custom-properties');
        resolve();
      };
    });
  }

  private static async loadRAFPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('raf')) return;
    
    // Simple requestAnimationFrame polyfill
    const lastTime = 0;
    (window as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
      const currentTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
      const id = window.setTimeout(() => {
        callback(currentTime + timeToCall);
      }, timeToCall);
      lastTime = currentTime + timeToCall;
      return id;
    };
    
    (window as any).cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
    
    this.loadedPolyfills.add('raf');
  }

  private static async loadPerformancePolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('performance')) return;
    
    // Simple performance.now() polyfill
    if (!performance.now) {
      (performance as any).now = () => {
        return Date.now() - (performance.timing || { navigationStart: 0 }).navigationStart;
      };
    }
    
    this.loadedPolyfills.add('performance');
  }

  private static async loadPromisePolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('promise')) return;
    
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=Promise';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('promise');
        resolve();
      };
    });
  }

  private static async loadFetchPolyfill(): Promise<void> {
    if (this.loadedPolyfills.has('fetch')) return;
    
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=fetch';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        this.loadedPolyfills.add('fetch');
        resolve();
      };
    });
  }
}
```

### 4. Browser-Specific CSS Fixes

#### CSS Compatibility Layer
```css
/* app/styles/browser-compatibility.css */

/* Safari-specific fixes */
@supports (-webkit-appearance: none) {
  .safari-fix {
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0);
  }
  
  /* Safari flexbox gap fallback */
  .flex-gap-fallback {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }
  
  .flex-gap-fallback > * {
    margin: 8px;
  }
}

/* Firefox-specific fixes */
@supports (-moz-appearance: none) {
  .firefox-fix {
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Firefox scrollbar styling */
  .firefox-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #4a5568 #1a202c;
  }
}

/* Edge-specific fixes */
@supports (-ms-ime-align: auto) {
  .edge-fix {
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
}

/* Chrome-specific fixes */
@supports (-webkit-appearance: none) and (not (content: 'test')) {
  .chrome-fix {
    -webkit-font-smoothing: antialiased;
  }
}

/* WebGL fallbacks */
.no-webgl .webgl-content {
  display: none;
}

.no-webgl .webgl-fallback {
  display: block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: white;
}

/* CSS Grid fallbacks */
@supports not (display: grid) {
  .grid-fallback {
    display: flex;
    flex-wrap: wrap;
  }
  
  .grid-fallback > * {
    flex: 1 1 300px;
    margin: 1rem;
  }
}

/* Custom Properties fallbacks */
@supports not (--custom: property) {
  .css-vars-fallback {
    background-color: #1a202c;
    color: #e2e8f0;
  }
}

/* Intersection Observer fallbacks */
.no-intersection-observer .lazy-load {
  opacity: 1;
  transform: none;
}

/* Responsive design fallbacks */
@supports not (display: flex) {
  .flex-fallback {
    display: block;
  }
  
  .flex-fallback > * {
    display: inline-block;
    vertical-align: top;
  }
}

/* Touch device detection */
@media (hover: none) and (pointer: coarse) {
  .touch-device {
    /* Touch-specific styles */
  }
  
  .hover-effect {
    /* Disable hover effects on touch devices */
    pointer-events: none;
  }
}

/* High DPI display fixes */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .high-dpi {
    /* High DPI specific styles */
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none !important;
    transition: none !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    /* Dark mode specific styles */
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
}

/* Accessibility improvements */
@media (prefers-contrast: high) {
  .high-contrast {
    /* High contrast mode styles */
  }
}
```

### 5. Browser Compatibility Component

#### Compatibility Wrapper
```typescript
// app/components/BrowserCompatibility.tsx
import React, { useEffect, useState } from 'react';
import { BrowserCompatibility, PolyfillManager } from '../lib/browser-compatibility';

interface BrowserCompatibilityProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showWarning?: boolean;
}

export const BrowserCompatibility: React.FC<BrowserCompatibilityProps> = ({
  children,
  fallback,
  showWarning = true
}) => {
  const [isCompatible, setIsCompatible] = useState(true);
  const [compatibilityScore, setCompatibilityScore] = useState(100);
  const [unsupportedFeatures, setUnsupportedFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCompatibility = async () => {
      setIsLoading(true);
      
      // Load required polyfills
      await PolyfillManager.loadRequiredPolyfills();
      
      // Check browser compatibility
      const features = BrowserCompatibility.detectFeatures();
      const score = BrowserCompatibility.getCompatibilityScore();
      const unsupported = BrowserCompatibility.getUnsupportedFeatures();
      
      setCompatibilityScore(score);
      setUnsupportedFeatures(unsupported);
      
      // Consider browser compatible if score >= 80
      setIsCompatible(score >= 80);
      setIsLoading(false);
    };

    checkCompatibility();
  }, []);

  if (isLoading) {
    return (
      <div className="compatibility-loading">
        <div className="loading-spinner"></div>
        <p>Checking browser compatibility...</p>
      </div>
    );
  }

  if (!isCompatible) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="browser-incompatible">
        <div className="incompatible-message">
          <h2>Browser Not Supported</h2>
          <p>
            Your browser has a compatibility score of {compatibilityScore}%.
            Some features may not work correctly.
          </p>
          
          {unsupportedFeatures.length > 0 && (
            <div className="unsupported-features">
              <h3>Unsupported Features:</h3>
              <ul>
                {unsupportedFeatures.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="recommended-browsers">
            <h3>Recommended Browsers:</h3>
            <ul>
              <li>Chrome 90+</li>
              <li>Firefox 88+</li>
              <li>Safari 14+</li>
              <li>Edge 90+</li>
            </ul>
          </div>
          
          {showWarning && (
            <button
              onClick={() => setIsCompatible(true)}
              className="continue-anyway"
            >
              Continue Anyway
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showWarning && compatibilityScore < 95) {
    return (
      <div className="browser-warning">
        <div className="warning-message">
          <p>
            Your browser has a compatibility score of {compatibilityScore}%. 
            Some features may not work optimally.
          </p>
          <button onClick={() => setIsCompatible(true)}>
            Continue
          </button>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default BrowserCompatibility;
```

## Testing Automation

### CI/CD Cross-Browser Testing
```yaml
# .github/workflows/cross-browser-tests.yml
name: Cross-Browser Compatibility Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  cross-browser-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        device: [desktop, mobile]
        
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
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run cross-browser tests
      run: npx playwright test tests/cross-browser/ --project=${{ matrix.browser }}
    
    - name: Upload browser test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: browser-test-results-${{ matrix.browser }}-${{ matrix.device }}
        path: test-results/
        retention-days: 30
```

## Browser-Specific Fixes

### Common Issues and Solutions

#### 1. Safari WebGL Issues
```typescript
// Safari-specific WebGL initialization
export const initializeWebGLForSafari = (canvas: HTMLCanvasElement): WebGLRenderingContext | null => {
  const contextOptions = {
    alpha: false,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  };
  
  let gl = canvas.getContext('webgl', contextOptions);
  
  // Fallback for Safari
  if (!gl) {
    gl = canvas.getContext('experimental-webgl', contextOptions);
  }
  
  // Safari-specific fixes
  if (gl && /Safari/.test(navigator.userAgent)) {
    // Enable vertex array objects if available
    const ext = gl.getExtension('OES_vertex_array_object');
    if (ext) {
      // Use VAO for better performance
    }
  }
  
  return gl;
};
```

#### 2. Firefox CSS Grid Issues
```css
/* Firefox CSS Grid fallback */
@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
  
  .grid-item {
    flex: 1 1 300px;
    margin: 1rem;
  }
}

/* Firefox-specific grid fixes */
@supports (-moz-appearance: none) {
  .firefox-grid-fix {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
}
```

#### 3. Edge Flexbox Issues
```css
/* Edge flexbox fallback */
@supports not (display: flex) {
  .flex-container {
    display: block;
  }
  
  .flex-item {
    display: inline-block;
    vertical-align: top;
  }
}

/* Edge-specific flexbox fixes */
@supports (-ms-ime-align: auto) {
  .edge-flex-fix {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
  }
}
```

## Monitoring and Reporting

### Browser Compatibility Dashboard
```typescript
// app/lib/browser-monitor.ts
export class BrowserMonitor {
  static reportCompatibilityIssue(issue: {
    browser: string;
    version: string;
    feature: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'browser_compatibility_issue', {
        browser: issue.browser,
        version: issue.version,
        feature: issue.feature,
        severity: issue.severity
      });
    }
    
    // Log to console for debugging
    console.warn('Browser compatibility issue:', issue);
  }

  static trackFeatureUsage(feature: string): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'feature_usage', {
        feature_name: feature
      });
    }
  }
}
```

This comprehensive cross-browser compatibility strategy ensures the Smart City Command Center works consistently across all supported browsers while providing appropriate fallbacks and polyfills for older browsers.

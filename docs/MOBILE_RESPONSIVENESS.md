# Mobile Responsiveness Validation and Optimization

This document outlines the comprehensive mobile responsiveness testing and optimization strategy for the Smart City Command Center, ensuring optimal user experiences across all mobile devices.

## Supported Mobile Devices

### Primary Devices
- **iPhone 12/13/14** (390x844)
- **iPhone 12/13/14 Pro** (393x852)
- **iPhone 12/13/14 Pro Max** (428x926)
- **Samsung Galaxy S21/S22** (384x854)
- **Google Pixel 6/7** (412x915)

### Tablet Devices
- **iPad Air** (820x1180)
- **iPad Pro 11"** (834x1194)
- **iPad Pro 12.9"** (1024x1366)
- **Samsung Galaxy Tab S8** (800x1280)

### Small Mobile Devices
- **iPhone SE** (375x667)
- **Google Pixel 5** (393x851)
- **Samsung Galaxy A53** (360x780)

## Responsive Breakpoints

### Breakpoint System
```css
/* app/styles/breakpoints.css */

/* Mobile First Approach */
:root {
  --breakpoint-xs: 320px;  /* Extra small mobile */
  --breakpoint-sm: 375px;  /* Small mobile */
  --breakpoint-md: 425px;  /* Medium mobile */
  --breakpoint-lg: 768px;  /* Tablet */
  --breakpoint-xl: 1024px; /* Small desktop */
  --breakpoint-2xl: 1280px; /* Desktop */
  --breakpoint-3xl: 1536px; /* Large desktop */
}

/* Media Queries */
@media (min-width: 320px) {
  .container { max-width: 320px; }
}

@media (min-width: 375px) {
  .container { max-width: 375px; }
}

@media (min-width: 425px) {
  .container { max-width: 425px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container { max-width: 1536px; }
}
```

## Mobile Testing Strategy

### 1. Automated Mobile Testing

#### Playwright Mobile Test Suite
```typescript
// tests/mobile/responsive-design.spec.ts
import { test, devices, expect } from '@playwright/test';

const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', device: devices['iPhone 12 Pro'] },
  { name: 'iPhone 12 Pro Max', device: devices['iPhone 12 Pro Max'] },
  { name: 'Samsung Galaxy S21', device: devices['Galaxy S21'] },
  { name: 'Google Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] }
];

const tabletDevices = [
  { name: 'iPad Air', device: devices['iPad Air'] },
  { name: 'iPad Pro 11', device: devices['iPad Pro 11'] },
  { name: 'iPad Pro 12.9', device: devices['iPad Pro 12.9'] },
  { name: 'Samsung Galaxy Tab S8', device: devices['Galaxy Tab S8'] }
];

mobileDevices.forEach(({ name, device }) => {
  test.describe(`${name} - Mobile Responsiveness`, () => {
    test.use({ ...device });

    test('Homepage renders correctly on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check mobile-specific elements
      await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
      await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible();
      
      // Check 3D globe adapts to mobile
      const globe = page.locator('[data-testid="3d-globe"]');
      await expect(globe).toBeVisible();
      
      // Verify mobile layout
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`mobile-homepage-${name.replace(/\s+/g, '-').toLowerCase()}.png`, {
        fullPage: true
      });
    });

    test('Mobile navigation works correctly', async ({ page }) => {
      await page.goto('/');
      
      // Test mobile menu toggle
      const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
      await expect(menuToggle).toBeVisible();
      
      // Open mobile menu
      await menuToggle.tap();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible();
      
      // Test menu navigation
      const techLink = mobileMenu.locator('[data-testid="mobile-nav-link-technology"]');
      await expect(techLink).toBeVisible();
      
      await techLink.tap();
      await page.waitForTimeout(500);
      
      // Verify menu closed and navigation worked
      await expect(mobileMenu).not.toBeVisible();
      const techSection = page.locator('[data-testid="technology-section"]');
      await expect(techSection).toBeVisible();
    });

    test('Touch interactions work correctly', async ({ page }) => {
      await page.goto('/');
      
      // Test tap on CTA button
      const ctaButton = page.locator('[data-testid="main-cta-button"]');
      await ctaButton.tap();
      
      const demoForm = page.locator('[data-testid="demo-form"]');
      await expect(demoForm).toBeVisible();
      
      // Test form interactions on mobile
      const nameField = page.locator('[data-testid="demo-name"]');
      await nameField.tap();
      await nameField.fill('Mobile User');
      
      // Test mobile keyboard
      await page.keyboard.press('Tab');
      const emailField = page.locator('[data-testid="demo-email"]');
      await expect(emailField).toBeFocused();
    });

    test('Mobile form validation and submission', async ({ page }) => {
      await page.goto('/');
      await page.tap('[data-testid="main-cta-button"]');
      
      // Fill mobile form
      await page.fill('[data-testid="demo-name"]', 'John Doe');
      await page.fill('[data-testid="demo-email"]', 'john@example.com');
      await page.fill('[data-testid="demo-company"]', 'Mobile Corp');
      
      // Submit form
      await page.tap('[data-testid="demo-submit"]');
      
      // Check success or validation
      const success = page.locator('[data-testid="demo-success"]');
      const errors = page.locator('[data-testid="form-error"]');
      
      await expect(success.isVisible() || errors.isVisible()).toBeTruthy();
    });

    test('Mobile scroll behavior', async ({ page }) => {
      await page.goto('/');
      
      // Test smooth scrolling on mobile
      await page.tap('[data-testid="nav-link-technology"]');
      await page.waitForTimeout(1000);
      
      // Check if scrolled to correct section
      const techSection = page.locator('[data-testid="technology-section"]');
      await expect(techSection).toBeVisible();
      
      // Test scroll-to-top button
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(500);
      
      const scrollToTop = page.locator('[data-testid="scroll-to-top"]');
      if (await scrollToTop.isVisible()) {
        await scrollToTop.tap();
        await page.waitForTimeout(500);
        
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeLessThan(100);
      }
    });

    test('Mobile performance metrics', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Measure mobile performance
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      
      // Mobile performance targets (more lenient than desktop)
      expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds
      expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
    });
  });
});

tabletDevices.forEach(({ name, device }) => {
  test.describe(`${name} - Tablet Responsiveness`, () => {
    test.use({ ...device });

    test('Tablet layout optimization', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check tablet-specific layout
      const navigation = page.locator('[data-testid="navigation"]');
      await expect(navigation).toBeVisible();
      
      // Should show desktop navigation on tablet
      const desktopNav = navigation.locator('[data-testid="desktop-nav"]');
      const mobileNav = navigation.locator('[data-testid="mobile-nav"]');
      
      await expect(desktopNav.isVisible()).toBeTruthy();
      await expect(mobileNav.isVisible()).toBeFalsy();
      
      // Test grid layouts adapt to tablet
      const techSection = page.locator('[data-testid="technology-section"]');
      await techSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const techCards = techSection.locator('[data-testid="tech-card"]');
      const cardCount = await techCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Take tablet screenshot
      await expect(page).toHaveScreenshot(`tablet-homepage-${name.replace(/\s+/g, '-').toLowerCase()}.png`, {
        fullPage: true
      });
    });

    test('Tablet touch interactions', async ({ page }) => {
      await page.goto('/');
      
      // Test touch interactions on tablet
      const techCard = page.locator('[data-testid="tech-card"]').first();
      await techCard.tap();
      await page.waitForTimeout(300);
      
      // Verify card interaction
      const expandedCard = techCard.locator('[data-testid="tech-card-expanded"]');
      await expect(expandedCard.isVisible()).toBeTruthy();
    });
  });
});
```

### 2. Responsive Component Testing

#### Component-Level Mobile Tests
```typescript
// tests/mobile/components/mobile-components.spec.ts
import { test, devices, expect } from '@playwright/test';

test.describe('Mobile Component Tests', () => {
  const mobileDevices = [
    devices['iPhone 12'],
    devices['Samsung Galaxy S21'],
    devices['Google Pixel 5']
  ];

  mobileDevices.forEach(device => {
    test.describe(`${device.defaultViewportType?.name} - Component Tests`, () => {
      test.use({ ...device });

      test('Navigation component adapts to mobile', async ({ page }) => {
        await page.goto('/');
        
        const navigation = page.locator('[data-testid="navigation"]');
        await expect(navigation).toBeVisible();
        
        // Check mobile menu is visible
        const mobileMenuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
        await expect(mobileMenuToggle).toBeVisible();
        
        // Check desktop nav is hidden
        const desktopNav = navigation.locator('[data-testid="desktop-nav"]');
        await expect(desktopNav).not.toBeVisible();
      });

      test('Hero section mobile layout', async ({ page }) => {
        await page.goto('/');
        
        const heroSection = page.locator('[data-testid="hero-section"]');
        await expect(heroSection).toBeVisible();
        
        // Check mobile-specific hero layout
        const heroContent = heroSection.locator('[data-testid="hero-content"]');
        await expect(heroContent).toBeVisible();
        
        // Check CTA buttons are mobile-friendly
        const ctaButtons = heroSection.locator('[data-testid="cta-button"]');
        const buttonCount = await ctaButtons.count();
        
        for (let i = 0; i < buttonCount; i++) {
          const button = ctaButtons.nth(i);
          const boundingBox = await button.boundingBox();
          
          // Buttons should be large enough for touch
          expect(boundingBox.height).toBeGreaterThanOrEqual(44); // iOS minimum touch target
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        }
      });

      test('Technology section mobile grid', async ({ page }) => {
        await page.goto('/#technology');
        
        const techSection = page.locator('[data-testid="technology-section"]');
        await expect(techSection).toBeVisible();
        
        // Check mobile grid layout
        const techCards = techSection.locator('[data-testid="tech-card"]');
        const cardCount = await techCards.count();
        
        // Should stack vertically on mobile
        for (let i = 0; i < cardCount - 1; i++) {
          const currentCard = techCards.nth(i);
          const nextCard = techCards.nth(i + 1);
          
          const currentBox = await currentCard.boundingBox();
          const nextBox = await nextCard.boundingBox();
          
          // Cards should be stacked vertically
          expect(currentBox.y).toBeLessThan(nextBox.y);
        }
      });

      test('Form component mobile optimization', async ({ page }) => {
        await page.goto('/');
        await page.tap('[data-testid="main-cta-button"]');
        
        const demoForm = page.locator('[data-testid="demo-form"]');
        await expect(demoForm).toBeVisible();
        
        // Check form fields are mobile-friendly
        const formFields = demoForm.locator('input, textarea, select');
        const fieldCount = await formFields.count();
        
        for (let i = 0; i < fieldCount; i++) {
          const field = formFields.nth(i);
          const boundingBox = await field.boundingBox();
          
          // Form fields should be large enough for touch
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
        
        // Check mobile keyboard optimization
        const emailField = page.locator('[data-testid="demo-email"]');
        await emailField.tap();
        
        // Should show email keyboard on mobile
        const inputType = await emailField.getAttribute('type');
        expect(inputType).toBe('email');
      });

      test('Mobile accessibility features', async ({ page }) => {
        await page.goto('/');
        
        // Check touch targets are accessible
        const interactiveElements = page.locator('button, a, input, textarea, select');
        const elementCount = await interactiveElements.count();
        
        for (let i = 0; i < elementCount; i++) {
          const element = interactiveElements.nth(i);
          const boundingBox = await element.boundingBox();
          
          // All interactive elements should meet minimum touch target size
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        }
        
        // Check focus management on mobile
        const firstButton = page.locator('button').first();
        await firstButton.tap();
        
        // Should maintain focus for accessibility
        await expect(firstButton).toBeFocused();
      });
    });
  });
});
```

### 3. Mobile Performance Testing

#### Mobile Performance Metrics
```typescript
// tests/mobile/performance/mobile-performance.spec.ts
import { test, devices, expect } from '@playwright/test';
import { MobilePerformanceMonitor } from '../utils/mobile-performance-monitor';

const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'Samsung Galaxy S21', device: devices['Galaxy S21'] },
  { name: 'Google Pixel 5', device: devices['Pixel 5'] }
];

mobileDevices.forEach(({ name, device }) => {
  test.describe(`${name} - Mobile Performance`, () => {
    test.use({ ...device });

    test('Mobile page load performance', async ({ page }) => {
      const monitor = new MobilePerformanceMonitor(page);
      await monitor.startMonitoring();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const metrics = await monitor.stopMonitoring();
      
      // Mobile performance targets
      expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds
      expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
      expect(metrics.domContentLoaded).toBeLessThan(2500); // 2.5 seconds
      
      console.log(`${name} performance metrics:`, metrics);
    });

    test('Mobile animation performance', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="3d-globe"]', { timeout: 15000 });
      
      const monitor = new MobilePerformanceMonitor(page);
      await monitor.startFrameRateMonitoring();
      
      // Let animations run for 5 seconds
      await page.waitForTimeout(5000);
      
      const frameMetrics = await monitor.stopFrameRateMonitoring();
      
      // Mobile animation targets (lower than desktop)
      expect(frameMetrics.averageFPS).toBeGreaterThanOrEqual(25);
      expect(frameMetrics.minFPS).toBeGreaterThanOrEqual(15);
      
      console.log(`${name} animation metrics:`, frameMetrics);
    });

    test('Mobile memory usage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const monitor = new MobilePerformanceMonitor(page);
      await monitor.startMemoryMonitoring();
      
      // Run for 10 seconds to measure memory
      await page.waitForTimeout(10000);
      
      const memoryMetrics = await monitor.stopMemoryMonitoring();
      
      // Mobile memory limits (stricter than desktop)
      expect(memoryMetrics.peakMemoryUsage).toBeLessThan(80 * 1024 * 1024); // 80MB
      expect(memoryMetrics.memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB growth
      
      console.log(`${name} memory metrics:`, memoryMetrics);
    });

    test('Mobile interaction response time', async ({ page }) => {
      await page.goto('/');
      
      const monitor = new MobilePerformanceMonitor(page);
      
      // Test tap response time
      const ctaButton = page.locator('[data-testid="main-cta-button"]');
      const responseTime = await monitor.measureInteractionResponse('[data-testid="main-cta-button"]', 'tap');
      
      expect(responseTime).toBeLessThan(150); // 150ms for mobile
      
      // Test form interaction response time
      await ctaButton.tap();
      const nameField = page.locator('[data-testid="demo-name"]');
      const formResponseTime = await monitor.measureInteractionResponse('[data-testid="demo-name"]', 'tap');
      
      expect(formResponseTime).toBeLessThan(100); // 100ms for form fields
      
      console.log(`${name} interaction times:`, {
        ctaResponse: responseTime,
        formResponse: formResponseTime
      });
    });
  });
});
```

### 4. Mobile UX Testing

#### Touch Interaction Tests
```typescript
// tests/mobile/ux/touch-interactions.spec.ts
import { test, devices, expect } from '@playwright/test';

const touchDevices = [
  devices['iPhone 12'],
  devices['Samsung Galaxy S21'],
  devices['iPad Air']
];

touchDevices.forEach(device => {
  test.describe(`${device.defaultViewportType?.name} - Touch Interactions`, () => {
    test.use({ ...device });

    test('Swipe gestures work correctly', async ({ page }) => {
      await page.goto('/#testimonials');
      
      const carousel = page.locator('[data-testid="testimonial-carousel"]');
      await expect(carousel).toBeVisible();
      
      // Test swipe left
      const carouselContainer = carousel.locator('[data-testid="carousel-container"]');
      await carouselContainer.swipe('left');
      await page.waitForTimeout(500);
      
      // Verify carousel moved
      const activeSlide = carousel.locator('[data-testid="carousel-slide"][data-active="true"]');
      await expect(activeSlide).toBeVisible();
      
      // Test swipe right
      await carouselContainer.swipe('right');
      await page.waitForTimeout(500);
      
      // Verify carousel moved back
      const newActiveSlide = carousel.locator('[data-testid="carousel-slide"][data-active="true"]');
      await expect(newActiveSlide).toBeVisible();
    });

    test('Pinch zoom works on mobile', async ({ page }) => {
      await page.goto('/');
      
      const globe = page.locator('[data-testid="3d-globe"]');
      await expect(globe).toBeVisible();
      
      // Test pinch zoom
      await page.locator('body').pinch({
        x: 200,
        y: 200,
        scaleFactor: 1.5
      });
      
      await page.waitForTimeout(1000);
      
      // Verify zoom worked (check if transform is applied)
      const transform = await globe.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(transform).not.toBe('none');
    });

    test('Long press interactions', async ({ page }) => {
      await page.goto('/');
      
      const techCard = page.locator('[data-testid="tech-card"]').first();
      
      // Test long press
      await techCard.longPress();
      await page.waitForTimeout(500);
      
      // Check if context menu or long press menu appears
      const contextMenu = page.locator('[data-testid="context-menu"]');
      if (await contextMenu.isVisible()) {
        await expect(contextMenu).toBeVisible();
      }
    });

    test('Double tap interactions', async ({ page }) => {
      await page.goto('/');
      
      const globe = page.locator('[data-testid="3d-globe"]');
      await expect(globe).toBeVisible();
      
      // Test double tap to reset zoom
      await page.locator('body').pinch({
        x: 200,
        y: 200,
        scaleFactor: 1.5
      });
      
      await page.waitForTimeout(1000);
      
      // Double tap to reset
      await globe.dbltap();
      await page.waitForTimeout(500);
      
      // Verify zoom reset
      const transform = await globe.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(transform).toBe('none') || expect(transform).toBe('matrix(1, 0, 0, 1, 0, 0)');
    });
  });
});
```

## Mobile Optimization Strategies

### 1. Performance Optimization

#### Mobile Performance Utilities
```typescript
// app/lib/mobile-optimization.ts
export class MobileOptimization {
  private static isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  private static isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  static optimizeForMobile(): void {
    if (!this.isMobile && !this.isTablet) return;

    // Optimize images for mobile
    this.optimizeImages();
    
    // Reduce animation complexity on mobile
    this.optimizeAnimations();
    
    // Optimize 3D rendering for mobile
    this.optimize3DRendering();
    
    // Enable touch optimizations
    this.enableTouchOptimizations();
    
    // Optimize fonts for mobile
    this.optimizeFonts();
  }

  private static optimizeImages(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Use WebP format for mobile if supported
      if (this.supportsWebP()) {
        const src = img.getAttribute('src');
        if (src && !src.includes('.webp')) {
          img.setAttribute('src', src.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        }
      }
      
      // Add loading="lazy" for mobile
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  private static optimizeAnimations(): void {
    // Reduce animation complexity on mobile
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .animated {
          animation-duration: 0.3s !important;
          transition-duration: 0.3s !important;
        }
        
        .complex-animation {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private static optimize3DRendering(): void {
    // Reduce 3D complexity on mobile
    if (window.THREE) {
      // Lower pixel ratio for mobile
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      window.THREE.WebGLRenderer.prototype.setPixelRatio(pixelRatio);
      
      // Reduce shadow quality on mobile
      window.THREE.WebGLRenderer.prototype.shadowMap.enabled = false;
    }
  }

  private static enableTouchOptimizations(): void {
    // Add touch-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) and (pointer: coarse) {
        button, a, input, textarea, select {
          min-height: 44px;
          min-width: 44px;
        }
        
        .hover-effect {
          pointer-events: none;
        }
        
        .touch-feedback {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  private static optimizeFonts(): void {
    // Use system fonts on mobile for better performance
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  static getViewportCategory(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isTablet) return 'tablet';
    if (this.isMobile) return 'mobile';
    return 'desktop';
  }

  static isSmallMobile(): boolean {
    return window.innerWidth <= 375;
  }

  static isLargeMobile(): boolean {
    return window.innerWidth > 375 && window.innerWidth <= 425;
  }
}
```

### 2. Responsive Design System

#### Mobile-First CSS Architecture
```css
/* app/styles/mobile-first.css */

/* Base styles (mobile first) */
.container {
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  width: 100%;
  margin-bottom: 1rem;
}

.button {
  width: 100%;
  min-height: 44px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

/* Small mobile (320px+) */
@media (min-width: 320px) {
  .container {
    max-width: 320px;
  }
}

/* Mobile (375px+) */
@media (min-width: 375px) {
  .container {
    max-width: 375px;
  }
  
  .button {
    font-size: 1.125rem;
  }
}

/* Medium mobile (425px+) */
@media (min-width: 425px) {
  .container {
    max-width: 425px;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 2rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  .card {
    margin-bottom: 0;
  }
  
  .button {
    width: auto;
    min-width: 120px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
  
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .interactive-element {
    min-height: 44px;
    min-width: 44px;
    padding: 0.75rem;
  }
  
  .hover-effect {
    opacity: 1;
  }
  
  .hover-effect:hover {
    transform: none;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .icon {
    image-rendering: -webkit-optimize-contrast;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .hero-section {
    min-height: 100vh;
    padding: 2rem 0;
  }
  
  .mobile-menu {
    max-height: 50vh;
    overflow-y: auto;
  }
}
```

### 3. Mobile-Specific Components

#### Mobile Navigation Component
```typescript
// app/components/MobileNavigation.tsx
import React, { useState, useEffect } from 'react';
import { MobileOptimization } from '../lib/mobile-optimization';

interface MobileNavigationProps {
  items: Array<{
    id: string;
    label: string;
    href: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  isOpen,
  onClose
}) => {
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (item: typeof items[0]) => {
    setActiveItem(item.id);
    onClose();
    
    // Smooth scroll to section
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-navigation-overlay" onClick={onClose}>
      <div className="mobile-navigation" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-navigation-header">
          <h3>Menu</h3>
          <button
            className="mobile-navigation-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <nav className="mobile-navigation-nav">
          <ul className="mobile-navigation-list">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`mobile-navigation-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mobile-navigation-footer">
          <button className="mobile-navigation-cta">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Monitoring and Analytics

### Mobile Performance Monitoring
```typescript
// app/lib/mobile-monitor.ts
export class MobileMonitor {
  static trackMobilePerformance(): void {
    if (!MobileOptimization.isMobile && !MobileOptimization.isTablet) return;

    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track mobile-specific metrics
    this.trackMobileMetrics();
    
    // Track user interactions
    this.trackMobileInteractions();
  }

  private static trackCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if ('gtag' in window) {
        (window as any).gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: Math.round(lastEntry.startTime),
          event_label: 'mobile'
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry) => {
        if ('gtag' in window) {
          (window as any).gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            event_label: 'mobile'
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if ('gtag' in window) {
        (window as any).gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: Math.round(clsValue * 1000),
          event_label: 'mobile'
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private static trackMobileMetrics(): void {
    // Track viewport size
    if ('gtag' in window) {
      (window as any).gtag('event', 'viewport_size', {
        event_category: 'mobile',
        custom_parameter_1: window.innerWidth,
        custom_parameter_2: window.innerHeight
      });
    }

    // Track device pixel ratio
    if ('gtag' in window) {
      (window as any).gtag('event', 'device_pixel_ratio', {
        event_category: 'mobile',
        value: window.devicePixelRatio
      });
    }

    // Track connection type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if ('gtag' in window) {
        (window as any).gtag('event', 'connection_type', {
          event_category: 'mobile',
          custom_parameter_1: connection.effectiveType,
          custom_parameter_2: connection.downlink
        });
      }
    }
  }

  private static trackMobileInteractions(): void {
    // Track touch interactions
    document.addEventListener('touchstart', (e) => {
      if ('gtag' in window) {
        (window as any).gtag('event', 'touch_interaction', {
          event_category: 'mobile',
          custom_parameter_1: e.touches.length
        });
      }
    });

    // Track swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        if ('gtag' in window) {
          (window as any).gtag('event', 'swipe_gesture', {
            event_category: 'mobile',
            custom_parameter_1: deltaX > 0 ? 'right' : 'left',
            custom_parameter_2: deltaY > 0 ? 'down' : 'up'
          });
        }
      }
    });
  }
}
```

This comprehensive mobile responsiveness strategy ensures the Smart City Command Center provides optimal user experiences across all mobile devices while maintaining performance and accessibility standards.

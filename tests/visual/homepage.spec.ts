import { test, expect } from '@playwright/test';
import { VisualTestHelpers } from '../utils/visual-helpers';

test.describe('Smart City Command Center - Visual Regression Tests', () => {
  let helpers: VisualTestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new VisualTestHelpers(page);
    await page.goto('/');
  });

  test.describe('Homepage Layout', () => {
    test('Desktop homepage layout', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('Mobile homepage layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('Tablet homepage layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-tablet.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Navigation Component', () => {
    test('Navigation desktop view', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const navigation = page.locator('[data-testid="navigation"]');
      await expect(navigation).toBeVisible();
      
      await expect(navigation).toHaveScreenshot('navigation-desktop.png');
    });

    test('Navigation mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const navigation = page.locator('[data-testid="navigation"]');
      await expect(navigation).toBeVisible();
      
      await expect(navigation).toHaveScreenshot('navigation-mobile.png');
    });

    test('Navigation mobile menu interaction', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const navigation = page.locator('[data-testid="navigation"]');
      const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
      
      // Open mobile menu
      await menuToggle.click();
      await page.waitForTimeout(300);
      
      await expect(navigation).toHaveScreenshot('navigation-mobile-open.png');
      
      // Close mobile menu
      await menuToggle.click();
      await page.waitForTimeout(300);
      
      await expect(navigation).toHaveScreenshot('navigation-mobile-closed.png');
    });

    test('Navigation hover states', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const navigation = page.locator('[data-testid="navigation"]');
      const navLinks = navigation.locator('[data-testid="nav-link"]');
      
      // Test hover on first nav link
      await navLinks.first().hover();
      await page.waitForTimeout(200);
      
      await expect(navigation).toHaveScreenshot('navigation-hover.png');
    });
  });

  test.describe('Hero Section', () => {
    test('Hero section with 3D globe', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
      
      // Wait for 3D globe to load
      await page.waitForSelector('[data-testid="3d-globe"]', { timeout: 10000 });
      await page.waitForTimeout(2000); // Wait for globe animation
      
      await expect(heroSection).toHaveScreenshot('hero-section-with-globe.png');
    });

    test('Hero section responsive behavior', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]');
      
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await helpers.waitForAnimations('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-section-mobile.png');
      
      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await helpers.waitForAnimations('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-section-tablet.png');
      
      // Test desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      await helpers.waitForAnimations('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('hero-section-desktop.png');
    });

    test('Hero section call-to-action buttons', async ({ page }) => {
      const heroSection = page.locator('[data-testid="hero-section"]');
      const ctaButtons = heroSection.locator('[data-testid="cta-button"]');
      
      // Test button hover states
      await ctaButtons.first().hover();
      await page.waitForTimeout(200);
      
      await expect(ctaButtons.first()).toHaveScreenshot('hero-cta-button-hover.png');
    });
  });

  test.describe('Technology Stack Section', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to technology section
      await page.goto('/#technology');
      await page.waitForLoadState('networkidle');
    });

    test('Technology stack cards layout', async ({ page }) => {
      const techSection = page.locator('[data-testid="technology-section"]');
      await expect(techSection).toBeVisible();
      
      // Scroll to section and wait for animations
      await techSection.scrollIntoViewIfNeeded();
      await helpers.waitForAnimations('[data-testid="technology-section"]');
      
      await expect(techSection).toHaveScreenshot('technology-stack-section.png');
    });

    test('Tech card interactions', async ({ page }) => {
      const techCard = page.locator('[data-testid="tech-card"]').first();
      await expect(techCard).toBeVisible();
      
      // Test hover state
      await techCard.hover();
      await page.waitForTimeout(300);
      
      await expect(techCard).toHaveScreenshot('tech-card-hover.png');
      
      // Test expanded state
      await techCard.click();
      await page.waitForTimeout(500);
      
      await expect(techCard).toHaveScreenshot('tech-card-expanded.png');
    });

    test('Technology stack responsive design', async ({ page }) => {
      const techSection = page.locator('[data-testid="technology-section"]');
      
      await helpers.takeResponsiveScreenshot(
        '[data-testid="technology-section"]',
        'technology-stack',
        [
          { width: 375, height: 667 },
          { width: 768, height: 1024 },
          { width: 1920, height: 1080 }
        ]
      );
    });
  });

  test.describe('Impact Metrics Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#metrics');
      await page.waitForLoadState('networkidle');
    });

    test('Impact metrics animated counters', async ({ page }) => {
      const metricsSection = page.locator('[data-testid="impact-section"]');
      await expect(metricsSection).toBeVisible();
      
      // Wait for animations to complete
      await helpers.waitForAnimations('[data-testid="impact-section"]', 3000);
      
      await expect(metricsSection).toHaveScreenshot('impact-metrics-animated.png');
    });

    test('Metric card hover states', async ({ page }) => {
      const metricCard = page.locator('[data-testid="metric-card"]').first();
      await expect(metricCard).toBeVisible();
      
      await metricCard.hover();
      await page.waitForTimeout(300);
      
      await expect(metricCard).toHaveScreenshot('metric-card-hover.png');
    });

    test('Impact metrics filtering', async ({ page }) => {
      const metricsSection = page.locator('[data-testid="impact-section"]');
      const filterButton = page.locator('[data-testid="filter-button"]').first();
      
      // Click filter to change metrics display
      await filterButton.click();
      await page.waitForTimeout(500);
      
      await expect(metricsSection).toHaveScreenshot('impact-metrics-filtered.png');
    });
  });

  test.describe('Testimonials Section', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#testimonials');
      await page.waitForLoadState('networkidle');
    });

    test('Testimonials grid layout', async ({ page }) => {
      const testimonialsSection = page.locator('[data-testid="testimonials-section"]');
      await expect(testimonialsSection).toBeVisible();
      
      await helpers.waitForAnimations('[data-testid="testimonials-section"]');
      
      await expect(testimonialsSection).toHaveScreenshot('testimonials-grid.png');
    });

    test('Testimonial card interactions', async ({ page }) => {
      const testimonialCard = page.locator('[data-testid="testimonial-card"]').first();
      await expect(testimonialCard).toBeVisible();
      
      // Test hover state
      await testimonialCard.hover();
      await page.waitForTimeout(300);
      
      await expect(testimonialCard).toHaveScreenshot('testimonial-card-hover.png');
    });

    test('Testimonials carousel view', async ({ page }) => {
      const carouselToggle = page.locator('[data-testid="carousel-toggle"]');
      
      // Switch to carousel view
      await carouselToggle.click();
      await page.waitForTimeout(500);
      
      const testimonialsSection = page.locator('[data-testid="testimonials-section"]');
      await expect(testimonialsSection).toHaveScreenshot('testimonials-carousel.png');
    });
  });

  test.describe('Accessibility Visual Tests', () => {
    test('Focus indicators', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      await expect(focusedElement).toHaveScreenshot('focus-indicator.png');
    });

    test('High contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ forcedColors: 'active' });
      
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('high-contrast-mode.png', {
        fullPage: true
      });
    });

    test('Reduced motion preference', async ({ page }) => {
      // Simulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to animated section
      await page.goto('/#features');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('reduced-motion.png', {
        fullPage: true
      });
    });

    test('Text scaling', async ({ page }) => {
      // Test larger text size
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Increase font size via CSS
      await page.addStyleTag({
        content: 'body { font-size: 120%; }'
      });
      
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('text-scaling-large.png', {
        fullPage: true
      });
    });
  });

  test.describe('Performance Visual Tests', () => {
    test('Large dataset rendering', async ({ page }) => {
      await page.goto('/analytics');
      await page.waitForLoadState('networkidle');
      
      const dataGrid = page.locator('[data-testid="data-grid"]');
      await expect(dataGrid).toBeVisible();
      
      // Measure rendering time
      const startTime = Date.now();
      await dataGrid.waitFor({ state: 'visible' });
      const renderTime = Date.now() - startTime;
      
      // Take screenshot after rendering
      await expect(dataGrid).toHaveScreenshot('large-dataset-rendered.png');
      
      // Performance assertion
      expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds
      console.log(`Dataset render time: ${renderTime}ms`);
    });

    test('3D globe performance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const globe = page.locator('[data-testid="3d-globe"]');
      await expect(globe).toBeVisible();
      
      // Wait for globe to initialize
      await page.waitForTimeout(3000);
      
      // Check if globe is animating smoothly
      const initialFrame = await globe.screenshot();
      await page.waitForTimeout(200);
      const secondFrame = await globe.screenshot();
      
      // Frames should be different (indicating animation)
      expect(initialFrame).not.toEqual(secondFrame);
      
      await expect(globe).toHaveScreenshot('3d-globe-performance.png');
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test.describe(`${browserName} specific tests`, () => {
        test(`${browserName} - Homepage rendering`, async ({ page }) => {
          await page.setViewportSize({ width: 1920, height: 1080 });
          await page.waitForLoadState('networkidle');
          
          await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
            fullPage: true
          });
        });

        test(`${browserName} - Component interactions`, async ({ page }) => {
          const techCard = page.locator('[data-testid="tech-card"]').first();
          await expect(techCard).toBeVisible();
          
          await techCard.hover();
          await page.waitForTimeout(300);
          
          await expect(techCard).toHaveScreenshot(`tech-card-hover-${browserName}.png`);
        });
      });
    });
  });

  test.describe('Error State Visual Tests', () => {
    test('404 page', async ({ page }) => {
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('404-page.png', {
        fullPage: true
      });
    });

    test('Network error state', async ({ page }) => {
      // Simulate network error
      await page.route('**/*', route => route.abort());
      
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot('network-error.png', {
        fullPage: true
      });
    });
  });
});

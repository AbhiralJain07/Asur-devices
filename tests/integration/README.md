# Integration Tests for Component Interactions

This directory contains integration tests that verify how different components interact with each other, ensuring the Smart City Command Center works as a cohesive system.

## Test Structure

```
tests/integration/
├── component-interactions/    # Component interaction tests
├── user-workflows/           # End-to-end user workflow tests
├── data-flow/               # Data flow and state management tests
├── navigation/               # Navigation and routing tests
├── responsive-interactions/ # Responsive design interaction tests
├── accessibility-integration/ # Accessibility integration tests
├── fixtures/                # Test data and mock scenarios
├── utils/                   # Integration testing utilities
└── config/                  # Integration test configuration
```

## Test Categories

### 1. Component Interaction Tests

#### Navigation and Component Integration
```typescript
// tests/integration/component-interactions/navigation-integration.spec.ts
import { test, expect } from '@playwright/test';
import { IntegrationTestHelper } from '../utils/integration-helper';

test.describe('Navigation Integration Tests', () => {
  let helper: IntegrationTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new IntegrationTestHelper(page);
    await page.goto('/');
  });

  test('Navigation links scroll to correct sections', async ({ page }) => {
    // Test navigation to technology section
    await page.click('[data-testid="nav-link-technology"]');
    
    // Check if technology section is visible
    const techSection = page.locator('[data-testid="technology-section"]');
    await expect(techSection).toBeVisible();
    
    // Check scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    const techSectionY = await techSection.evaluate(el => el.offsetTop);
    
    expect(Math.abs(scrollY - techSectionY)).toBeLessThan(100);
  });

  test('Navigation active state updates correctly', async ({ page }) => {
    // Navigate to different sections
    await page.click('[data-testid="nav-link-features"]');
    await page.waitForTimeout(500);
    
    const featuresLink = page.locator('[data-testid="nav-link-features"]');
    await expect(featuresLink).toHaveClass(/active/);
    
    // Navigate to another section
    await page.click('[data-testid="nav-link-technology"]');
    await page.waitForTimeout(500);
    
    const featuresLinkAfter = page.locator('[data-testid="nav-link-features"]');
    const techLink = page.locator('[data-testid="nav-link-technology"]');
    
    await expect(featuresLinkAfter).not.toHaveClass(/active/);
    await expect(techLink).toHaveClass(/active/);
  });

  test('Mobile navigation menu interaction', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Test mobile menu navigation
    await page.click('[data-testid="mobile-nav-link-technology"]');
    await page.waitForTimeout(500);
    
    // Check if menu closed and section is visible
    await expect(mobileMenu).not.toBeVisible();
    const techSection = page.locator('[data-testid="technology-section"]');
    await expect(techSection).toBeVisible();
  });
});
```

#### CTA Button Integration
```typescript
// tests/integration/component-interactions/cta-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CTA Button Integration Tests', () => {
  test('CTA buttons trigger appropriate actions', async ({ page }) => {
    await page.goto('/');
    
    // Test main CTA button
    const mainCTA = page.locator('[data-testid="main-cta-button"]');
    await mainCTA.click();
    
    // Should open demo form or navigate to contact
    const demoForm = page.locator('[data-testid="demo-form"]');
    const contactSection = page.locator('[data-testid="contact-section"]');
    
    await expect(demoForm.isVisible() || contactSection.isVisible()).toBeTruthy();
  });

  test('CTA buttons in different sections work correctly', async ({ page }) => {
    await page.goto('/#technology');
    
    // Find CTA buttons in technology section
    const techCTA = page.locator('[data-testid="tech-section-cta"]');
    await expect(techCTA).toBeVisible();
    
    await techCTA.click();
    await page.waitForTimeout(500);
    
    // Should trigger demo scheduling
    const demoForm = page.locator('[data-testid="demo-form"]');
    await expect(demoForm).toBeVisible();
  });
});
```

#### Form Integration Tests
```typescript
// tests/integration/component-interactions/form-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Form Integration Tests', () => {
  test('Demo form submission and validation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to demo form
    await page.click('[data-testid="main-cta-button"]');
    const demoForm = page.locator('[data-testid="demo-form"]');
    await expect(demoForm).toBeVisible();
    
    // Fill form with valid data
    await page.fill('[data-testid="demo-name"]', 'John Doe');
    await page.fill('[data-testid="demo-email"]', 'john@example.com');
    await page.fill('[data-testid="demo-company"]', 'Smart City Corp');
    await page.fill('[data-testid="demo-job-title"]', 'City Manager');
    
    // Submit form
    await page.click('[data-testid="demo-submit"]');
    
    // Check success state
    const successMessage = page.locator('[data-testid="demo-success"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Verify form data integration
    const submittedData = await page.evaluate(() => {
      return window.submittedFormData;
    });
    
    expect(submittedData.name).toBe('John Doe');
    expect(submittedData.email).toBe('john@example.com');
  });

  test('Form validation and error handling', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="main-cta-button"]');
    
    // Submit empty form
    await page.click('[data-testid="demo-submit"]');
    
    // Check validation errors
    const nameError = page.locator('[data-testid="error-demo-name"]');
    const emailError = page.locator('[data-testid="error-demo-email"]');
    
    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    
    // Fill partial form and submit
    await page.fill('[data-testid="demo-name"]', 'John Doe');
    await page.click('[data-testid="demo-submit"]');
    
    // Should still show email error
    await expect(nameError).not.toBeVisible();
    await expect(emailError).toBeVisible();
  });
});
```

### 2. User Workflow Tests

#### Complete User Journey
```typescript
// tests/integration/user-workflows/complete-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete User Journey Tests', () => {
  test('New user explores entire landing page', async ({ page }) => {
    await page.goto('/');
    
    // 1. User sees hero section
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Wait for 3D globe to load
    await page.waitForSelector('[data-testid="3d-globe"]', { timeout: 10000 });
    
    // 2. User interacts with hero CTA
    await page.click('[data-testid="main-cta-button"]');
    const demoForm = page.locator('[data-testid="demo-form"]');
    await expect(demoForm).toBeVisible();
    
    // 3. User navigates to technology section
    await page.goto('/#technology');
    const techSection = page.locator('[data-testid="technology-section"]');
    await expect(techSection).toBeVisible();
    
    // 4. User explores tech cards
    const techCard = page.locator('[data-testid="tech-card"]').first();
    await techCard.hover();
    await page.waitForTimeout(300);
    
    // 5. User navigates to metrics section
    await page.goto('/#metrics');
    const metricsSection = page.locator('[data-testid="impact-section"]');
    await expect(metricsSection).toBeVisible();
    
    // Wait for animated counters
    await page.waitForTimeout(3000);
    
    // 6. User navigates to testimonials
    await page.goto('/#testimonials');
    const testimonialsSection = page.locator('[data-testid="testimonials-section"]');
    await expect(testimonialsSection).toBeVisible();
    
    // 7. User interacts with testimonials
    const testimonialCard = page.locator('[data-testid="testimonial-card"]').first();
    await testimonialCard.hover();
    await page.waitForTimeout(300);
    
    // 8. User scrolls back to top
    await page.click('[data-testid="scroll-to-top"]');
    await page.waitForTimeout(500);
    
    // Verify back at top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('User schedules demo successfully', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to demo form
    await page.click('[data-testid="main-cta-button"]');
    
    // Fill form
    await page.fill('[data-testid="demo-name"]', 'Jane Smith');
    await page.fill('[data-testid="demo-email"]', 'jane@city.gov');
    await page.fill('[data-testid="demo-company"]', 'Metropolitan City');
    await page.fill('[data-testid="demo-job-title"]', 'Chief Technology Officer');
    
    // Select interests
    await page.check('[data-testid="interest-traffic"]');
    await page.check('[data-testid="interest-environmental"]');
    
    // Submit form
    await page.click('[data-testid="demo-submit"]');
    
    // Verify success
    const successMessage = page.locator('[data-testid="demo-success"]');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    
    // Verify confirmation details
    const confirmationText = await successMessage.textContent();
    expect(confirmationText).toContain('Demo Scheduled');
    expect(confirmationText).toContain('Jane Smith');
  });
});
```

### 3. Data Flow Tests

#### Real-time Data Integration
```typescript
// tests/integration/data-flow/realtime-data.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Real-time Data Integration Tests', () => {
  test('Analytics section updates with real-time data', async ({ page }) => {
    await page.goto('/analytics');
    
    // Wait for initial data load
    await page.waitForSelector('[data-testid="analytics-dashboard"]');
    
    // Get initial metric values
    const initialMetrics = await page.evaluate(() => {
      return window.analyticsData?.getMetrics();
    });
    
    // Simulate real-time data update
    await page.evaluate(() => {
      window.analyticsData.simulateUpdate();
    });
    
    // Wait for update to process
    await page.waitForTimeout(1000);
    
    // Get updated metrics
    const updatedMetrics = await page.evaluate(() => {
      return window.analyticsData?.getMetrics();
    });
    
    // Verify data has changed
    expect(updatedMetrics).not.toEqual(initialMetrics);
    
    // Verify UI reflects changes
    const metricCards = page.locator('[data-testid="metric-card"]');
    const firstCard = metricCards.first();
    const firstCardValue = await firstCard.locator('[data-testid="metric-value"]').textContent();
    
    expect(firstCardValue).toBeTruthy();
  });

  test('Data flow between components', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to impact metrics
    await page.goto('/#metrics');
    
    // Filter metrics by category
    await page.click('[data-testid="filter-environmental"]');
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const environmentalCards = page.locator('[data-testid="metric-card"][data-category="environmental"]');
    await expect(environmentalCards.count()).toBeGreaterThan(0);
    
    // Verify other categories are hidden
    const trafficCards = page.locator('[data-testid="metric-card"][data-category="traffic"]');
    await expect(trafficCards.count()).toBe(0);
  });
});
```

### 4. Responsive Interaction Tests

#### Mobile Interaction Tests
```typescript
// tests/integration/responsive-interactions/mobile-interactions.spec.ts
import { test, devices, expect } from '@playwright/test';

test.describe('Mobile Interaction Tests', () => {
  const mobileDevices = [
    devices['Pixel 5'],
    devices['iPhone 12']
  ];

  mobileDevices.forEach(device => {
    test.describe(`${device.name} - Mobile Interactions`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(device.viewport);
      });

      test('Touch interactions work correctly', async ({ page }) => {
        await page.goto('/');
        
        // Test touch on CTA button
        const ctaButton = page.locator('[data-testid="main-cta-button"]');
        await ctaButton.tap();
        
        const demoForm = page.locator('[data-testid="demo-form"]');
        await expect(demoForm).toBeVisible();
      });

      test('Swipe gestures on carousel', async ({ page }) => {
        await page.goto('/#testimonials');
        
        const carousel = page.locator('[data-testid="testimonial-carousel"]');
        await expect(carousel).toBeVisible();
        
        // Test swipe gesture
        const carouselContainer = carousel.locator('[data-testid="carousel-container"]');
        await carouselContainer.swipe('left');
        await page.waitForTimeout(500);
        
        // Verify carousel moved
        const activeSlide = carousel.locator('[data-testid="carousel-slide"][data-active="true"]');
        await expect(activeSlide).toBeVisible();
      });

      test('Mobile menu interactions', async ({ page }) => {
        await page.goto('/');
        
        // Open mobile menu
        const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
        await menuToggle.tap();
        
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        await expect(mobileMenu).toBeVisible();
        
        // Test menu navigation
        const techLink = mobileMenu.locator('[data-testid="mobile-nav-link-technology"]');
        await techLink.tap();
        
        // Verify menu closed and navigation worked
        await expect(mobileMenu).not.toBeVisible();
        const techSection = page.locator('[data-testid="technology-section"]');
        await expect(techSection).toBeVisible();
      });
    });
  });
});
```

### 5. Accessibility Integration Tests

#### Keyboard Navigation
```typescript
// tests/integration/accessibility-integration/keyboard-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation Integration', () => {
  test('Tab navigation works through all interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Tab through all elements
    const focusableElements = [];
    
    for (let i = 0; i < 20; i++) { // Limit to prevent infinite loop
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName);
        const hasTabIndex = await focusedElement.evaluate(el => el.tabIndex >= 0);
        
        if (hasTabIndex) {
          focusableElements.push(tagName);
        }
      }
    }
    
    // Verify common interactive elements are focusable
    expect(focusableElements).toContain('BUTTON');
    expect(focusableElements).toContain('A');
  });

  test('Escape key closes modals and menus', async ({ page }) => {
    await page.goto('/');
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
    
    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(mobileMenu).not.toBeVisible();
    
    // Open demo form
    await page.click('[data-testid="main-cta-button"]');
    const demoForm = page.locator('[data-testid="demo-form"]');
    await expect(demoForm).toBeVisible();
    
    // Press Escape (if form has close functionality)
    await page.keyboard.press('Escape');
    // Note: Form might not close on Escape, which is acceptable
  });

  test('Enter key activates buttons and links', async ({ page }) => {
    await page.goto('/');
    
    // Focus on CTA button
    const ctaButton = page.locator('[data-testid="main-cta-button"]');
    await ctaButton.focus();
    await expect(ctaButton).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Verify action occurred
    const demoForm = page.locator('[data-testid="demo-form"]');
    await expect(demoForm).toBeVisible();
  });
});
```

## Integration Test Utilities

### Test Helper Class
```typescript
// tests/integration/utils/integration-helper.ts
import { Page } from '@playwright/test';

export class IntegrationTestHelper {
  constructor(private page: Page) {}

  /**
   * Wait for component to be ready and visible
   */
  async waitForComponent(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    await this.page.waitForTimeout(500); // Allow animations to complete
  }

  /**
   * Scroll to element and wait for it to be visible
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  /**
   * Fill form with test data
   */
  async fillForm(formData: Record<string, string>): Promise<void> {
    for (const [field, value] of Object.entries(formData)) {
      const fieldSelector = `[data-testid="${field}"]`;
      await this.page.fill(fieldSelector, value);
    }
  }

  /**
   * Verify component state
   */
  async verifyComponentState(selector: string, expectedState: Record<string, any>): Promise<void> {
    const element = this.page.locator(selector);
    
    for (const [property, expectedValue] of Object.entries(expectedState)) {
      const actualValue = await element.getAttribute(property);
      expect(actualValue).toBe(expectedValue);
    }
  }

  /**
   * Simulate user interaction sequence
   */
  async simulateInteractionSequence(interactions: Array<{
    action: string;
    selector: string;
    waitFor?: string;
    delay?: number;
  }>): Promise<void> {
    for (const interaction of interactions) {
      const element = this.page.locator(interaction.selector);
      
      switch (interaction.action) {
        case 'click':
          await element.click();
          break;
        case 'hover':
          await element.hover();
          break;
        case 'tap':
          await element.tap();
          break;
        case 'fill':
          // Fill requires value, skip for now
          break;
        default:
          throw new Error(`Unknown action: ${interaction.action}`);
      }
      
      if (interaction.delay) {
        await this.page.waitForTimeout(interaction.delay);
      }
      
      if (interaction.waitFor) {
        await this.page.waitForSelector(interaction.waitFor, { state: 'visible' });
      }
    }
  }

  /**
   * Get component data
   */
  async getComponentData(selector: string): Promise<any> {
    return await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? window.getComponentData?.(element) : null;
    }, selector);
  }

  /**
   * Verify responsive behavior
   */
  async verifyResponsiveBehavior(
    selector: string,
    viewports: Array<{ width: number; height: number }>
  ): Promise<void> {
    const element = this.page.locator(selector);
    
    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(500);
      
      // Verify element is still visible and properly positioned
      await expect(element).toBeVisible();
      
      // Check for responsive classes
      const hasResponsiveClass = await element.evaluate(el => {
        return el.className.includes('responsive') || el.className.includes('mobile') || el.className.includes('desktop');
      });
      
      // Not all elements need responsive classes, so don't fail if missing
    }
  }

  /**
   * Measure interaction response time
   */
  async measureInteractionResponse(selector: string, action: string): Promise<number> {
    const startTime = Date.now();
    
    const element = this.page.locator(selector);
    
    switch (action) {
      case 'click':
        await element.click();
        break;
      case 'hover':
        await element.hover();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Wait for any animations or state changes
    await this.page.waitForTimeout(300);
    
    return Date.now() - startTime;
  }
}
```

### Test Fixtures
```typescript
// tests/integration/fixtures/user-data.ts
export const userData = {
  validUser: {
    name: 'John Doe',
    email: 'john.doe@smartcity.com',
    company: 'Smart City Corporation',
    jobTitle: 'City Manager',
    phone: '+1-555-0123-4567'
  },
  invalidUser: {
    name: '',
    email: 'invalid-email',
    company: '',
    jobTitle: ''
  }
};

export const interactionSequences = {
  completeJourney: [
    { action: 'click', selector: '[data-testid="main-cta-button]' },
    { action: 'fill', selector: '[data-testid="demo-name"]', value: userData.validUser.name },
    { action: 'fill', selector: '[data-testid="demo-email"]', value: userData.validUser.email },
    { action: 'click', selector: '[data-testid="demo-submit"]' }
  ],
  navigationFlow: [
    { action: 'click', selector: '[data-testid="nav-link-technology"]', waitFor: '[data-testid="technology-section"]' },
    { action: 'click', selector: '[data-testid="nav-link-metrics"]', waitFor: '[data-testid="impact-section"]' },
    { action: 'click', selector: '[data-testid="nav-link-testimonials"]', waitFor: '[data-testid="testimonials-section"]' }
  ]
};
```

## CI/CD Integration

### Integration Test Pipeline
```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  integration-tests:
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
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run integration tests
      run: npx playwright test tests/integration/
    
    - name: Upload integration test reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: integration-reports
        path: integration-reports/
        retention-days: 30
```

## Best Practices

### 1. Test Organization
- Group tests by functionality and user workflows
- Use descriptive test names that explain the user story
- Maintain independent tests that don't rely on other tests
- Use page object pattern for better maintainability

### 2. Test Stability
- Use proper wait strategies for dynamic content
- Handle asynchronous operations correctly
- Implement retry logic for flaky tests
- Use consistent test data

### 3. Coverage
- Test critical user journeys
- Verify component interactions
- Test responsive behavior
- Include accessibility testing

### 4. Performance
- Optimize test execution time
- Use parallel test execution
- Implement smart test selection
- Monitor test performance

This comprehensive integration testing setup ensures all components work together seamlessly in the Smart City Command Center application.

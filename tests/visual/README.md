# Visual Regression Tests Setup

This directory contains visual regression tests for the Smart City Command Center landing page to ensure UI consistency across different browsers, devices, and screen sizes.

## Test Structure

```
tests/visual/
├── components/           # Component-level tests
├── sections/            # Section-level tests
├── pages/               # Page-level tests
├── responsive/          # Responsive design tests
├── accessibility/       # Accessibility visual tests
├── fixtures/            # Test data and mock data
├── screenshots/         # Baseline and comparison screenshots
├── config/              # Test configuration
└── utils/               # Test utilities
```

## Testing Tools

### 1. Playwright for Visual Testing
- Cross-browser visual testing
- Responsive design testing
- Accessibility testing
- Performance testing

### 2. Storybook for Component Testing
- Component isolation testing
- Visual component documentation
- Interactive component testing
- Design system validation

### 3. Chromatic for Visual Regression
- Automated visual diff testing
- CI/CD integration
- Browser compatibility testing
- Review workflow integration

## Configuration Files

### Playwright Configuration
```typescript
// tests/visual/config/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Storybook Configuration
```typescript
// tests/visual/config/storybook.main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-viewport',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
```

## Test Categories

### 1. Component Tests

#### Button Components
```typescript
// tests/visual/components/CTAButton.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CTAButton Visual Tests', () => {
  const variants = ['primary', 'secondary', 'outline', 'ghost'];
  const sizes = ['small', 'medium', 'large'];
  const states = ['default', 'hover', 'active', 'disabled'];

  variants.forEach(variant => {
    sizes.forEach(size => {
      test(`CTAButton - ${variant} - ${size}`, async ({ page }) => {
        await page.goto('/components/buttons');
        
        const button = page.locator(`[data-testid="cta-button-${variant}-${size}"]`);
        await expect(button).toBeVisible();
        
        // Take baseline screenshot
        await expect(button).toHaveScreenshot(`cta-button-${variant}-${size}.png`);
      });
    });
  });

  test('CTAButton loading state', async ({ page }) => {
    await page.goto('/components/buttons');
    
    const loadingButton = page.locator('[data-testid="cta-button-loading"]');
    await expect(loadingButton).toBeVisible();
    
    await expect(loadingButton).toHaveScreenshot('cta-button-loading.png');
  });
});
```

#### Metric Display Components
```typescript
// tests/visual/components/MetricDisplay.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MetricDisplay Visual Tests', () => {
  test('MetricCard with animation', async ({ page }) => {
    await page.goto('/components/metrics');
    
    const metricCard = page.locator('[data-testid="metric-card"]');
    await expect(metricCard).toBeVisible();
    
    // Wait for animation to complete
    await page.waitForTimeout(1000);
    
    await expect(metricCard).toHaveScreenshot('metric-card-animated.png');
  });

  test('MetricCard responsive design', async ({ page }) => {
    await page.goto('/components/metrics');
    
    const metricCard = page.locator('[data-testid="metric-card"]');
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(metricCard).toHaveScreenshot(`metric-card-${viewport.width}x${viewport.height}.png`);
    }
  });
});
```

### 2. Section Tests

#### Hero Section
```typescript
// tests/visual/sections/HeroSection.spec.ts
import { test, expect } from '@playwright/test';

test.describe('HeroSection Visual Tests', () => {
  test('HeroSection with 3D globe', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Wait for 3D globe to load
    await page.waitForSelector('[data-testid="3d-globe"]');
    await page.waitForTimeout(2000);
    
    await expect(heroSection).toHaveScreenshot('hero-section-with-globe.png');
  });

  test('HeroSection responsive behavior', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('[data-testid="hero-section"]');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(heroSection).toHaveScreenshot('hero-section-mobile.png');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heroSection).toHaveScreenshot('hero-section-tablet.png');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(heroSection).toHaveScreenshot('hero-section-desktop.png');
  });
});
```

#### Technology Stack Section
```typescript
// tests/visual/sections/TechnologyStack.spec.ts
import { test, expect } from '@playwright/test';

test.describe('TechnologyStack Visual Tests', () => {
  test('Technology stack cards layout', async ({ page }) => {
    await page.goto('/#technology');
    
    const techSection = page.locator('[data-testid="technology-section"]');
    await expect(techSection).toBeVisible();
    
    // Scroll to section
    await techSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await expect(techSection).toHaveScreenshot('technology-stack-section.png');
  });

  test('Tech card interactions', async ({ page }) => {
    await page.goto('/#technology');
    
    const techCard = page.locator('[data-testid="tech-card"]').first();
    await expect(techCard).toBeVisible();
    
    // Test hover state
    await techCard.hover();
    await expect(techCard).toHaveScreenshot('tech-card-hover.png');
    
    // Test expanded state
    await techCard.click();
    await page.waitForTimeout(300);
    await expect(techCard).toHaveScreenshot('tech-card-expanded.png');
  });
});
```

### 3. Responsive Design Tests

```typescript
// tests/visual/responsive/ResponsiveLayout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Responsive Layout Tests', () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'ultrawide', width: 2560, height: 1440 }
  ];

  breakpoints.forEach(breakpoint => {
    test(`Layout - ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, async ({ page }) => {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot(`layout-${breakpoint.name}.png`, {
        fullPage: true
      });
    });
  });

  test('Navigation responsive behavior', async ({ page }) => {
    await page.goto('/');
    
    const navigation = page.locator('[data-testid="navigation"]');
    
    // Mobile - hamburger menu
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(navigation).toHaveScreenshot('navigation-mobile.png');
    
    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-toggle"]').click();
    await expect(navigation).toHaveScreenshot('navigation-mobile-open.png');
    
    // Desktop - full navigation
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(navigation).toHaveScreenshot('navigation-desktop.png');
  });
});
```

### 4. Accessibility Visual Tests

```typescript
// tests/visual/accessibility/Accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility Visual Tests', () => {
  test('Focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    await expect(focusedElement).toHaveScreenshot('focus-indicator.png');
  });

  test('High contrast mode', async ({ page }) => {
    await page.goto('/');
    
    // Simulate high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    
    await expect(page).toHaveScreenshot('high-contrast-mode.png', {
      fullPage: true
    });
  });

  test('Reduced motion', async ({ page }) => {
    await page.goto('/');
    
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Navigate to animated section
    await page.goto('/#features');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('reduced-motion.png', {
      fullPage: true
    });
  });
});
```

### 5. Performance Visual Tests

```typescript
// tests/visual/performance/Performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Visual Tests', () => {
  test('Large dataset rendering', async ({ page }) => {
    await page.goto('/analytics');
    
    const dataGrid = page.locator('[data-testid="data-grid"]');
    await expect(dataGrid).toBeVisible();
    
    // Measure rendering time
    const startTime = Date.now();
    await dataGrid.waitFor({ state: 'visible' });
    const renderTime = Date.now() - startTime;
    
    // Take screenshot after rendering
    await expect(dataGrid).toHaveScreenshot('large-dataset-rendered.png');
    
    // Log performance metric
    console.log(`Dataset render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(1000); // Should render within 1 second
  });

  test('3D globe performance', async ({ page }) => {
    await page.goto('/');
    
    const globe = page.locator('[data-testid="3d-globe"]');
    await expect(globe).toBeVisible();
    
    // Wait for globe to initialize
    await page.waitForTimeout(2000);
    
    // Check if globe is animating smoothly
    const initialFrame = await globe.screenshot();
    await page.waitForTimeout(100);
    const secondFrame = await globe.screenshot();
    
    // Frames should be different (indicating animation)
    expect(initialFrame).not.toEqual(secondFrame);
    
    await expect(globe).toHaveScreenshot('3d-globe-performance.png');
  });
});
```

## Test Utilities

### Visual Test Helpers
```typescript
// tests/visual/utils/visual-helpers.ts
import { Page, expect } from '@playwright/test';

export class VisualTestHelpers {
  constructor(private page: Page) {}

  async waitForAnimations(selector: string, timeout = 2000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    
    // Wait for CSS animations to complete
    await this.page.waitForTimeout(timeout);
  }

  async takeResponsiveScreenshot(
    selector: string,
    name: string,
    viewports: Array<{ width: number; height: number }>
  ): Promise<void> {
    const element = this.page.locator(selector);
    
    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await element.scrollIntoViewIfNeeded();
      await this.waitForAnimations(selector);
      
      await expect(element).toHaveScreenshot(`${name}-${viewport.width}x${viewport.height}.png`);
    }
  }

  async takeScreenshotWithStates(
    selector: string,
    name: string,
    states: string[]
  ): Promise<void> {
    const element = this.page.locator(selector);
    
    for (const state of states) {
      switch (state) {
        case 'hover':
          await element.hover();
          break;
        case 'focus':
          await element.focus();
          break;
        case 'active':
          await element.click();
          break;
        case 'disabled':
          await element.evaluate((el) => (el as HTMLElement).disabled = true);
          break;
      }
      
      await this.page.waitForTimeout(300);
      await expect(element).toHaveScreenshot(`${name}-${state}.png`);
      
      // Reset state
      await this.page.mouse.move(0, 0);
      await this.page.keyboard.press('Escape');
    }
  }

  async compareScreenshots(
    baseline: string,
    current: string,
    threshold = 0.1
  ): Promise<boolean> {
    // This would integrate with a visual diff library
    // For now, we'll use Playwright's built-in comparison
    return true;
  }

  async generateAccessibilityReport(): Promise<void> {
    // Generate accessibility audit report
    const accessibilityScanResults = await this.page.accessibility.snapshot();
    
    // Save results for analysis
    await this.page.evaluate((results) => {
      console.log('Accessibility Scan Results:', results);
    }, accessibilityScanResults);
  }
}
```

### Test Data Fixtures
```typescript
// tests/visual/fixtures/test-data.ts
export const testMetrics = [
  {
    id: 'test-metric-1',
    title: 'Energy Efficiency',
    currentValue: 85,
    targetValue: 100,
    unit: '%',
    trend: 'up',
    change: 12.5,
    color: '#00D9FF',
    icon: '⚡'
  },
  {
    id: 'test-metric-2',
    title: 'Waste Reduction',
    currentValue: 67,
    targetValue: 80,
    unit: '%',
    trend: 'up',
    change: 8.3,
    color: '#10B981',
    icon: '♻️'
  }
];

export const testTestimonials = [
  {
    id: 'test-testimonial-1',
    customer: {
      name: 'John Doe',
      title: 'City Manager',
      company: { name: 'Smart City Corp' }
    },
    testimonial: {
      quote: 'This platform transformed our city operations.',
      rating: { overall: 5 }
    }
  }
];

export const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 }
];
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  visual-tests:
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
    
    - name: Run visual tests
      run: npx playwright test tests/visual
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    
    - name: Upload screenshots
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: screenshots
        path: tests/visual/screenshots/
        retention-days: 30
```

### Chromatic Integration
```yaml
# .github/workflows/chromatic.yml
name: Chromatic Visual Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run Chromatic
      uses: chromaui/action@v1
      with:
        projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
        buildScriptName: build-storybook
```

## Test Execution

### Running Tests Locally
```bash
# Install dependencies
npm install

# Run all visual tests
npm run test:visual

# Run specific test suite
npx playwright test tests/visual/components/

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests with UI mode
npx playwright test --ui

# Run tests with debugging
npx playwright test --debug
```

### Updating Baselines
```bash
# Update all failing screenshots
npx playwright test --update-snapshots

# Update specific test screenshots
npx playwright test tests/visual/components/CTAButton.spec.ts --update-snapshots
```

### Test Reports
```bash
# Generate HTML report
npx playwright show-report

# Generate JSON report
npx playwright test --reporter=json

# Generate JUnit report
npx playwright test --reporter=junit
```

## Best Practices

### 1. Test Organization
- Group tests by component/section
- Use descriptive test names
- Maintain consistent test structure
- Use data-driven testing where appropriate

### 2. Screenshot Management
- Use meaningful screenshot names
- Include viewport size in filename
- Separate baseline from test screenshots
- Regular cleanup of old screenshots

### 3. Test Stability
- Use proper wait strategies
- Handle dynamic content appropriately
- Implement retry logic for flaky tests
- Use consistent test data

### 4. Performance Considerations
- Optimize test execution time
- Use parallel test execution
- Implement smart test selection
- Monitor test performance metrics

### 5. Maintenance
- Regular review of test coverage
- Update tests with UI changes
- Monitor test failure rates
- Keep documentation up to date

## Troubleshooting

### Common Issues
1. **Flaky Tests**: Increase wait times or use more specific selectors
2. **Screenshot Differences**: Check for dynamic content or timing issues
3. **Performance Issues**: Optimize test data or use mocking
4. **Browser Compatibility**: Use browser-specific selectors or polyfills

### Debugging Tools
- Playwright Inspector for step-by-step debugging
- Browser DevTools for element inspection
- Network tab for performance analysis
- Console for error logging

This comprehensive visual regression testing setup ensures UI consistency and quality across the Smart City Command Center application.

import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression tests
 * Supports multiple browsers, viewports, and devices
 */
export default defineConfig({
  // Test directory
  testDir: './tests/visual',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line'],
    ['list']
  ],
  
  // Global settings for all tests
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot only on failure
    screenshot: 'only-on-failure',
    
    // Record video only on failure
    video: 'retain-on-failure',
    
    // Global timeout for each action
    actionTimeout: 10000,
    
    // Global timeout for navigation
    navigationTimeout: 30000,
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // User agent
    userAgent: 'Smart City Command Center Visual Tests',
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
    
    // Color scheme
    colorScheme: 'dark',
    
    // Reduced motion
    reducedMotion: 'reduce',
    
    // Forced colors
    forcedColors: 'none'
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Custom Chrome settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox'
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Custom Firefox settings
        launchOptions: {
          firefoxUserPrefs: {
            'security.fileuri.strict_origin_policy': false,
            'security.fileuri.strict_origin_policy': false
          }
        }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Custom Safari settings
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ]
        }
      },
    },
    
    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific settings
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2.625,
        hasTouch: true,
        isMobile: true
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        // Mobile-specific settings
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true
      },
    },
    
    // Tablet browsers
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        // Tablet-specific settings
        viewport: { width: 1024, height: 1366 },
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: false
      },
    },
    
    // Desktop with different viewports
    {
      name: 'Desktop Small',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 }
      },
    },
    {
      name: 'Desktop Large',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Desktop UltraWide',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 2560, height: 1440 }
      },
    }
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes
  },

  // Global setup and teardown
  globalSetup: './tests/visual/global-setup.ts',
  globalTeardown: './tests/visual/global-teardown.ts',

  // Test timeout
  timeout: 60000, // 60 seconds

  // Output directory
  outputDir: 'test-results/',

  // Test ignore patterns
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**'
  ],

  // Test match patterns
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  // Environment variables
  env: {
    NODE_ENV: 'test',
    VISUAL_TESTING: 'true',
    BASE_URL: 'http://localhost:3000'
  },

  // Metadata
  metadata: {
    'test-process': 'visual-regression',
    'test-type': 'e2e',
    'automation': 'playwright'
  }
});

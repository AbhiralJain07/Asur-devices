# Code Cleanup and TypeScript Strict Compliance

This document outlines the code cleanup process and TypeScript strict compliance measures for the Smart City Command Center project.

## TypeScript Configuration

### Strict Mode Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false
  }
}
```

## Code Cleanup Checklist

### 1. Import Statements
- [ ] Remove unused imports
- [ ] Use type-only imports where appropriate
- [ ] Group imports logically
- [ ] Use consistent import paths

### 2. Type Definitions
- [ ] Add explicit return types to functions
- [ ] Use proper TypeScript types
- [ ] Avoid `any` type usage
- [ ] Use generic types where appropriate

### 3. Component Props
- [ ] Define interfaces for all props
- [ ] Use proper default values
- [ ] Add JSDoc comments for complex props
- [ ] Use discriminated unions for variant types

### 4. State Management
- [ ] Use proper typing for useState
- [ ] Add types for context values
- [ ] Use proper typing for reducers
- [ ] Avoid type assertions

### 5. Event Handlers
- [ ] Use proper event types
- [ ] Add typing for event parameters
- [ ] Use proper form event types
- [ ] Handle custom events properly

### 6. Async Operations
- [ ] Use proper Promise typing
- [ ] Handle error types correctly
- [ ] Use async/await consistently
- [ ] Add proper error boundaries

### 7. CSS and Styling
- [ ] Use CSS-in-JS with proper typing
- [ ] Avoid inline styles when possible
- [ ] Use proper TailwindCSS classes
- [ ] Maintain consistent naming conventions

## Cleanup Scripts

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Type Safety Improvements

### 1. Strict Component Props
```typescript
// Before
interface ButtonProps {
  onClick?: (e: any) => void;
  children?: any;
}

// After
interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}
```

### 2. Generic Components
```typescript
// Before
interface ListProps {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}

// After
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

### 3. Discriminated Unions
```typescript
// Before
type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  variant?: ButtonVariant;
  color?: string;
}

// After
type ButtonVariant = 
  | { type: "primary"; color?: never }
  | { type: "secondary"; color?: never }
  | { type: "outline"; color: string };

interface ButtonProps {
  variant: ButtonVariant;
}
```

### 4. Strict Event Handling
```typescript
// Before
const handleClick = (e: any) => {
  console.log(e.target.value);
};

// After
const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);
};
```

## Performance Optimizations

### 1. React.memo Usage
```typescript
// Before
export default function MetricCard({ metric }: { metric: ImpactMetrics }) {
  return <div>{metric.title}</div>;
}

// After
export default React.memo(function MetricCard({ metric }: { metric: ImpactMetrics }) {
  return <div>{metric.title}</div>;
});
```

### 2. useCallback and useMemo
```typescript
// Before
const Component = ({ items, filter }) => {
  const filteredItems = items.filter(filter);
  return <List items={filteredItems} />;
};

// After
const Component = ({ items, filter }) => {
  const filteredItems = useMemo(() => items.filter(filter), [items, filter]);
  return <List items={filteredItems} />;
};
```

### 3. Proper Dependency Arrays
```typescript
// Before
useEffect(() => {
  fetchData();
}, [props.id, props.category]); // May cause unnecessary re-runs

// After
useEffect(() => {
  fetchData();
}, [props.id, props.category]); // Only re-run when dependencies change
```

## File Structure Standards

### 1. Component Files
```
ComponentName.tsx
├── ComponentName.tsx          # Main component
├── ComponentName.styles.ts      # Styles (if needed)
├── ComponentName.test.tsx      # Tests
├── ComponentName.stories.tsx   # Stories (if using Storybook)
└── index.ts                    # Exports
```

### 2. Type Files
```
types/
├── index.ts                    # Main exports
├── dashboard.ts               # Dashboard types
├── impactMetrics.ts           # Impact metrics types
├── testimonials.ts            # Testimonial types
└── common.ts                  # Common types
```

### 3. Utility Files
```
utils/
├── index.ts                   # Main exports
├── formatters.ts              # Data formatting utilities
├── validators.ts              # Validation utilities
└── helpers.ts                 # Helper functions
```

## Naming Conventions

### 1. Components
- Use PascalCase for component names
- Use descriptive names that indicate purpose
- Avoid abbreviations unless widely understood

### 2. Functions and Variables
- Use camelCase for functions and variables
- Use descriptive names that indicate purpose
- Use verbs for function names

### 3. Types and Interfaces
- Use PascalCase for type names
- Use descriptive names that indicate what they represent
- Use "Props" suffix for component prop interfaces

### 4. Constants
- Use UPPER_SNAKE_CASE for constants
- Group related constants in objects
- Export constants from dedicated files

## Error Handling Standards

### 1. Type-Safe Error Handling
```typescript
// Before
try {
  const data = await fetchData();
} catch (error) {
  console.log(error);
}

// After
try {
  const data = await fetchData();
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### 2. Result Types
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeFetchData(): Promise<Result<Data>> {
  try {
    const data = await fetchData();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Testing Standards

### 1. Type-Safe Testing
```typescript
// Before
test('renders correctly', () => {
  const component = render(<Component />);
  expect(component).toBeTruthy();
});

// After
test('renders correctly with props', () => {
  const props: ComponentProps = {
    title: 'Test Title',
    onClick: jest.fn(),
  };
  const { getByRole } = render(<Component {...props} />);
  expect(getByRole('heading')).toHaveTextContent('Test Title');
});
```

### 2. Mock Types
```typescript
// Create proper mock types
type MockComponentProps = ComponentProps & {
  onClick: jest.MockedFunction<(e: React.MouseEvent) => void>;
};

const createMockProps = (): MockComponentProps => ({
  title: 'Test Title',
  onClick: jest.fn(),
});
```

## Documentation Standards

### 1. JSDoc Comments
```typescript
/**
 * Renders a metric card with animated counter
 * @param props - Component props
 * @param props.metric - The metric data to display
 * @param props.showTrend - Whether to show trend indicator
 * @param props.onClick - Optional click handler
 * @returns JSX element
 * @example
 * <MetricCard 
 *   metric={impactMetric} 
 *   showTrend={true}
 *   onClick={handleClick}
 * />
 */
export function MetricCard({
  metric,
  showTrend = false,
  onClick,
}: MetricCardProps): JSX.Element {
  // Component implementation
}
```

### 2. Type Documentation
```typescript
/**
 * Represents an impact metric with various properties
 */
export interface ImpactMetrics {
  /** Unique identifier for the metric */
  id: string;
  /** Category of the metric (e.g., 'environmental', 'economic') */
  category: MetricCategory;
  /** Current value of the metric */
  currentValue: number;
  /** Target value for the metric */
  targetValue: number;
  /** Unit of measurement */
  unit: string;
  /** Trend direction ('up', 'down', 'stable') */
  trend: MetricTrend;
  /** Percentage change from previous period */
  change: number;
  /** Time period for the change */
  changePeriod: string;
  /** Icon representation */
  icon: string;
  /** Color for visualization */
  color: string;
  /** Whether animation is enabled */
  isAnimated: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Number of decimal places to display */
  precision?: number;
  /** Prefix for display (e.g., '$') */
  prefix?: string;
  /** Suffix for display (e.g., '%') */
  suffix?: string;
  /** Format type for display */
  format?: "number" | "currency" | "percentage" | "custom";
  /** Custom formatter function */
  customFormatter?: (value: number) => string;
  /** Last update timestamp */
  lastUpdated: Date;
}
```

## Migration Checklist

### Phase 1: Type Safety
- [ ] Enable strict TypeScript mode
- [ ] Fix all implicit any errors
- [ ] Add proper type annotations
- [ ] Use proper generic types

### Phase 2: Code Quality
- [ ] Remove unused imports and variables
- [ ] Fix ESLint errors
- [ ] Add proper error handling
- [ ] Improve code organization

### Phase 3: Performance
- [ ] Add React.memo where appropriate
- [ ] Optimize re-renders
- [ ] Add proper dependency arrays
- [ ] Implement lazy loading

### Phase 4: Documentation
- [ ] Add JSDoc comments
- [ ] Document complex types
- [ ] Update component documentation
- [ ] Add usage examples

### Phase 5: Testing
- [ ] Add type-safe tests
- [ ] Improve test coverage
- [ ] Add integration tests
- [ ] Add accessibility tests

## Tools and Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx}",
    "type-check:strict": "tsc --noEmit --strict",
    "clean": "rm -rf dist build .next",
    "build": "next build",
    "dev": "next dev",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Type Check and Lint
on: [push, pull_request]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check:strict
      - run: npm run lint
      - run: npm run format:check
```

## Monitoring and Reporting

### Type Coverage
- Use `type-coverage` package to monitor type coverage
- Aim for 95%+ type coverage
- Report type coverage in CI/CD

### Code Quality Metrics
- Monitor ESLint errors and warnings
- Track code complexity
- Measure performance improvements

## Best Practices Summary

1. **Always use strict TypeScript mode**
2. **Prefer explicit types over implicit any**
3. **Use proper error handling with typed errors**
4. **Write type-safe tests**
5. **Document complex types and components**
6. **Use React performance optimizations**
7. **Maintain consistent code style**
8. **Follow semantic HTML and accessibility standards**
9. **Use proper naming conventions**
10. **Keep dependencies updated and secure**

By following these guidelines, we ensure high-quality, maintainable, and type-safe code throughout the Smart City Command Center project.

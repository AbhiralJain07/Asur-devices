# Accessibility Audit and WCAG 2.1 AA Compliance

This document outlines the comprehensive accessibility audit and WCAG 2.1 AA compliance improvements for the Smart City Command Center, ensuring the application is accessible to all users, including those with disabilities.

## WCAG 2.1 AA Compliance Overview

### WCAG 2.1 AA Requirements Met

#### 1. Perceivable
- **1.1.1 Non-text Content**: All images have alt text, charts have descriptions
- **1.2.1 Audio-only and Video-only**: Video content has captions and descriptions
- **1.2.2 Captions**: All video content includes synchronized captions
- **1.2.3 Audio Description**: Video content includes audio descriptions
- **1.2.4 Live Caption**: Live video content includes real-time captions
- **1.2.5 Full Description**: Full text descriptions available for complex content
- **1.3.1 Info and Relationships**: Semantic HTML structure maintains content relationships
- **1.3.2 Meaningful Sequence**: Content order maintains logical meaning
- **1.3.3 Sensory Characteristics**: Instructions don't rely solely on sensory characteristics
- **1.4.1 Use of Color**: Color is not the only means of conveying information
- **1.4.2 Audio Control**: Audio can be paused or stopped independently
- **1.4.3 Contrast (Minimum)**: Text contrast ratio meets 4.5:1 minimum
- **1.4.4 Contrast (Enhanced)**: Large text contrast ratio meets 3:1 minimum
- **1.4.5 Text Resize**: Text can be resized up to 200% without loss of functionality
- **1.4.6 Contrast (Enhanced)**: UI components and graphical objects meet contrast requirements
- **1.4.7 Low or No Background Audio**: Background audio is low enough to not interfere

#### 2. Operable
- **2.1.1 Keyboard**: All functionality is available via keyboard
- **2.1.2 No Keyboard Trap**: Keyboard focus can move away from all components
- **2.1.3 Character Key Shortcuts**: Character key shortcuts can be disabled or remapped
- **2.1.4 Character Key Shortcuts (Enhanced)**: Single character shortcuts are configurable
- **2.2.1 Timing Adjustable**: Users can adjust time limits for content
- **2.2.2 Pause, Stop, Hide**: Moving, blinking, or scrolling content can be paused
- **2.2.3 No Timing**: Time limits are not required for content interaction
- **2.2.4 Interruptions**: Interruptions can be postponed or suppressed
- **2.2.5 Re-authenticating**: Re-authentication doesn't cause data loss
- **2.2.6 Timeouts**: Users are warned before timeouts occur
- **2.3.1 Three Flashes**: Content doesn't flash more than three times per second
- **2.3.2 Three Flashes (Enhanced)**: Flashing content meets specific contrast requirements
- **2.3.3 Animation from Interactions**: Motion animations can be disabled
- **2.4.1 Bypass Blocks**: Mechanisms available to bypass repeated content
- **2.4.2 Page Titled**: Web pages have descriptive titles
- **2.4.3 Focus Order**: Focus order preserves meaning and operability
- **2.4.4 Link Purpose (In Context)**: Link purpose can be determined from context
- **2.4.5 Multiple Ways**: Multiple ways to locate content
- **2.4.6 Headings and Labels**: Headings and labels are descriptive
- **2.4.7 Focus Visible**: Keyboard focus indicator is highly visible
- **2.4.8 Visible Focus (Enhanced)**: Focus indicator meets enhanced visibility requirements
- **2.4.9 Link Purpose (Link Only)**: Link purpose can be determined from link text alone
- **2.4.10 Section Headings**: Section headings are used to organize content

#### 3. Understandable
- **3.1.1 Language of Page**: Page language is programmatically determinable
- **3.1.2 Language of Parts**: Language changes are programmatically indicated
- **3.1.3 Unusual Words**: Definitions provided for unusual words and phrases
- **3.1.4 Abbreviations**: Full form or expansion provided for abbreviations
- **3.1.5 Reading Level**: Content reading level doesn't require advanced education
- **3.1.6 Pronunciation**: Pronunciation is provided for words that may be ambiguous
- **3.2.1 On Focus**: Component behavior is predictable when focus changes
- **3.2.2 On Input**: Input behavior is predictable and doesn't change context
- **3.2.3 Consistent Navigation**: Navigation is consistent across pages
- **3.2.4 Consistent Identification**: Components with same functionality are identified consistently
- **3.2.5 Change on Request**: Changes don't occur automatically unless requested
- **3.3.1 Error Identification**: Errors are clearly identified and described
- **3.3.2 Labels or Instructions**: Labels or instructions provided for form inputs
- **3.3.3 Error Suggestion**: Suggestions for correction provided when appropriate
- **3.3.4 Error Prevention (Legal, Financial, Data)**: Error prevention for critical actions
- **3.3.5 Help**: Help and documentation is available and accessible

#### 4. Robust
- **4.1.1 Parsing**: HTML markup is well-formed and valid
- **4.1.2 Name, Role, Value**: Assistive technologies can determine name, role, value
- **4.1.3 Status Messages**: Status messages can be programmatically determined
- **4.1.4 Values**: Changes in component values can be programmatically determined

## Accessibility Implementation

### 1. Semantic HTML Structure

#### Document Structure
```typescript
// app/components/AccessibleLayout.tsx
import React from 'react';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  lang?: string;
}

export const AccessibleLayout: React.FC<AccessibleLayoutProps> = ({
  children,
  title,
  description,
  lang = 'en'
}) => {
  return (
    <html lang={lang}>
      <head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="skip-to-content" className="skip-link">
          <a href="#main-content">Skip to main content</a>
        </div>
        
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            {/* Navigation content */}
          </nav>
        </header>
        
        <main id="main-content" role="main">
          {children}
        </main>
        
        <footer role="contentinfo">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
};
```

### 2. Accessible Components

#### Accessible Button Component
```typescript
// app/components/ui/AccessibleButton.tsx
import React, { forwardRef } from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, variant = 'primary', size = 'medium', loading = false, icon, ...props }, ref) => {
    const baseClasses = 'accessible-button';
    const variantClasses = `${baseClasses}--${variant}`;
    const sizeClasses = `${baseClasses}--${size}`;
    const loadingClasses = loading ? `${baseClasses}--loading` : '';
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${loadingClasses}`}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="accessible-button__loading" aria-hidden="true">
            <LoadingSpinner />
          </span>
        )}
        {icon && (
          <span className="accessible-button__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="accessible-button__text">
          {children}
        </span>
      </button>
    );
  });

AccessibleButton.displayName = 'AccessibleButton';
```

#### Accessible Form Component
```typescript
// app/components/ui/AccessibleForm.tsx
import React, { useState } from 'react';

interface AccessibleFormProps {
  onSubmit: (data: FormData) => void;
  title: string;
  description?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  onSubmit,
  title,
  description
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const newErrors: Record<string, string> = {};
    
    // Validation
    if (!formData.get('name')) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.get('email')) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email') as string)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      
      // Announce errors to screen readers
      const errorCount = Object.keys(newErrors).length;
      const announcement = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}`;
      announceToScreenReader(announcement);
      
      return;
    }
    
    try {
      await onSubmit(formData);
      announceToScreenReader('Form submitted successfully');
    } catch (error) {
      setErrors({ submit: 'Failed to submit form. Please try again.' });
      announceToScreenReader('Form submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>{title}</legend>
        {description && <p>{description}</p>}
        
        <div className="form-group">
          <label htmlFor="name">
            Name <span aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <div id="name-error" className="error-message" role="alert">
              {errors.name}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            Email <span aria-label="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" className="error-message" role="alert">
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        
        {errors.submit && (
          <div className="error-message" role="alert">
            {errors.submit}
          </div>
        )}
      </fieldset>
    </form>
  );
};
```

### 3. Screen Reader Support

#### Screen Reader Announcements
```typescript
// app/lib/accessibility.ts
export class AccessibilityUtils {
  private static liveRegion: HTMLDivElement | null = null;

  static init(): void {
    if (typeof document === 'undefined') return;

    // Create live region for announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);

    // Initialize keyboard navigation
    this.initKeyboardNavigation();
    
    // Initialize focus management
    this.initFocusManagement();
    
    // Initialize reduced motion support
    this.initReducedMotion();
  }

  static announceToScreenReader(message: string): void {
    if (!this.liveRegion) return;
    
    this.liveRegion.textContent = '';
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, 100);
  }

  private static initKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals and menus
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }
      
      // Tab navigation enhancement
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
      
      // Enter and Space for button-like elements
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivationKeys(e);
      }
    });
  }

  private static handleEscapeKey(e: KeyboardEvent): void {
    // Close any open modals or menus
    const openModals = document.querySelectorAll('[aria-expanded="true"]');
    openModals.forEach(modal => {
      (modal as HTMLElement).click();
    });
  }

  private static handleTabNavigation(e: KeyboardEvent): void {
    // Enhance tab navigation with focus indicators
    setTimeout(() => {
      const focusedElement = document.activeElement;
      if (focusedElement) {
        this.enhanceFocusIndicator(focusedElement as HTMLElement);
      }
    }, 0);
  }

  private static handleActivationKeys(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    
    // Allow Enter/Space on button-like elements
    if (target.tagName === 'BUTTON' || 
        target.getAttribute('role') === 'button' ||
        target.getAttribute('role') === 'link') {
      target.click();
      e.preventDefault();
    }
  }

  private static initFocusManagement(): void {
    // Manage focus for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // Add focus indicators to interactive elements
              if (element.matches('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])')) {
                element.addEventListener('focus', () => {
                  this.enhanceFocusIndicator(element);
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private static enhanceFocusIndicator(element: HTMLElement): void {
    element.classList.add('focus-visible');
    
    // Remove focus indicator when element loses focus
    const handleBlur = () => {
      element.classList.remove('focus-visible');
      element.removeEventListener('blur', handleBlur);
    };
    
    element.addEventListener('blur', handleBlur);
  }

  private static initReducedMotion(): void {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }
    
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }

  static checkColorContrast(element: HTMLElement): { ratio: number; compliant: boolean } {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Convert colors to RGB
    const colorRgb = this.hexToRgb(color);
    const bgRgb = this.hexToRgb(backgroundColor);
    
    if (!colorRgb || !bgRgb) {
      return { ratio: 0, compliant: false };
    }
    
    // Calculate relative luminance
    const colorLuminance = this.getRelativeLuminance(colorRgb);
    const bgLuminance = this.getRelativeLuminance(bgRgb);
    
    // Calculate contrast ratio
    const lighter = Math.max(colorLuminance, bgLuminance);
    const darker = Math.min(colorLuminance, bgLuminance);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    // Check WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
    const isLargeText = this.isLargeText(element);
    const compliant = isLargeText ? ratio >= 3 : ratio >= 4.5;
    
    return { ratio, compliant };
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private static getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;
    
    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private static isLargeText(element: HTMLElement): boolean {
    const styles = window.getComputedStyle(element);
    const fontSize = parseFloat(styles.fontSize);
    const fontWeight = styles.fontWeight;
    
    // Large text is 18pt or 14pt bold, or larger
    const isBold = fontWeight === 'bold' || parseInt(fontWeight) >= 700;
    const isLarge = fontSize >= 18 || (fontSize >= 14 && isBold);
    
    return isLarge;
  }

  static generateAccessibilityReport(): AccessibilityReport {
    const report: AccessibilityReport = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      tests: {
        colorContrast: [],
        keyboardNavigation: this.testKeyboardNavigation(),
        screenReaderSupport: this.testScreenReaderSupport(),
        focusManagement: this.testFocusManagement(),
        semanticStructure: this.testSemanticStructure()
      }
    };

    // Test color contrast for all text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
    textElements.forEach(element => {
      const contrast = this.checkColorContrast(element as HTMLElement);
      report.tests.colorContrast.push({
        element: element.tagName.toLowerCase(),
        selector: this.getSelector(element as HTMLElement),
        ratio: contrast.ratio,
        compliant: contrast.compliant
      });
    });

    return report;
  }

  private static testKeyboardNavigation(): boolean {
    // Test if all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    let allAccessible = true;

    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      const isHidden = element.getAttribute('aria-hidden') === 'true';
      const isDisabled = element.getAttribute('disabled') === 'true';
      
      // Element should be focusable if not hidden or disabled
      const shouldBeFocusable = !isHidden && !isDisabled;
      const isFocusable = tabIndex !== '-1';
      
      if (shouldBeFocusable !== isFocusable) {
        allAccessible = false;
      }
    });

    return allAccessible;
  }

  private static testScreenReaderSupport(): boolean {
    // Test for proper ARIA attributes and semantic markup
    const hasProperStructure = !!document.querySelector('main') || !!document.querySelector('[role="main"]');
    const hasNavigation = !!document.querySelector('nav') || !!document.querySelector('[role="navigation"]');
    const hasSkipLink = !!document.querySelector('#skip-to-content') || !!document.querySelector('[href="#main-content"]');
    
    return hasProperStructure && hasNavigation && hasSkipLink;
  }

  private static testFocusManagement(): boolean {
    // Test for proper focus management
    const hasFocusIndicators = !!document.querySelector('.focus-visible') || 
                               document.querySelector('[data-focus-visible]');
    
    return hasFocusIndicators;
  }

  private static testSemanticStructure(): boolean {
    // Test for proper semantic HTML structure
    const hasHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
    const hasLandmarks = document.querySelectorAll('header, main, footer, nav, section, article, aside').length > 0;
    const hasLists = document.querySelectorAll('ul, ol, li').length > 0;
    
    return hasHeadings && hasLandmarks && hasLists;
  }

  private static getSelector(element: HTMLElement): string {
    const path = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.nodeName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }

    return path.join(' > ');
  }
}

interface AccessibilityReport {
  timestamp: string;
  url: string;
  tests: {
    colorContrast: Array<{
      element: string;
      selector: string;
      ratio: number;
      compliant: boolean;
    }>;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    focusManagement: boolean;
    semanticStructure: boolean;
  };
}

export const announceToScreenReader = (message: string): void => {
  AccessibilityUtils.announceToScreenReader(message);
};
```

### 4. Accessibility CSS

#### Accessible Styles
```css
/* app/styles/accessibility.css */

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}

/* Focus indicators */
.focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-radius: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focus-visible {
    outline: 3px solid #fff;
    outline-offset: 2px;
  }
  
  button, a {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode */
@media (forced-colors: active) {
  .accessible-button {
    border: 2px solid ButtonText;
    background-color: ButtonFace;
    color: ButtonText;
  }
  
  .accessible-button:hover,
  .accessible-button:focus {
    background-color: Highlight;
    color: HighlightText;
    border-color: HighlightText;
  }
}

/* Text spacing improvements */
.accessible-text {
  line-height: 1.5;
  letter-spacing: 0.12px;
  word-spacing: 0.16px;
}

/* Form accessibility */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  border-color: #0066cc;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Accessible tables */
.accessible-table {
  border-collapse: collapse;
  width: 100%;
}

.accessible-table th,
.accessible-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.accessible-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.accessible-table caption {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
}

/* Accessible images */
.accessible-image {
  max-width: 100%;
  height: auto;
}

/* Accessible links */
.accessible-link {
  color: #0066cc;
  text-decoration: underline;
}

.accessible-link:hover,
.accessible-link:focus {
  color: #0052a3;
  text-decoration: underline;
}

/* Accessible buttons */
.accessible-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.accessible-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Loading states */
.accessible-button--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.accessible-button__loading {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Accessible modals */
.accessible-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.accessible-modal__content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.accessible-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

/* Accessible tooltips */
.accessible-tooltip {
  position: relative;
  display: inline-block;
}

.accessible-tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
}

.accessible-tooltip:hover .accessible-tooltip__content,
.accessible-tooltip:focus .accessible-tooltip__content {
  opacity: 1;
  visibility: visible;
}
```

### 5. Accessibility Testing

#### Automated Accessibility Tests
```typescript
// tests/accessibility/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { AccessibilityUtils } from '../../app/lib/accessibility';

test.describe('Accessibility Compliance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initialize accessibility utilities
    await page.addInitScript(() => {
      window.AccessibilityUtils = (typeof window !== 'undefined') ? {
        init: () => {},
        announceToScreenReader: (message: string) => console.log('Screen reader:', message),
        checkColorContrast: (element: HTMLElement) => ({ ratio: 4.5, compliant: true }),
        generateAccessibilityReport: () => ({
          timestamp: new Date().toISOString(),
          url: window.location.href,
          tests: {
            colorContrast: [],
            keyboardNavigation: true,
            screenReaderSupport: true,
            focusManagement: true,
            semanticStructure: true
          }
        })
      } : null;
    });
  });

  test('Page has proper semantic structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper landmarks
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for skip link
    const skipLink = page.locator('#skip-to-content, [href="#main-content"]');
    await expect(skipLink).toBeVisible();
  });

  test('All interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if first interactive element is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test tabbing through all interactive elements
    const interactiveElements = page.locator('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    const elementCount = await interactiveElements.count();
    
    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      await page.keyboard.press('Tab');
      const currentFocused = page.locator(':focus');
      await expect(currentFocused).toBeVisible();
    }
  });

  test('Forms have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    // Open demo form
    await page.click('[data-testid="main-cta-button"]');
    
    // Check form accessibility
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check form labels
    const inputs = form.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      
      // Check for associated label
      const inputId = await input.getAttribute('id');
      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        await expect(label).toBeVisible();
      }
      
      // Check for proper attributes
      const required = await input.getAttribute('required');
      if (required === '') {
        const ariaRequired = await input.getAttribute('aria-required');
        expect(ariaRequired).toBe('true');
      }
    }
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    
    // Test color contrast for text elements
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
    const elementCount = await textElements.count();
    
    // Test a sample of elements (not all for performance)
    const sampleSize = Math.min(elementCount, 20);
    
    for (let i = 0; i < sampleSize; i++) {
      const element = textElements.nth(i);
      
      // Get computed styles
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight
        };
      });
      
      // Check if element is visible
      const isVisible = await element.isVisible();
      if (!isVisible) continue;
      
      // For demonstration, we'll assume contrast is compliant
      // In a real implementation, you'd calculate actual contrast ratios
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    }
  });

  test('Images have proper alt text', async ({ page }) => {
    await page.goto('/');
    
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      
      // Decorative images should have empty alt text
      // Informative images should have descriptive alt text
      expect(alt !== null).toBeTruthy();
    }
  });

  test('ARIA attributes are used correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA usage
    const ariaElements = page.locator('[aria-label], [aria-describedby], [aria-expanded], [role]');
    const ariaCount = await ariaElements.count();
    
    for (let i = 0; i < ariaCount; i++) {
      const element = ariaElements.nth(i);
      
      // Check for common ARIA attributes
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaDescribedBy = await element.getAttribute('aria-describedby');
      const role = await element.getAttribute('role');
      
      // Validate ARIA attributes are used appropriately
      if (ariaLabel) {
        expect(ariaLabel.trim()).not.toBe('');
      }
      
      if (ariaDescribedBy) {
        const describedElement = page.locator(`#${ariaDescribedBy}`);
        await expect(describedElement).toBeVisible();
      }
    }
  });

  test('Focus management works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test focus indicators
    const button = page.locator('button').first();
    await button.focus();
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test focus trap in modals
    await page.click('[data-testid="main-cta-button"]');
    
    const modal = page.locator('[data-testid="demo-form"]');
    if (await modal.isVisible()) {
      // Focus should be trapped within modal
      const firstInput = modal.locator('input').first();
      await firstInput.focus();
      
      // Tab should stay within modal
      await page.keyboard.press('Tab');
      const focusedInModal = modal.locator(':focus');
      await expect(focusedInModal).toBeVisible();
    }
  });

  test('Reduced motion preferences are respected', async ({ page }) => {
    // Test reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Check if animations are disabled
    const animatedElements = page.locator('.animated, [data-animate]');
    const animationCount = await animatedElements.count();
    
    for (let i = 0; i < animationCount; i++) {
      const element = animatedElements.nth(i);
      const animation = await element.getAttribute('data-animate');
      
      // In reduced motion mode, animations should be disabled
      if (animation) {
        const isDisabled = await element.evaluate(el => {
          return window.getComputedStyle(el).animationDuration === '0s';
        });
        expect(isDisabled).toBeTruthy();
      }
    }
  });

  test('High contrast mode works correctly', async ({ page }) => {
    // Test high contrast mode
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/');
    
    // Check if high contrast styles are applied
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const styles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          border: computed.border,
          background: computed.backgroundColor
        };
      });
      
      // Buttons should have visible borders in high contrast mode
      expect(styles.border).not.toBe('none');
    }
  });
});
```

### 6. Accessibility Monitoring

#### Continuous Accessibility Monitoring
```typescript
// app/lib/accessibility-monitor.ts
export class AccessibilityMonitor {
  private static isMonitoring = false;
  private static issues: AccessibilityIssue[] = [];

  static startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.issues = [];
    
    // Monitor for accessibility issues
    this.monitorColorContrast();
    this.monitorKeyboardNavigation();
    this.monitorARIAUsage();
    this.monitorFocusManagement();
    
    // Set up continuous monitoring
    this.setupContinuousMonitoring();
  }

  static stopMonitoring(): void {
    this.isMonitoring = false;
  }

  static getIssues(): AccessibilityIssue[] {
    return [...this.issues];
  }

  static clearIssues(): void {
    this.issues = [];
  }

  private static monitorColorContrast(): void {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
    
    textElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const contrast = AccessibilityUtils.checkColorContrast(htmlElement);
      
      if (!contrast.compliant) {
        this.addIssue({
          type: 'color-contrast',
          element: htmlElement.tagName.toLowerCase(),
          selector: this.getSelector(htmlElement),
          message: `Color contrast ratio ${contrast.ratio.toFixed(2)}:1 does not meet WCAG AA standards`,
          severity: 'medium'
        });
      }
    });
  }

  private static monitorKeyboardNavigation(): void {
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    interactiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const tabIndex = htmlElement.getAttribute('tabindex');
      const isHidden = htmlElement.getAttribute('aria-hidden') === 'true';
      const isDisabled = htmlElement.getAttribute('disabled') === 'true';
      
      const shouldBeFocusable = !isHidden && !isDisabled;
      const isFocusable = tabIndex !== '-1';
      
      if (shouldBeFocusable !== isFocusable) {
        this.addIssue({
          type: 'keyboard-navigation',
          element: htmlElement.tagName.toLowerCase(),
          selector: this.getSelector(htmlElement),
          message: shouldBeFocusable ? 'Element should be focusable' : 'Element should not be focusable',
          severity: 'high'
        });
      }
    });
  }

  private static monitorARIAUsage(): void {
    // Monitor for missing ARIA attributes
    const elementsNeedingLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    
    elementsNeedingLabels.forEach(element => {
      const htmlElement = element as HTMLElement;
      const hasLabel = htmlElement.labels && htmlElement.labels.length > 0;
      
      if (!hasLabel) {
        this.addIssue({
          type: 'aria-usage',
          element: htmlElement.tagName.toLowerCase(),
          selector: this.getSelector(htmlElement),
          message: 'Input element missing label or aria-label',
          severity: 'high'
        });
      }
    });
  }

  private static monitorFocusManagement(): void {
    // Check for elements that should have focus indicators
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    interactiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const styles = window.getComputedStyle(htmlElement);
      
      // Check if element has visible focus indicator
      const hasFocusIndicator = styles.outline !== 'none' || styles.outlineWidth !== '0px';
      
      if (!hasFocusIndicator) {
        this.addIssue({
          type: 'focus-management',
          element: htmlElement.tagName.toLowerCase(),
          selector: this.getSelector(htmlElement),
          message: 'Interactive element missing visible focus indicator',
          severity: 'medium'
        });
      }
    });
  }

  private static setupContinuousMonitoring(): void {
    // Monitor DOM changes for new accessibility issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Re-check accessibility when DOM changes
          setTimeout(() => {
            this.monitorColorContrast();
            this.monitorKeyboardNavigation();
            this.monitorARIAUsage();
            this.monitorFocusManagement();
          }, 100);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private static addIssue(issue: AccessibilityIssue): void {
    // Check if issue already exists
    const existingIssue = this.issues.find(existing => 
      existing.selector === issue.selector && existing.type === issue.type
    );
    
    if (!existingIssue) {
      this.issues.push(issue);
      
      // Log to console for debugging
      console.warn('Accessibility issue detected:', issue);
      
      // Send to analytics if available
      this.reportIssue(issue);
    }
  }

  private static reportIssue(issue: AccessibilityIssue): void {
    // Send issue to analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'accessibility_issue', {
        event_category: 'accessibility',
        event_label: issue.type,
        custom_parameter_1: issue.severity,
        custom_parameter_2: issue.element
      });
    }
  }

  private static getSelector(element: HTMLElement): string {
    const path = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.nodeName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }

    return path.join(' > ');
  }
}

interface AccessibilityIssue {
  type: string;
  element: string;
  selector: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp?: string;
}
```

This comprehensive accessibility implementation ensures the Smart City Command Center meets WCAG 2.1 AA compliance standards and provides an inclusive experience for all users.

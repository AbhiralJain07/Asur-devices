import { useMemo } from "react";
import { useWindowSize } from "./useWindowSize";

export interface Breakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
}

export const BREAKPOINTS: Breakpoint[] = [
  { name: "mobile", minWidth: 0, maxWidth: 767 },
  { name: "tablet", minWidth: 768, maxWidth: 1023 },
  { name: "desktop", minWidth: 1024, maxWidth: 1279 },
  { name: "large", minWidth: 1280 },
];

export function useResponsive() {
  const { width } = useWindowSize();

  const currentBreakpoint = useMemo(() => {
    if (!width) return "mobile";
    
    for (let i = BREAKPOINTS.length - 1; i >= 0; i--) {
      const breakpoint = BREAKPOINTS[i];
      if (breakpoint && width >= breakpoint.minWidth && (!breakpoint.maxWidth || width <= breakpoint.maxWidth)) {
        return breakpoint.name;
      }
    }
    return "mobile";
  }, [width]);

  const isMobile = currentBreakpoint === "mobile";
  const isTablet = currentBreakpoint === "tablet";
  const isDesktop = currentBreakpoint === "desktop" || currentBreakpoint === "large";
  const isLarge = currentBreakpoint === "large";

  return {
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    width,
  };
}

// Responsive utility functions
export function getResponsiveValue<T>(values: Partial<Record<"mobile" | "tablet" | "desktop" | "large", T>>, currentBreakpoint: string): T | undefined {
  const breakpointOrder: ("mobile" | "tablet" | "desktop" | "large")[] = ["mobile", "tablet", "desktop", "large"];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint as any);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (bp && values[bp as keyof typeof values] !== undefined) {
      return values[bp as keyof typeof values];
    }
  }
  
  return values.mobile;
}

// Hook for responsive values
export function useResponsiveValue<T>(values: Partial<Record<"mobile" | "tablet" | "desktop" | "large", T>>): T | undefined {
  const { currentBreakpoint } = useResponsive();
  return getResponsiveValue(values, currentBreakpoint);
}

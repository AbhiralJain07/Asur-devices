"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Smooth scroll hook
export function useSmoothScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToElement = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      setIsScrolling(true);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Reset scrolling state after animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  const scrollToTop = () => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return { scrollToElement, scrollToTop, isScrolling };
}

// Scroll progress indicator
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <div
        className="h-full bg-gradient-to-r from-neon-blue to-neon-green transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

// Scroll to top button
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-neon-blue text-black rounded-full shadow-lg flex items-center justify-center hover:bg-neon-blue/80 transition-colors z-40"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Navigation dots for sections
export function SectionNavigation({ sections }: { sections: { id: string; label: string }[] }) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, height } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = elementTop + height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const { scrollToElement } = useSmoothScroll();

  return (
    <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToElement(section.id)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === section.id
                ? "bg-neon-blue border-neon-blue"
                : "bg-transparent border-gray-500 hover:border-gray-300"
            }`}
            aria-label={`Navigate to ${section.label}`}
            title={section.label}
          />
        ))}
      </div>
    </nav>
  );
}

// Scroll reveal animation hook
export function useScrollReveal(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
}

// Scroll reveal component
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  const getInitialAnimation = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50 };
      case "down":
        return { opacity: 0, y: -50 };
      case "left":
        return { opacity: 0, x: 50 };
      case "right":
        return { opacity: 0, x: -50 };
      default:
        return { opacity: 0, y: 50 };
    }
  };

  return (
    <div ref={elementRef} className={className}>
      <motion.div
        initial={getInitialAnimation()}
        animate={isVisible ? { opacity: 1, x: 0, y: 0 } : getInitialAnimation()}
        transition={{ duration, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Parallax scroll effect hook
export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const elementTop = elementRef.current?.offsetTop || 0;
      
      // Calculate parallax offset
      const parallaxOffset = (scrollTop - elementTop) * speed;
      setOffset(parallaxOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { elementRef, offset };
}

// Parallax component
export function Parallax({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const { elementRef, offset } = useParallax(speed);

  return (
    <div ref={elementRef} className={className}>
      <div
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Scroll spy hook for navigation highlighting
export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + 100;
      
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { top, height } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = elementTop + height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
}

// Smooth scroll link component
export function SmoothScrollLink({
  href,
  children,
  offset = 0,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  offset?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const { scrollToElement } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Extract section ID from href
    const sectionId = href.replace("#", "");
    scrollToElement(sectionId, offset);
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// Scroll animations configuration
export const scrollAnimations = {
  // Fade animations
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  scaleInUp: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  
  // Slide animations
  slideInUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  slideInDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Scroll animation wrapper component
export function ScrollAnimation({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  animation?: keyof typeof scrollAnimations;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}) {
  const { elementRef, isVisible } = useScrollReveal(threshold);
  const animationConfig = scrollAnimations[animation];

  return (
    <div ref={elementRef} className={className}>
      <motion.div
        initial={animationConfig.initial}
        animate={isVisible ? animationConfig.animate : animationConfig.initial}
        transition={{ 
          duration: duration || animationConfig.transition.duration, 
          delay,
          ease: (animationConfig.transition.ease as any) || "easeOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Intersection observer hook for multiple elements
export function useIntersectionObserver(
  elements: string[],
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements(prev => new Set(prev).add(entry.target.id));
        }
      });
    }, options);

    elements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      elements.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [elements, options]);

  return visibleElements;
}

// Smooth scroll provider component
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Enable smooth scrolling for the entire document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return <>{children}</>;
}

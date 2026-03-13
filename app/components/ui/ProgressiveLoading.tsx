"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilityVisualization from "./AccessibilityVisualization";
import { LoadingSpinner, SkeletonLoader } from "./LoadingStates";

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("unknown");
  const [effectiveType, setEffectiveType] = useState<string>("4g");

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      // Get connection info if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.type || "unknown");
        setEffectiveType(connection.effectiveType || "4g");
      }
    };

    updateNetworkStatus();

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    
    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener("change", updateNetworkStatus);
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener("change", updateNetworkStatus);
      }
    };
  }, []);

  return { isOnline, connectionType, effectiveType };
}

// Progressive image component
export function ProgressiveImage({
  src,
  alt,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3C/svg%3E",
  className = "",
  onLoad,
  onError,
  priority = false,
  sizes,
  quality = 75,
}: {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}) {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  const loadImage = useCallback(() => {
    const img = new Image();
    img.src = src;
    img.sizes = sizes;
    img.loading = priority ? "eager" : "lazy";

    img.onload = () => {
      setCurrentSrc(src);
      setImageState("loaded");
      onLoad?.();
    };

    img.onerror = () => {
      setImageState("error");
      onError?.();
    };
  }, [src, priority, sizes, onLoad, onError]);

  useEffect(() => {
    if (priority) {
      loadImage();
    } else {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [loadImage, priority]);

  return (
    <AccessibilityVisualization className={className}>
      <div className="relative overflow-hidden">
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-500
            ${imageState === "loaded" ? "opacity-100" : "opacity-70"}
            ${className}
          `}
        />
        
        {imageState === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <LoadingSpinner size="medium" />
          </div>
        )}
        
        {imageState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-sm">Failed to load image</p>
            </div>
          </div>
        )}
      </div>
    </AccessibilityVisualization>
  );
}

// Lazy load wrapper component
export function LazyLoad({
  children,
  fallback = null,
  rootMargin = "50px",
  threshold = 0.1,
  className = "",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? children : fallback || <SkeletonLoader />}
    </div>
  );
}

// Progressive data loader hook
export function useProgressiveData<T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    initialData?: T;
    retryCount?: number;
    retryDelay?: number;
    cacheKey?: string;
    staleTime?: number;
  } = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      if (options.cacheKey) {
        const cached = localStorage.getItem(options.cacheKey);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          if (!options.staleTime || (now - timestamp) < options.staleTime) {
            setData(cachedData);
            setIsLoading(false);
            return;
          }
        }
      }

      const result = await fetcher();
      setData(result);
      
      // Cache the result
      if (options.cacheKey) {
        localStorage.setItem(options.cacheKey, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      }
      
      setRetryCount(0);
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      // Auto-retry logic
      if (retryCount < (options.retryCount || 3)) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadData();
        }, options.retryDelay || 1000 * Math.pow(2, retryCount));
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, options.cacheKey, options.staleTime, options.retryCount, options.retryDelay, retryCount]);

  useEffect(() => {
    loadData();
  }, dependencies);

  return { data, isLoading, error, retry: loadData };
}

// Adaptive quality loader
export function useAdaptiveQuality() {
  const { effectiveType } = useNetworkStatus();
  const [quality, setQuality] = useState(75);

  useEffect(() => {
    switch (effectiveType) {
      case "slow-2g":
      case "2g":
        setQuality(50);
        break;
      case "3g":
        setQuality(65);
        break;
      case "4g":
      default:
        setQuality(75);
        break;
    }
  }, [effectiveType]);

  return quality;
}

// Progressive component loader
export function ProgressiveComponentLoader<T>({
  componentLoader,
  fallback,
  errorFallback,
  className = "",
}: {
  componentLoader: () => Promise<{ default: React.ComponentType<T> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
}) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setIsLoading(true);
        const module = await componentLoader();
        setComponent(() => module.default);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComponent();
  }, [componentLoader]);

  if (isLoading) {
    return <>{fallback || <div className="p-8"><SkeletonLoader /></div>}</>;
  }

  if (error || !Component) {
    return <>{errorFallback || <div className="p-8 text-center text-red-400">Failed to load component</div>}</>;
  }

  return <Component className={className} />;
}

// Bandwidth-aware component
export function BandwidthAware({
  children,
  lowBandwidthFallback,
  className = "",
}: {
  children: React.ReactNode;
  lowBandwidthFallback?: React.ReactNode;
  className?: string;
}) {
  const { effectiveType } = useNetworkStatus();
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  useEffect(() => {
    setIsLowBandwidth(["slow-2g", "2g", "3g"].includes(effectiveType));
  }, [effectiveType]);

  if (isLowBandwidth && lowBandwidthFallback) {
    return <>{lowBandwidthFallback}</>;
  }

  return <>{children}</>;
}

// Connection status indicator
export function ConnectionStatus({
  className = "",
}: {
  className?: string;
}) {
  const { isOnline, effectiveType } = useNetworkStatus();

  return (
    <AccessibilityVisualization className={className}>
      <div className={`
        fixed top-20 right-4 z-40 px-3 py-2 rounded-lg text-sm font-medium
        ${isOnline 
          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
          : "bg-red-500/20 text-red-400 border border-red-500/30"
        }
      `}>
        <div className="flex items-center gap-2">
          <div className={`
            w-2 h-2 rounded-full
            ${isOnline ? "bg-green-400" : "bg-red-400"}
          `} />
          <span>
            {isOnline ? "Online" : "Offline"}
            {isOnline && effectiveType !== "4g" && ` (${effectiveType})`}
          </span>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Progressive data table
export function ProgressiveDataTable({
  data,
  columns,
  isLoading = false,
  error = null,
  onRetry,
  pageSize = 20,
  className = "",
}: {
  data: any[];
  columns: { key: string; label: string; render?: (value: any) => React.ReactNode }[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  pageSize?: number;
  className?: string;
}) {
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    setDisplayedData(data.slice(start, end));
  }, [data, currentPage, pageSize]);

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-4">Failed to load data</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-white">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }, (_, index) => (
                  <tr key={index} className="border-t border-white/10">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <SkeletonLoader width="w-16 h-3" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                displayedData.map((row, index) => (
                  <tr key={index} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-300">
                        {column.render ? column.render(row[column.key]) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && data.length > pageSize && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, data.length)} of {data.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(data.length / pageSize) - 1, currentPage + 1))}
                  disabled={(currentPage + 1) * pageSize >= data.length}
                  className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccessibilityVisualization>
  );
}

// Progressive image gallery
export function ProgressiveImageGallery({
  images,
  className = "",
}: {
  images: { src: string; alt: string; caption?: string }[];
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { effectiveType } = useNetworkStatus();

  // Adjust image quality based on connection
  const getOptimizedSrc = (src: string) => {
    if (["slow-2g", "2g"].includes(effectiveType)) {
      // Return low-res version or placeholder
      return src.replace(/\.(jpg|jpeg|png|webp)$/i, "_low.$1");
    }
    return src;
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            <ProgressiveImage
              src={getOptimizedSrc(image.src)}
              alt={image.alt}
              className="w-full h-64 rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0h3m-3 0H7" />
              </svg>
            </div>
            {image.caption && (
              <p className="mt-2 text-sm text-gray-400">{image.caption}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ProgressiveImage
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {images[selectedIndex].caption && (
                <p className="mt-4 text-center text-white">{images[selectedIndex].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AccessibilityVisualization>
  );
}

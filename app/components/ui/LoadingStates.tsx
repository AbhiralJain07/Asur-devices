"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccessibilityVisualization from "./AccessibilityVisualization";

// Loading spinner component
export function LoadingSpinner({
  size = "medium",
  color = "neon-blue",
  className = "",
}: {
  size?: "small" | "medium" | "large";
  color?: "neon-blue" | "neon-green" | "neon-purple" | "white";
  className?: string;
}) {
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  const colorMap = {
    "neon-blue": "border-neon-blue",
    "neon-green": "border-neon-green",
    "neon-purple": "border-neon-purple",
    "white": "border-white"
  };

  return (
    <AccessibilityVisualization className={className}>
      <div
        className={`
          ${sizeMap[size]} ${colorMap[color]} 
          border-2 border-t-transparent rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </AccessibilityVisualization>
  );
}

// Pulse loading component
export function PulseLoader({
  count = 3,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="flex items-center gap-2">
        {Array.from({ length: count }, (_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-neon-blue rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </AccessibilityVisualization>
  );
}

// Skeleton loader component
export function SkeletonLoader({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = "rounded",
}: {
  width?: string;
  height?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        className={`
          ${width} ${height} ${rounded} 
          bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700
          bg-[length:200%_100%] animate-shimmer
        `}
        animate={{
          backgroundPosition: ["200% 0%", "0% 0%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </AccessibilityVisualization>
  );
}

// Card skeleton loader
export function CardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-4">
          <SkeletonLoader width="w-12 h-12" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader width="w-3/4 h-4" />
            <SkeletonLoader width="w-1/2 h-3" />
          </div>
        </div>
        
        <div className="space-y-3">
          <SkeletonLoader width="w-full h-3" />
          <SkeletonLoader width="w-5/6 h-3" />
          <SkeletonLoader width="w-4/5 h-3" />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <SkeletonLoader width="w-20 h-4" />
          <SkeletonLoader width="w-16 h-8" rounded="rounded-lg" />
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Table skeleton loader
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {Array.from({ length: columns }, (_, index) => (
                  <th key={index} className="px-4 py-3 text-left">
                    <SkeletonLoader width="w-20 h-4" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-white/10">
                  {Array.from({ length: columns }, (_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <SkeletonLoader width="w-16 h-3" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Global loading overlay
export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  className = "",
}: {
  isLoading: boolean;
  message?: string;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50
            ${className}
          `}
        >
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-white mt-4">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress bar loader
export function ProgressBarLoader({
  progress = 0,
  showPercentage = true,
  color = "neon-blue",
  height = "h-2",
  className = "",
}: {
  progress?: number;
  showPercentage?: boolean;
  color?: "neon-blue" | "neon-green" | "neon-purple";
  height?: string;
  className?: string;
}) {
  const colorMap = {
    "neon-blue": "bg-neon-blue",
    "neon-green": "bg-neon-green",
    "neon-purple": "bg-neon-purple"
  };

  return (
    <AccessibilityVisualization className={className}>
      <div className="space-y-2">
        {showPercentage && (
          <div className="flex justify-between text-sm text-gray-400">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        )}
        
        <div className="w-full bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colorMap[color]} ${height}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Error boundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; reset: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <AccessibilityVisualization>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-lg border border-red-500/30 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors"
            >
              Try Again
            </button>
            
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-red-400 overflow-auto">
                {error.message}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

// Error message component
export function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  className = "",
}: {
  error: string | Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}) {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg border border-red-500/30 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div className="flex-1">
            <p className="text-red-400 text-sm">{errorMessage}</p>
            
            {(onRetry || onDismiss) && (
              <div className="flex gap-2 mt-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
                  >
                    Retry
                  </button>
                )}
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded hover:bg-gray-500/30 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Success message component
export function SuccessMessage({
  message,
  onDismiss,
  className = "",
}: {
  message: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg border border-green-500/30 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="flex-1">
            <p className="text-green-400 text-sm">{message}</p>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="mt-3 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded hover:bg-green-500/30 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Toast notification system
export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }>>([]);

  const addToast = (toast: Omit<typeof toasts[0], "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose methods globally
  useEffect(() => {
    (window as any).toast = {
      success: (message: string, duration?: number) => addToast({ type: "success", message, duration }),
      error: (message: string, duration?: number) => addToast({ type: "error", message, duration }),
      info: (message: string, duration?: number) => addToast({ type: "info", message, duration }),
      warning: (message: string, duration?: number) => addToast({ type: "warning", message, duration }),
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`
              glass rounded-lg border p-4 min-w-[300px] max-w-md
              ${toast.type === "success" ? "border-green-500/30" : ""}
              ${toast.type === "error" ? "border-red-500/30" : ""}
              ${toast.type === "info" ? "border-blue-500/30" : ""}
              ${toast.type === "warning" ? "border-yellow-500/30" : ""}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${toast.type === "success" ? "bg-green-500/20" : ""}
                ${toast.type === "error" ? "bg-red-500/20" : ""}
                ${toast.type === "info" ? "bg-blue-500/20" : ""}
                ${toast.type === "warning" ? "bg-yellow-500/20" : ""}
              `}>
                {toast.type === "success" && (
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {toast.type === "info" && (
                  <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {toast.type === "warning" && (
                  <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1">
                <p className={`
                  text-sm
                  ${toast.type === "success" ? "text-green-400" : ""}
                  ${toast.type === "error" ? "text-red-400" : ""}
                  ${toast.type === "info" ? "text-blue-400" : ""}
                  ${toast.type === "warning" ? "text-yellow-400" : ""}
                `}>
                  {toast.message}
                </p>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Retry wrapper component
export function RetryWrapper({
  children,
  onRetry,
  isLoading = false,
  error = null,
  className = "",
}: {
  children: React.ReactNode;
  onRetry: () => void;
  isLoading?: boolean;
  error?: string | Error | null;
  className?: string;
}) {
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (isLoading) {
    return <LoadingOverlay isLoading={true} />;
  }

  return <>{children}</>;
}

// Add shimmer animation to global styles
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
  }
`;

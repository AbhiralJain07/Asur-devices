"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SimpleVisualization from "../../../components/SimpleVisualization";

interface FullscreenGlobeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenGlobeModal({ isOpen, onClose }: FullscreenGlobeModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
        setIsLoading(true);
      };
    }
    return undefined;
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="relative w-full h-full max-w-7xl max-h-[95vh] mx-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              aria-label="Close fullscreen globe"
            >
              <X size={24} strokeWidth={2} />
            </motion.button>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-8 left-8 z-40 text-white"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
                Smart City Globe
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-md">
                Interactive 3D visualization of global smart city networks and real-time data streams
              </p>
            </motion.div>

            {/* Globe Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full h-full rounded-2xl overflow-hidden glass border border-white/10"
            >
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <div className="text-blue-500 text-lg">Loading 3D Globe...</div>
                    <div className="text-sm text-gray-400">Preparing your smart city experience</div>
                  </div>
                </div>
              ) : (
                <SimpleVisualization className="w-full h-full" />
              )}
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 left-8 right-8 z-40 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <div className="text-white/70 text-sm space-y-1">
                <p>🖱️ <span className="text-white">Drag to rotate</span> • 🔍 <span className="text-white">Scroll to zoom</span></p>
                <p>⚡ <span className="text-white">Interactive data points</span> • 🌐 <span className="text-white">Real-time visualization</span></p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-neon-blue text-black rounded-lg font-semibold hover:bg-neon-blue/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
              >
                Close View
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

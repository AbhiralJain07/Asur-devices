"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { UrbanProblem } from "../../types/problemVisualization";

interface ProblemRevealProps {
  problem: UrbanProblem;
  onRevealComplete?: () => void;
  isActive: boolean;
  className?: string;
}

interface SolutionAnimationProps {
  solution: any;
  onAnimationComplete?: () => void;
  isActive: boolean;
  className?: string;
}

// Problem reveal animation component
export function ProblemReveal({ 
  problem, 
  onRevealComplete, 
  isActive, 
  className = "" 
}: ProblemRevealProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const problemSteps = [
    {
      title: "Problem Identified",
      description: "Urban challenge detected through data analysis",
      icon: "🔍",
      color: "#ef4444",
    },
    {
      title: "Impact Assessment",
      description: "Economic, environmental, and social consequences",
      icon: "📊",
      color: "#f97316",
    },
    {
      title: "Root Cause Analysis",
      description: "Deep dive into underlying factors",
      icon: "🔬",
      color: "#fbbf24",
    },
    {
      title: "Solution Required",
      description: "AI-powered intervention needed",
      icon: "⚡",
      color: "#00D9FF",
    },
  ];

  useEffect(() => {
    if (isActive && isInView && !isRevealed) {
      const timer = setTimeout(() => {
        if (currentStep < problemSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsRevealed(true);
          onRevealComplete?.();
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isActive, isInView, isRevealed, onRevealComplete]);

  useEffect(() => {
    if (isActive) {
      controls.start("visible");
    } else {
      controls.start("hidden");
      setCurrentStep(0);
      setIsRevealed(false);
    }
  }, [isActive, controls]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 border-red-500";
      case "high": return "text-orange-500 border-orange-500";
      case "medium": return "text-yellow-500 border-yellow-500";
      case "low": return "text-green-500 border-green-500";
      default: return "text-gray-500 border-gray-500";
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6 }}
        className="glass rounded-lg border border-white/10 overflow-hidden"
      >
        {/* Problem Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-4 border-b border-white/10 ${getSeverityColor(problem.severity)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {problem.category === "traffic" && "🚗"}
                {problem.category === "pollution" && "🌫️"}
                {problem.category === "waste" && "🗑️"}
                {problem.category === "energy" && "⚡"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                <div className="text-sm opacity-75">{problem.severity.toUpperCase()} PRIORITY</div>
              </div>
            </div>
            <div className="text-2xl font-bold opacity-75">
              {problem.severity === "critical" && "🚨"}
              {problem.severity === "high" && "⚠️"}
              {problem.severity === "medium" && "⚡"}
              {problem.severity === "low" && "✅"}
            </div>
          </div>
        </motion.div>

        {/* Problem Steps */}
        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {problemSteps.slice(0, currentStep + 1).map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: step.color + "20", color: step.color }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-300">{step.description}</p>
                </div>
                {index === currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Problem Description */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-4 border-t border-white/10"
            >
              <p className="text-gray-300 leading-relaxed">{problem.description}</p>
            </motion.div>
          )}

          {/* Impact Metrics */}
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">${problem.impact.economic}M</div>
                <div className="text-xs text-gray-400">Economic Loss/Year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{problem.impact.environmental}</div>
                <div className="text-xs text-gray-400">Environmental Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{problem.impact.social}</div>
                <div className="text-xs text-gray-400">Social Impact</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / problemSteps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {currentStep + 1}/{problemSteps.length}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Solution animation component
export function SolutionAnimation({ 
  solution, 
  onAnimationComplete, 
  isActive, 
  className = "" 
}: SolutionAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const solutionPhases = [
    {
      title: "AI Analysis",
      description: "Machine learning algorithms analyze the problem",
      icon: "🤖",
      color: "#9D4EDD",
      duration: 1000,
    },
    {
      title: "Solution Design",
      description: "Custom AI solution is designed for the specific challenge",
      icon: "🎨",
      color: "#00D9FF",
      duration: 1200,
    },
    {
      title: "Implementation",
      description: "Solution is deployed with real-time monitoring",
      icon: "🚀",
      color: "#00FF88",
      duration: 1400,
    },
    {
      title: "Results",
      description: "Measurable improvements and ROI achieved",
      icon: "📈",
      color: "#fbbf24",
      duration: 1000,
    },
  ];

  useEffect(() => {
    if (isActive && isInView && !isComplete) {
      const timer = setTimeout(() => {
        if (currentPhase < solutionPhases.length - 1) {
          setCurrentPhase(currentPhase + 1);
        } else {
          setIsComplete(true);
          onAnimationComplete?.();
        }
      }, solutionPhases[currentPhase]?.duration || 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, isActive, isInView, isComplete, onAnimationComplete]);

  useEffect(() => {
    if (isActive) {
      controls.start("visible");
    } else {
      controls.start("hidden");
      setCurrentPhase(0);
      setIsComplete(false);
    }
  }, [isActive, controls]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6 }}
        className="glass rounded-lg border border-neon-green/30 overflow-hidden"
      >
        {/* Solution Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 border-b border-white/10 bg-gradient-to-r from-neon-green/10 to-neon-blue/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{solution.title}</h3>
                <div className="text-sm text-neon-green">AI SOLUTION</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-neon-green">{solution.effectiveness}%</div>
              <div className="text-xs text-gray-400">Effectiveness</div>
            </div>
          </div>
        </motion.div>

        {/* Solution Phases */}
        <div className="p-6 space-y-4">
          <AnimatePresence mode="wait">
            {solutionPhases.slice(0, currentPhase + 1).map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: phase.color + "20", color: phase.color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {phase.icon}
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{phase.title}</h4>
                  <p className="text-sm text-gray-300">{phase.description}</p>
                </div>
                {index === currentPhase && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: phase.color }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Solution Description */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-4 border-t border-white/10"
            >
              <p className="text-gray-300 leading-relaxed">{solution.description}</p>
            </motion.div>
          )}

          {/* Solution Metrics */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{solution.implementationTime}</div>
                <div className="text-xs text-gray-400">Implementation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">{solution.roi}%</div>
                <div className="text-xs text-gray-400">Return on Investment</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-neon-blue"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentPhase + 1) / solutionPhases.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {currentPhase + 1}/{solutionPhases.length}
            </div>
          </div>
        </div>

        {/* Success Animation */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4"
          >
            <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-2xl"
              >
                ✅
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Combined problem-solution animation component
export function ProblemSolutionAnimation({
  problem,
  solution,
  onAnimationComplete,
  isActive,
  className = "",
}: {
  problem: UrbanProblem;
  solution: any;
  onAnimationComplete?: () => void;
  isActive: boolean;
  className?: string;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [problemRevealed, setProblemRevealed] = useState(false);

  const handleProblemRevealComplete = () => {
    setProblemRevealed(true);
    setTimeout(() => setShowSolution(true), 500);
  };

  const handleSolutionAnimationComplete = () => {
    onAnimationComplete?.();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <ProblemReveal
        problem={problem}
        onRevealComplete={handleProblemRevealComplete}
        isActive={isActive}
      />
      
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SolutionAnimation
              solution={solution}
              onAnimationComplete={handleSolutionAnimationComplete}
              isActive={showSolution}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

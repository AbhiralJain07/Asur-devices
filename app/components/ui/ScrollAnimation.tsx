"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: "fade" | "slide" | "scale";
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    up: {
      hidden: { opacity: 0, y: 100 },
      visible: { opacity: 1, y: 0 },
    },
    down: {
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0 },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
};

export default function ScrollAnimation({
  children,
  animation = "fade",
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
}: ScrollAnimationProps) {
  const getVariant = () => {
    switch (animation) {
      case "fade":
        return variants.fade;
      case "slide":
        return variants.slide[direction as keyof typeof variants.slide];
      case "scale":
        return variants.scale;
      default:
        return variants.fade;
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={getVariant()}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

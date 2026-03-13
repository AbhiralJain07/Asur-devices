import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "glass" | "neon" | "dark";
  padding?: "sm" | "md" | "lg";
  className?: string;
  hover?: boolean;
}

const variants = {
  default: "bg-background-secondary border border-white/10",
  glass: "glass",
  neon: "bg-background-secondary border border-neon-blue/50 neon-glow",
  dark: "bg-background-primary border border-white/5",
};

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  hover = true,
}: CardProps) {
  const baseClasses = "rounded-lg transition-all duration-300";
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className}`;

  return (
    <motion.div
      className={classes}
      whileHover={hover ? { y: -4, boxShadow: "0 20px 40px rgba(0, 217, 255, 0.3)" } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

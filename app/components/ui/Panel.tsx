import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  variant?: "default" | "glass" | "neon" | "cyber";
  className?: string;
}

const variants = {
  default: "bg-background-secondary border border-white/10",
  glass: "glass",
  neon: "bg-background-secondary border-l-4 border-l-neon-blue neon-glow",
  cyber: "bg-gradient-to-r from-background-secondary to-background-tertiary border border-neon-purple/30",
};

export default function Panel({
  children,
  variant = "default",
  className = "",
}: PanelProps) {
  const baseClasses = "rounded-lg overflow-hidden";
  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

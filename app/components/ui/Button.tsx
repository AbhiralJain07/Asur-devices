import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: "bg-neon-blue text-black hover:bg-neon-blue/80 neon-glow",
  secondary: "bg-neon-purple text-white hover:bg-neon-purple/80 neon-glow-purple",
  outline: "border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black",
  ghost: "text-neon-blue hover:bg-neon-blue/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  onKeyDown,
  "aria-label": ariaLabel,
  type = "button",
}: ButtonProps) {
  const baseClasses = "font-medium uppercase tracking-widest rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 uppercase tracking-widest">Loading...</span>
        </div>
      ) : (
        <span className="uppercase tracking-widest">{children}</span>
      )}
    </motion.button>
  );
}

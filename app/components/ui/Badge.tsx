import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variants = {
  primary: "bg-neon-blue/20 text-neon-blue border border-neon-blue/50",
  secondary: "bg-neon-purple/20 text-neon-purple border border-neon-purple/50",
  success: "bg-neon-green/20 text-neon-green border border-neon-green/50",
  warning: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50",
  error: "bg-red-500/20 text-red-500 border border-red-500/50",
};

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-colors";
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return <span className={classes}>{children}</span>;
}

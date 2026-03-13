"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedNavLinkProps {
  onClick?: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function AnimatedNavLink({ 
  onClick, 
  children, 
  isActive = false, 
  className = "" 
}: AnimatedNavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`
          relative transition-all duration-300 ease-in-out
          ${isActive ? "text-white" : "text-slate-400"}
          ${isHovered ? "text-white" : ""}
          ${isHovered ? "shadow-[0_0_8px_rgba(0,255,255,0.4)]" : ""}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        
        {/* Animated Underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-cyan-400"
          initial={{ width: 0 }}
          animate={{ 
            width: isHovered || isActive ? "100%" : 0,
            opacity: isHovered || isActive ? 1 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
        />
      </button>
    </div>
  );
}

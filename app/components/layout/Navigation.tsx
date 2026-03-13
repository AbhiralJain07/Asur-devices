"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Impact", href: "#impact" },
    { label: "Technology", href: "#technology" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold gradient-text">
            SmartCity AI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-neon-blue transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button className="px-6 py-2 bg-neon-blue text-black font-semibold rounded-lg hover:bg-neon-blue/80 transition-colors">
              Schedule Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 glass rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-gray-300 hover:text-neon-blue transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full mt-4 px-6 py-2 bg-neon-blue text-black font-semibold rounded-lg hover:bg-neon-blue/80 transition-colors">
              Schedule Demo
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

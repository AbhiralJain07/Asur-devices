"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSmoothScroll, SmoothScrollLink } from "./SmoothScroll";
import FullscreenGlobeModal from "./fullscreen-globe-modal";
import FullscreenAnalyticsModal from "./fullscreen-analytics-modal";
import { AnimatedNavLink } from "./AnimatedNavLink";

// Navigation item interface
interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  dropdown?: NavItem[];
  onClick?: () => void;
}

// Navigation data
const navigationItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "#home",
    icon: "🏠"
  },
  {
    id: "features",
    label: "Features",
    href: "#features",
    icon: "✨",
    dropdown: [
      { id: "globe", label: "3D Globe", href: "#globe" },
      { id: "analytics", label: "Analytics", href: "#analytics" },
      { id: "metrics", label: "Impact Metrics", href: "#metrics" }
    ]
  },
  {
    id: "technology",
    label: "Technology",
    href: "#technology",
    icon: "🚀"
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "#pricing",
    icon: "💎"
  },
  {
    id: "testimonials",
    label: "Testimonials",
    href: "#testimonials",
    icon: "💬"
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    icon: "📧",
    badge: "New"
  }
];

// Main navigation component
export function Navigation({
  variant = "default",
}: {
  variant?: "default" | "transparent" | "sticky";
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isGlobeModalOpen, setIsGlobeModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
      
      // Update active section based on scroll position
      const sections = navigationItems.map(item => item.id);
      const scrollPosition = window.pageYOffset + 100;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { top, height } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = elementTop + height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  const handleScheduleDemo = () => {
    // Emit custom event for modal
    window.dispatchEvent(new CustomEvent('openDemoModal'));
  };

  const handleNavigationClick = (href: string, label: string) => {
    // Special handling for Home button - scroll to very top
    if (href === '#home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      // Check if section exists for other buttons
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Show coming soon message for missing sections
        const message = `${label} section is coming soon!`;
        showToast(message, 'info');
      }
    }
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'info' ? 'bg-blue-500 text-white' : 
      type === 'success' ? 'bg-green-500 text-white' : 
      'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${variant === "transparent" && !isScrolled ? "bg-transparent" : "bg-black/80 backdrop-blur-md"}
          ${variant === "sticky" || isScrolled ? "shadow-lg" : ""}
          backdrop-blur-md
        `}
        onKeyDown={handleKeyDown}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <SmoothScrollLink href="#home" className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">SC</span>
              </div>
              <span className="text-white font-bold text-xl">Smart City</span>
            </SmoothScrollLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-x-8 ml-8">
              {navigationItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.dropdown ? (
                    <button 
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
                      onMouseEnter={() => setOpenDropdownId(item.id)}
                      onMouseLeave={() => setOpenDropdownId(null)}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                      <motion.svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: openDropdownId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                  ) : item.onClick ? (
                    <AnimatedNavLink
                      onClick={item.onClick}
                      isActive={activeSection === item.id}
                      className="flex items-center gap-2 py-2"
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-1 bg-neon-green text-black text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </AnimatedNavLink>
                  ) : (
                    <AnimatedNavLink
                      onClick={() => handleNavigationClick(item.href, item.label)}
                      isActive={activeSection === item.id}
                      className="flex items-center gap-2 py-2"
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-1 bg-neon-green text-black text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </AnimatedNavLink>
                  )}

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-lg border border-white/20 shadow-lg shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          dropdownItem.id === 'globe' ? (
                            <AnimatedNavLink
                              key={dropdownItem.id}
                              onClick={() => {
                                setIsGlobeModalOpen(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 ease-in-out rounded-full"
                            >
                              {dropdownItem.label}
                            </AnimatedNavLink>
                          ) : dropdownItem.id === 'analytics' ? (
                            <AnimatedNavLink
                              key={dropdownItem.id}
                              onClick={() => {
                                setIsAnalyticsModalOpen(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 ease-in-out rounded-full"
                            >
                              {dropdownItem.label}
                            </AnimatedNavLink>
                          ) : dropdownItem.id === 'metrics' ? (
                            <AnimatedNavLink
                              key={dropdownItem.id}
                              onClick={() => {
                                setIsAnalyticsModalOpen(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 ease-in-out rounded-full"
                            >
                              {dropdownItem.label}
                            </AnimatedNavLink>
                          ) : (
                            <SmoothScrollLink
                              key={dropdownItem.id}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 ease-in-out rounded-full"
                            >
                              {dropdownItem.label}
                            </SmoothScrollLink>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors hover:shadow-[0_0_15px_rgba(0,217,255,1)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]"
                onClick={handleScheduleDemo}
              >
                Schedule Demo
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors hover:shadow-[0_0_15px_rgba(0,217,255,1)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="container mx-auto px-6 py-4">
                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.id}>
                      {item.dropdown ? (
                        <div>
                          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2 w-full text-left hover:shadow-[0_0_10px_rgba(0,217,255,0.3)]">
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="pl-8 space-y-2">
                            {item.dropdown.map((dropdownItem) => (
                              dropdownItem.id === 'globe' ? (
                                <button
                                  key={dropdownItem.id}
                                  className="block w-full text-left py-2 text-sm text-gray-400 hover:text-white bg-black/95 backdrop-blur-md border border-white/20 rounded-lg px-4 transition-colors hover:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                                  onClick={() => {
                                    setIsGlobeModalOpen(true);
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {dropdownItem.label}
                                </button>
                              ) : dropdownItem.id === 'analytics' ? (
                                <button
                                  key={dropdownItem.id}
                                  className="block w-full text-left py-2 text-sm text-gray-400 hover:text-white bg-black/95 backdrop-blur-md border border-white/20 rounded-lg px-4 transition-colors hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                  onClick={() => {
                                    setIsAnalyticsModalOpen(true);
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {dropdownItem.label}
                                </button>
                              ) : dropdownItem.id === 'metrics' ? (
                                <button
                                  key={dropdownItem.id}
                                  className="block w-full text-left py-2 text-sm text-gray-400 hover:text-white bg-black/95 backdrop-blur-md border border-white/20 rounded-lg px-4 transition-colors hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                  onClick={() => {
                                    setIsAnalyticsModalOpen(true);
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  {dropdownItem.label}
                                </button>
                              ) : (
                            <SmoothScrollLink
                              key={dropdownItem.id}
                              href={dropdownItem.href}
                              className="block py-2 text-sm text-gray-400 hover:text-white bg-black/95 backdrop-blur-md border border-white/20 rounded-lg px-4 transition-colors hover:shadow-[0_0_10px_rgba(0,217,255,0.3)]"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </SmoothScrollLink>
                          )
                        ))}
                      </div>
                        </div>
                      ) : (
                        <SmoothScrollLink
                          href={item.href}
                          className={`flex items-center gap-2 py-2 transition-colors w-full hover:shadow-[0_0_10px_rgba(0,217,255,0.3)] ${
                            activeSection === item.id
                              ? "text-neon-blue"
                              : "text-gray-300 hover:text-white"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto px-2 py-1 bg-neon-green text-black text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </SmoothScrollLink>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors hover:shadow-[0_0_15px_rgba(0,217,255,1)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Schedule Demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Fullscreen Globe Modal */}
      <FullscreenGlobeModal 
        isOpen={isGlobeModalOpen} 
        onClose={() => setIsGlobeModalOpen(false)} 
      />
      
      {/* Fullscreen Analytics Modal */}
      <FullscreenAnalyticsModal 
        isOpen={isAnalyticsModalOpen} 
        onClose={() => setIsAnalyticsModalOpen(false)} 
      />
    </>
  );
}

// Breadcrumb navigation
export function BreadcrumbNavigation({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <SmoothScrollLink
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </SmoothScrollLink>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Footer component
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Technology", href: "#technology" },
      { label: "Pricing", href: "#pricing" },
      { label: "API Docs", href: "#" }
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" }
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Compliance", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: "🐦", href: "#", label: "Twitter" },
    { icon: "💼", href: "#", label: "LinkedIn" },
    { icon: "📘", href: "#", label: "Facebook" },
    { icon: "📺", href: "#", label: "YouTube" },
    { icon: "📷", href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">SC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Smart City Command Center</h3>
                <p className="text-sm text-gray-400">Transforming urban operations with AI-powered insights</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering cities worldwide with intelligent monitoring, predictive analytics, and automated decision-making for a smarter, more sustainable urban future.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-neon-blue/20 hover:text-neon-blue transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <SmoothScrollLink
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </SmoothScrollLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-white/10 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Stay Updated</h4>
                <p className="text-gray-400 mb-4">
                  Get the latest smart city innovations and best practices delivered to your inbox.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {currentYear} Smart City Command Center. All rights reserved.
              </div>
              
              <div className="flex flex-wrap gap-6">
                {footerLinks.legal.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <span>Powered by</span>
                <div className="flex items-center gap-2">
                  <span className="text-neon-blue">⚛️</span>
                  <span>Next.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-green">🎨</span>
                  <span>TailwindCSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}

// Quick actions floating button
export function QuickActions({
  className = "",
}: {
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  const quickActions = [
    { icon: "📧", label: "Contact", href: "#contact" },
    { icon: "📅", label: "Schedule Demo", href: "#contact" },
    { icon: "💬", label: "Chat Support", href: "#" },
    { icon: "📞", label: "Call Us", href: "tel:+1234567890" },
    { icon: "⬆️", label: "Back to Top", onClick: scrollToTop }
  ];

  return (
    <div className={`fixed bottom-8 left-8 z-40 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass rounded-lg border border-white/10 p-2 mb-4"
          >
            <div className="flex flex-col gap-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (action.onClick) {
                      action.onClick();
                    }
                    setIsOpen(false);
                  }}
                  className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors group"
                  title={action.label}
                >
                  {action.href ? (
                    <a href={action.href} className="text-lg">
                      {action.icon}
                    </a>
                  ) : (
                    <span className="text-lg">{action.icon}</span>
                  )}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-neon-blue text-black rounded-full flex items-center justify-center shadow-lg hover:bg-neon-blue/80 transition-colors"
        aria-label="Quick actions"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0, opacity: 1 }}
              animate={{ rotate: 45, opacity: 1 }}
              exit={{ rotate: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010-2zm0 7a1 1 0 110-2 1 1 0 010-2zm0 7a1 1 0 110-2 1 1 0 010-2z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

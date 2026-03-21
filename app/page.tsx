"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "./components/ui/Navigation";
import HeroSection from "./components/sections/HeroSection";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Pricing } from "@/components/ui/single-pricing-card-1";
import Testimonials from "@/components/ui/testimonials-demo";
import Button from "./components/ui/Button";

// Toast notification component
function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 px-6 py-3 bg-neon-blue text-black rounded-lg shadow-lg shadow-neon-blue/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Modal component
function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", city: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-md mx-4 glass rounded-2xl border border-white/20 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Schedule Demo</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
              
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Schedule Demo
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🏙️",
      title: "Real-time Monitoring",
      description: "Track city metrics and infrastructure performance with live data streams and AI-powered analytics",
      color: "neon-blue"
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Leverage machine learning algorithms to predict traffic patterns and optimize city operations",
      color: "neon-green"
    },
    {
      icon: "📊",
      title: "Predictive Analytics",
      description: "Forecast urban trends and make data-driven decisions for sustainable city planning",
      color: "neon-purple"
    },
    {
      icon: "🌐",
      title: "Smart Integration",
      description: "Seamlessly connect existing infrastructure with our unified management platform",
      color: "neon-pink"
    },
    {
      icon: "🛡️",
      title: "Advanced Security",
      description: "Protect critical infrastructure with enterprise-grade security and threat detection",
      color: "neon-yellow"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process millions of data points in real-time for instant decision making",
      color: "neon-blue"
    }
  ];

  return (
    <section id="features" className="scroll-mt-20 pt-24 pb-16 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Comprehensive smart city management tools designed for modern urban challenges
          </p>
        </motion.div>
        
        {/* Container Scroll Animation */}
        <ContainerScroll
          titleComponent={
            <>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
                Experience Our <br />
                <span className="text-neon-blue">Smart City Platform</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 px-4">
                Scroll to see our powerful features in action
              </p>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8 hover:border-neon-blue/30 transition-all duration-300 group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`text-3xl sm:text-4xl mb-3 sm:mb-4 ${feature.color === "neon-blue" ? "text-neon-blue" : feature.color === "neon-green" ? "text-neon-green" : feature.color === "neon-purple" ? "text-neon-purple" : feature.color === "neon-pink" ? "text-neon-pink" : "text-neon-yellow"}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}

// Impact Section
function ImpactSection() {
  const metrics = [
    { value: "35%", label: "Traffic Reduction", color: "neon-blue" },
    { value: "25%", label: "Air Quality Improvement", color: "neon-green" },
    { value: "$2M+", label: "Annual Savings", color: "neon-purple" },
    { value: "50+", label: "Cities Served", color: "neon-pink" }
  ];

  return (
    <section id="impact" className="scroll-mt-20 py-24 bg-background-secondary">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Proven Impact</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Real results from cities already using SmartCity AI technology
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-5xl font-bold mb-2 ${
                metric.color === "neon-blue" ? "text-neon-blue" :
                metric.color === "neon-green" ? "text-neon-green" :
                metric.color === "neon-purple" ? "text-neon-purple" :
                "text-neon-pink"
              }`}>
                {metric.value}
              </div>
              <div className="text-gray-300 text-lg">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section Component
function PricingSection() {
  return <Pricing />;
}

// Testimonials Section Component
function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-20 pt-16 sm:pt-20 pb-20 sm:pb-24 bg-background-primary">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8"
        >
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-center items-center min-h-[600px] mt-4"
        >
          <Testimonials />
        </motion.div>
      </div>
    </section>
  );
}

// Contact Section Component
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    
    // Show success toast
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 z-50 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg transition-all duration-300';
    successToast.textContent = 'Signal Transmitted Successfully!';
    document.body.appendChild(successToast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      successToast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 300);
    }, 3000);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', organization: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 bg-background-primary relative overflow-hidden">
      {/* Corner fade effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-neon-cyan/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-neon-green/10 to-transparent pointer-events-none"></div>
  <div className="container mx-auto px-6 max-w-7xl relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="text-center mb-8"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-heading font-semibold text-4xl md:text-5xl uppercase tracking-widest mb-4"
        style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
      >
        <span className="text-neon-blue">GET IN</span> TOUCH
      </motion.h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Ready to transform your city? Send us a signal and our agents will reach out shortly.
      </p>
    </motion.div>
        
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-8 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                    placeholder="john@city.gov"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                  City/Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                  placeholder="Smart City Department"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all resize-none"
                  placeholder="Tell us about your smart city needs..."
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0, 217, 255, 0.7)",
                    "0 0 0 10px rgba(0, 217, 255, 0)",
                    "0 0 0 0 rgba(0, 217, 255, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] border-2 border-white/20"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl border border-neon-green/50 p-12 backdrop-blur-md text-center"
          >
            <div className="text-6xl mb-6">📡</div>
            <h3 className="text-2xl font-bold text-neon-green mb-4">
              Signal Received
            </h3>
            <p className="text-gray-300 text-lg">
              Our agents will reach out shortly.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Technology Section
function TechnologySection() {
  const technologies = [
    {
      title: "AI-Powered Analytics",
      description: "Machine learning algorithms analyze city data patterns and provide actionable insights.",
      icon: "🤖"
    },
    {
      title: "IoT Integration",
      description: "Seamless integration with thousands of sensors and smart devices.",
      icon: "📡"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud platform for real-time data processing and storage.",
      icon: "☁️"
    },
    {
      title: "Blockchain Security",
      description: "Secure, transparent data management with blockchain technology.",
      icon: "🔗"
    }
  ];

  return (
    <section id="technology" className="scroll-mt-20 py-24 bg-background-secondary">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Cutting-Edge Technology</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Built with latest technologies for maximum performance and reliability
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="relative h-full rounded-2xl border border-white/10 p-4 sm:p-6 md:p-8 hover:border-neon-blue/30 transition-all duration-300">
                <GlowingEffect
                  spread={30}
                  glow={true}
                  disabled={false}
                  proximity={60}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-neon-blue">{tech.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{tech.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{tech.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    const handleShowToast = () => setShowToast(true);

    window.addEventListener('openDemoModal', handleOpenModal);
    window.addEventListener('showDashboardToast', handleShowToast);

    // Handle scroll for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('openDemoModal', handleOpenModal);
      window.removeEventListener('showDashboardToast', handleShowToast);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ImpactSection />
      <TechnologySection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 p-3 sm:p-4 bg-neon-blue text-black rounded-full shadow-lg transition-all duration-300 hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toast message="Connecting to City Neural Network..." isVisible={showToast} />
    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccessibilityVisualization } from "./AccessibilityVisualization";

// CTA button component
export function CTAButton({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-neon-blue text-black hover:bg-neon-blue/80 disabled:bg-gray-600 disabled:text-gray-400";
      case "secondary":
        return "bg-neon-green text-black hover:bg-neon-green/80 disabled:bg-gray-600 disabled:text-gray-400";
      case "outline":
        return "border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black disabled:border-gray-600 disabled:text-gray-400";
      case "ghost":
        return "text-white hover:bg-white/10 disabled:text-gray-400";
      default:
        return "bg-neon-blue text-black hover:bg-neon-blue/80";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-4 py-2 text-sm";
      case "medium":
        return "px-6 py-3 text-base";
      case "large":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-blue/50
        ${getVariantClasses()} ${getSizeClasses()} ${className}
      `}
    >
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {icon && !loading && (
        <span className="flex items-center">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {loading && <span className="opacity-0">{children}</span>}
    </motion.button>
  );
}

// Demo scheduling form
export function DemoScheduleForm({
  title = "Schedule a Demo",
  description = "See how our Smart City Command Center can transform your urban operations",
  onSubmit,
  className = "",
}: {
  title?: string;
  description?: string;
  onSubmit?: (data: DemoFormData) => void;
  className?: string;
}) {
  const [formData, setFormData] = useState<DemoFormData>({
    name: "",
    email: "",
    company: "",
    jobTitle: "",
    citySize: "",
    phone: "",
    interests: [],
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  interface DemoFormData {
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    citySize: string;
    phone: string;
    interests: string[];
    preferredDate: string;
    preferredTime: string;
    message: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        interests: checkbox.checked
          ? [...prev.interests, value]
          : prev.interests.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmit?.(formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-lg border border-green-500/30 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Demo Scheduled!</h3>
          <p className="text-gray-300 mb-6">
            Thank you for your interest. We'll contact you within 24 hours to confirm your demo session.
          </p>
          
          <CTAButton
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                company: "",
                jobTitle: "",
                citySize: "",
                phone: "",
                interests: [],
                preferredDate: "",
                preferredTime: "",
                message: "",
              });
            }}
            variant="outline"
          size="medium"
          >
            Schedule Another Demo
          </CTAButton>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                Company/Organization *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="City Administration"
              />
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="Chief Technology Officer"
              />
            </div>

            {/* City Size */}
            <div>
              <label htmlFor="citySize" className="block text-sm font-medium text-gray-300 mb-2">
                City Size *
              </label>
              <select
                id="citySize"
                name="citySize"
                value={formData.citySize}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
              >
                <option value="">Select city size</option>
                <option value="small">Small (&lt;100K residents)</option>
                <option value="medium">Medium (100K-500K residents)</option>
                <option value="large">Large (500K-1M residents)</option>
                <option value="xlarge">Extra Large (&gt;1M residents)</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Areas of Interest
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Traffic Management",
                "Environmental Monitoring",
                "Waste Management",
                "Energy Optimization",
                "Public Safety",
                "Infrastructure Planning"
              ].map((interest) => (
                <label key={interest} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInputChange}
                    className="w-4 h-4 bg-white/10 border border-white/20 rounded text-neon-blue focus:ring-2 focus:ring-neon-blue/50"
                  />
                  <span className="text-sm text-gray-300">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Time
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
              >
                <option value="">Select time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent resize-none"
              placeholder="Tell us about your specific needs or questions..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <CTAButton
              type="submit"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={
                !isSubmitting && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              }
            >
              {isSubmitting ? "Scheduling..." : "Schedule Demo"}
            </CTAButton>
          </div>
        </form>
      </div>
    </AccessibilityVisualization>
  );
}

// Contact form component
export function ContactForm({
  title = "Get in Touch",
  description = "Have questions? We're here to help you transform your city operations.",
  onSubmit,
  className = "",
}: {
  title?: string;
  description?: string;
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    message: "",
    contactMethod: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  interface ContactFormData {
    name: string;
    email: string;
    company: string;
    message: string;
    contactMethod: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit?.(formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-lg border border-green-500/30 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-gray-300 mb-6">
            We'll get back to you within 24 hours.
          </p>
          
          <CTAButton
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                company: "",
                message: "",
                contactMethod: "email",
              });
            }}
            variant="outline"
            size="medium"
          >
            Send Another Message
          </CTAButton>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-300">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
              placeholder="Your organization"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent resize-none"
              placeholder="How can we help you?"
            />
          </div>

          <div>
            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Contact Method
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="flex justify-center">
            <CTAButton
              type="submit"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </CTAButton>
          </div>
        </form>
      </div>
    </AccessibilityVisualization>
  );
}

// Newsletter signup component
export function NewsletterSignup({
  title = "Stay Updated",
  description = "Get the latest updates on smart city innovations and best practices.",
  className = "",
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    setEmail("");
  };

  if (isSubscribed) {
    return (
      <AccessibilityVisualization className={className}>
        <div className="glass rounded-lg border border-green-500/30 p-6 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Successfully Subscribed!</h3>
          <p className="text-gray-300 text-sm">
            Check your email for confirmation.
          </p>
        </div>
      </AccessibilityVisualization>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
          />
          
          <CTAButton
            type="submit"
            size="medium"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={
              !isSubmitting && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0l7.89-5.26a2 2 0 012.22 0l7.89 5.26V21a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26L21 8" />
                </svg>
              )
            }
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </CTAButton>
        </form>
      </div>
    </AccessibilityVisualization>
  );
}

// Pricing CTA component
export function PricingCTA({
  title = "Ready to Transform Your City?",
  description = "Join hundreds of cities already using our platform to deliver better services to their citizens.",
  features = [
    "Free 30-day trial",
    "No credit card required",
    "Dedicated support team",
    "Custom implementation available"
  ],
  className = "",
}: {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <div className="glass rounded-lg border border-white/10 p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CTAButton
            size="large"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            Start Free Trial
          </CTAButton>
          
          <CTAButton
            variant="outline"
            size="large"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 2.493a1 1 0 01.502.86l1.064 1.773a1 1 0 01.99.928l1.218 1.935a1 1 0 01.925.811l1.56 2.462a1 1 0 01.961.66l1.818.56a1 1 0 01.893.562l1.667 1.424a1 1 0 01.834.8l1.864.542a1 1 0 01.833.687l1.826.398a1 1 0 01.823.524l1.78.16a1 1 0 00.814.26l1.73.004a1 1 0 00.8-.086l1.67-.15a1 1 0 00.786-.28l1.643-.282a1 1 0 00.774-.37l1.6-.358a1 1 0 00.765-.438l1.55-.447a1 1 0 00.753-.515L19 14a1 1 0 00.74-.534l1.34-.546a1 1 0 00.727-.577l1.185-.523a1 1 0 00.713-.605l1.029-.501a1 1 0 00.697-.627l.841-.485a1 1 0 00.68-.696l.58-.393a1 1 0 00.663-.78l.353-.284a1 1 0 00.642-.864l.048-.215a1 1 0 00.61-.986l-.08-.25a1 1 0 00.572-1.11l-.136-.313a1 1 0 00.525-1.22l-.194-.357a1 1 0 00.473-1.33l-.25-.437a1 1 0 00.416-1.433l-.312-.508a1 1 0 00.352-1.527l-.37-.586a1 1 0 00.28-1.61l-.42-.7a1 1 0 00.196-1.68l-.464-.8a1 1 0 00.104-1.735L7 3a1 1 0 011 0h4a1 1 0 011 1v20a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1z" />
              </svg>
            }
          >
            View Pricing
          </CTAButton>
        </div>
      </div>
    </AccessibilityVisualization>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollAnimation } from "../ui";

// Technology stack data
const techStack = {
  frontend: [
    {
      name: "Next.js 16",
      description: "React framework with server-side rendering and optimized performance",
      icon: "⚛️",
      color: "#000000",
      features: ["Server Components", "App Router", "Optimized Performance", "TypeScript Support"],
      category: "framework"
    },
    {
      name: "React 19",
      description: "Modern React with concurrent features and optimized rendering",
      icon: "⚛️",
      color: "#61DAFB",
      features: ["Concurrent Rendering", "Suspense", "Server Components", "Hooks"],
      category: "framework"
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript for better development experience and code quality",
      icon: "📘",
      color: "#3178C6",
      features: ["Type Safety", "IntelliSense", "Better Refactoring", "Documentation"],
      category: "language"
    },
    {
      name: "TailwindCSS",
      description: "Utility-first CSS framework for rapid UI development",
      icon: "🎨",
      color: "#06B6D4",
      features: ["Utility Classes", "Responsive Design", "Dark Mode", "Customization"],
      category: "styling"
    }
  ],
  visualization: [
    {
      name: "Three.js",
      description: "3D graphics library for creating immersive visualizations",
      icon: "🎮",
      color: "#000000",
      features: ["3D Rendering", "WebGL", "Animations", "Performance Optimized"],
      category: "graphics"
    },
    {
      name: "React Three Fiber",
      description: "React renderer for Three.js with declarative components",
      icon: "🔮",
      color: "#EC1E24",
      features: ["React Integration", "Declarative", "Performance", "Hooks"],
      category: "graphics"
    },
    {
      name: "Drei",
      description: "Helper library for React Three Fiber with common abstractions",
      icon: "🛠️",
      color: "#FF6B6B",
      features: ["Helper Components", "Abstractions", "Controls", "Post-processing"],
      category: "graphics"
    },
    {
      name: "Framer Motion",
      description: "Production-ready motion library for React with smooth animations",
      icon: "🎬",
      color: "#0055FF",
      features: ["Smooth Animations", "Gestures", "Layout Animations", "Scroll-triggered"],
      category: "animation"
    }
  ],
  backend: [
    {
      name: "Node.js",
      description: "JavaScript runtime for server-side development and APIs",
      icon: "🟢",
      color: "#339933",
      features: ["Event-driven", "Non-blocking I/O", "NPM Ecosystem", "Scalable"],
      category: "runtime"
    },
    {
      name: "WebSockets",
      description: "Real-time bidirectional communication for live data updates",
      icon: "🔌",
      color: "#010101",
      features: ["Real-time", "Bidirectional", "Low Latency", "Efficient"],
      category: "communication"
    },
    {
      name: "RESTful APIs",
      description: "Standardized API architecture for data exchange",
      icon: "🌐",
      color: "#FF6B35",
      features: ["RESTful", "Stateless", "Scalable", "Standardized"],
      category: "api"
    }
  ],
  data: [
    {
      name: "Real-time Data Streams",
      description: "Live data processing and visualization for smart city metrics",
      icon: "📊",
      color: "#9333EA",
      features: ["Live Processing", "Stream Analytics", "Real-time Updates", "Scalable"],
      category: "processing"
    },
    {
      name: "Machine Learning",
      description: "AI-powered analytics and predictive modeling for urban insights",
      icon: "🤖",
      color: "#FF6B6B",
      features: ["Predictive Analytics", "Pattern Recognition", "Anomaly Detection", "Automation"],
      category: "ai"
    },
    {
      name: "IoT Integration",
      description: "Connected sensors and devices for comprehensive city monitoring",
      icon: "📡",
      color: "#10B981",
      features: ["Sensor Networks", "Real-time Monitoring", "Data Collection", "Smart Devices"],
      category: "iot"
    }
  ],
  infrastructure: [
    {
      name: "Cloud Architecture",
      description: "Scalable cloud infrastructure for reliable performance",
      icon: "☁️",
      color: "#0EA5E9",
      features: ["Scalable", "Reliable", "Global CDN", "Auto-scaling"],
      category: "cloud"
    },
    {
      name: "Microservices",
      description: "Modular architecture for maintainable and scalable applications",
      icon: "🏗️",
      color: "#8B5CF6",
      features: ["Modular", "Scalable", "Independent", "Resilient"],
      category: "architecture"
    },
    {
      name: "CDN",
      description: "Content delivery network for fast global content distribution",
      icon: "🚀",
      color: "#F59E0B",
      features: ["Fast Delivery", "Global", "Cached", "Optimized"],
      category: "performance"
    }
  ]
};

// Technology card component
function TechCard({ tech, index }: { tech: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-lg border border-white/10 overflow-hidden hover:border-neon-blue/30 transition-all cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${tech.color}20`, border: `2px solid ${tech.color}` }}
          >
            {tech.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{tech.name}</h3>
            <p className="text-sm text-gray-400">{tech.category}</p>
          </div>
        </div>

        <p className="text-gray-300 mb-4">{tech.description}</p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 pt-4"
            >
              <h4 className="text-sm font-bold text-white mb-3">Key Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tech.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="text-neon-blue hover:text-neon-blue/80 text-sm font-medium mt-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Show Less" : "Learn More"}
        </button>
      </div>
    </motion.div>
  );
}

// Category section component
function TechCategory({ 
  title, 
  description, 
  technologies, 
  bgColor, 
  borderColor 
}: { 
  title: string; 
  description: string; 
  technologies: any[]; 
  bgColor: string; 
  borderColor: string; 
}) {
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-6">
        <ScrollAnimation animation="fade" direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex mb-4">
              <div className={`px-4 py-2 ${borderColor} rounded-full`}>
                <span className="text-sm font-medium">{title}</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <TechCard key={tech.name} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Performance metrics component
function PerformanceMetrics() {
  const metrics = [
    { label: "Page Load", value: "1.2s", target: "< 2s", achieved: true },
    { label: "Animation FPS", value: "60", target: "60fps", achieved: true },
    { label: "Lighthouse Score", value: "95", target: "> 90", achieved: true },
    { label: "Bundle Size", value: "142KB", target: "< 200KB", achieved: true },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <ScrollAnimation animation="fade" direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Performance Metrics
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Optimized for speed and efficiency with industry-leading performance standards
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg border border-white/10 p-6 text-center"
            >
              <div className="text-3xl font-bold text-neon-green mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-gray-300 mb-2">{metric.label}</div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${metric.achieved ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="text-xs text-gray-400">Target: {metric.target}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Architecture diagram component
function ArchitectureDiagram() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <ScrollAnimation animation="fade" direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              System Architecture
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Scalable, maintainable, and performant architecture designed for growth
            </p>
          </div>
        </ScrollAnimation>

        <div className="glass rounded-lg border border-white/10 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Frontend Layer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-neon-blue/20 border-2 border-neon-blue flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Frontend Layer</h3>
              <p className="text-gray-300 text-sm mb-4">
                React-based UI with real-time updates and smooth animations
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">• Next.js 16</div>
                <div className="text-xs text-gray-400">• React 19</div>
                <div className="text-xs text-gray-400">• TypeScript</div>
                <div className="text-xs text-gray-400">• TailwindCSS</div>
              </div>
            </motion.div>

            {/* Backend Layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-neon-green/20 border-2 border-neon-green flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Backend Layer</h3>
              <p className="text-gray-300 text-sm mb-4">
                Scalable API layer with real-time data processing
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">• Node.js</div>
                <div className="text-xs text-gray-400">• WebSockets</div>
                <div className="text-xs text-gray-400">• RESTful APIs</div>
                <div className="text-xs text-gray-400">• Microservices</div>
              </div>
            </motion.div>

            {/* Data Layer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-neon-purple/20 border-2 border-neon-purple flex items-center justify-center">
                <span className="text-2xl">🗄️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Data Layer</h3>
              <p className="text-gray-300 text-sm mb-4">
                Real-time data streams and ML-powered analytics
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-400">• Real-time Streams</div>
                <div className="text-xs text-gray-400">• Machine Learning</div>
                <div className="text-xs text-gray-400">• IoT Integration</div>
                <div className="text-xs text-gray-400">• Cloud Storage</div>
              </div>
            </motion.div>
          </div>

          {/* Connection lines */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-0.5 bg-neon-blue" />
              <div className="w-8 h-0.5 bg-neon-green" />
              <div className="w-8 h-0.5 bg-neon-purple" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main technology stack section
export default function TechnologyStackSection({
  title = "Powered by Modern Technology",
  subtitle = "Built with cutting-edge technologies for optimal performance and scalability",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
          {/* Section Header */}
          <ScrollAnimation animation="fade" direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex mb-4">
                <div className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-full">
                  <span className="text-neon-blue text-sm font-medium">
                    🚀 Technology Stack
                  </span>
                </div>
              </div>
              
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="gradient-text">{title}</span>
              </motion.h2>

              <motion.p 
                className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            </div>
          </ScrollAnimation>
        </div>

        {/* Technology Categories */}
        <TechCategory
          title="Frontend Technologies"
          description="Modern React-based frontend stack with optimized performance and user experience"
          technologies={techStack.frontend}
          bgColor="bg-gradient-to-b from-transparent to-white/5"
          borderColor="border-neon-blue/30 text-neon-blue"
        />

        <TechCategory
          title="Visualization & Animation"
          description="Advanced 3D graphics and smooth animations for immersive user experiences"
          technologies={techStack.visualization}
          bgColor="bg-white/5"
          borderColor="border-neon-green/30 text-neon-green"
        />

        <TechCategory
          title="Backend & APIs"
          description="Scalable backend architecture with real-time data processing capabilities"
          technologies={techStack.backend}
          bgColor="bg-gradient-to-b from-white/5 to-transparent"
          borderColor="border-neon-purple/30 text-neon-purple"
        />

        <TechCategory
          title="Data & Intelligence"
          description="AI-powered analytics and IoT integration for smart city insights"
          technologies={techStack.data}
          bgColor="bg-gradient-to-b from-transparent to-white/5"
          borderColor="border-yellow-500/30 text-yellow-500"
        />

        <TechCategory
          title="Infrastructure & Performance"
          description="Cloud-native infrastructure designed for scalability and reliability"
          technologies={techStack.infrastructure}
          bgColor="bg-white/5"
          borderColor="border-orange-500/30 text-orange-500"
        />

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Call to Action */}
        <ScrollAnimation animation="slide" direction="up" delay={1.6}>
          <div className="text-center py-16">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Experience the Technology?
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See how our advanced technology stack powers real-world smart city solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors">
                  Schedule Demo
                </button>
                <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-medium hover:border-white/40 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>
  );
}

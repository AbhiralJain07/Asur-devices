"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerTestimonial, TestimonialCollection, IndustryType, CompanySize } from "../../types/testimonials";
import { TestimonialCard, TestimonialCarousel, TestimonialGrid, FeaturedTestimonial } from "../ui/TestimonialCard";
import { ScrollAnimation } from "../ui";
import { ResponsiveVisualization } from "../ui/ResponsiveVisualization";
import { AccessibilityVisualization } from "../ui/AccessibilityVisualization";

// Sample testimonial data
const sampleTestimonials: CustomerTestimonial[] = [
  {
    id: "testimonial-1",
    customer: {
      id: "customer-1",
      name: "Sarah Chen",
      title: "Chief Technology Officer",
      company: {
        name: "Metro City Administration",
        industry: "government",
        size: "large",
        website: "https://metro-city.gov",
        logo: "/images/logos/metro-city.png",
        description: "Municipal government serving 2.5M residents",
        employees: 15000,
      },
      avatar: {
        url: "/images/avatars/sarah-chen.jpg",
        alt: "Sarah Chen - CTO of Metro City",
        size: 80,
        format: "circle",
      },
      contact: {
        email: "sarah.chen@metro-city.gov",
        linkedin: "sarah-chen-cto",
      },
      location: {
        city: "Metro City",
        state: "California",
        country: "USA",
      },
    },
    testimonial: {
      quote: "The Smart City Command Center has transformed how we manage urban operations. We've reduced emergency response times by 35% and cut operational costs by $2.4M annually. The AI-powered insights are invaluable for city planning.",
      summary: "Achieved significant cost savings and improved emergency response times",
      highlights: ["35% faster response", "$2.4M savings", "AI-powered insights"],
      context: "City-wide implementation across all departments",
      experience: "expert",
      useCase: "emergency_response",
      challenges: ["Legacy systems integration", "Data silos", "Response coordination"],
      solutions: ["Unified dashboard", "Real-time analytics", "Predictive modeling"],
      results: [
        {
          category: "efficiency",
          description: "Emergency response time improvement",
          metric: "Response Time",
          value: 35,
          unit: "%",
          improvement: 35,
          timeframe: "6 months",
        },
        {
          category: "cost_savings",
          description: "Annual operational cost reduction",
          metric: "Cost Savings",
          value: 2400000,
          unit: "$",
          improvement: 18.5,
          timeframe: "12 months",
        },
      ],
      duration: "18 months",
      language: "en",
    },
    rating: {
      overall: 5,
      categories: [
        { category: "ease_of_use", score: 5 },
        { category: "features", score: 5 },
        { category: "performance", score: 5 },
        { category: "support", score: 4 },
      ],
      verified: true,
      date: new Date("2024-01-15"),
    },
    project: {
      name: "Metro City Smart Operations",
      description: "Complete digital transformation of city operations",
      type: "full_implementation",
      scope: "city_wide",
      duration: "18 months",
      budget: "$5.2M",
      team_size: 25,
      technologies: ["AI/ML", "IoT", "Cloud Computing", "Data Analytics"],
      challenges: ["System integration", "Data quality", "Change management"],
      outcomes: [
        {
          category: "efficiency",
          description: "Improved operational efficiency",
          achieved: true,
          impact: "Streamlined processes across all departments",
          metrics: { before: 65, after: 85, unit: "%" },
        },
      ],
    },
    media: {
      images: [
        {
          url: "/images/testimonials/metro-city-dashboard.jpg",
          alt: "Metro City Command Center Dashboard",
          category: "screenshot",
          size: "large",
        },
        {
          url: "/images/testimonials/metro-city-team.jpg",
          alt: "Metro City implementation team",
          category: "team_photo",
          size: "medium",
        },
      ],
      videos: [],
      documents: [],
      case_study: {
        url: "/case-studies/metro-city",
        title: "Metro City Digital Transformation",
        summary: "Complete case study of Metro City's smart city implementation",
        format: "pdf",
        length: "12 pages",
        downloadUrl: "/downloads/metro-city-case-study.pdf",
      },
    },
    metadata: {
      tags: ["government", "emergency-response", "efficiency"],
      keywords: ["smart city", "digital transformation", "AI"],
      source: {
        type: "interview",
        date: new Date("2024-01-15"),
      },
      priority: "high",
      language: "en",
      verified: true,
      featured: true,
    },
    status: "published",
    featured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "testimonial-2",
    customer: {
      id: "customer-2",
      name: "Michael Rodriguez",
      title: "Director of Transportation",
      company: {
        name: "Green Valley Transit Authority",
        industry: "transportation",
        size: "medium",
        website: "https://gvta.gov",
        logo: "/images/logos/gvta.png",
        description: "Public transportation serving 500K daily riders",
        employees: 2500,
      },
      avatar: {
        url: "/images/avatars/michael-rodriguez.jpg",
        alt: "Michael Rodriguez - Director of Transportation",
        size: 80,
        format: "circle",
      },
      location: {
        city: "Green Valley",
        state: "Texas",
        country: "USA",
      },
    },
    testimonial: {
      quote: "Our traffic management system has been revolutionized. Commute times are down 28% and rider satisfaction is at an all-time high. The predictive analytics help us optimize routes in real-time.",
      summary: "Significant improvements in traffic flow and rider satisfaction",
      highlights: ["28% faster commutes", "95% satisfaction", "Real-time optimization"],
      context: "Public transportation optimization and management",
      experience: "advanced",
      useCase: "traffic_management",
      challenges: ["Traffic congestion", "Route optimization", "Rider experience"],
      solutions: ["AI-powered routing", "Real-time monitoring", "Predictive analytics"],
      results: [
        {
          category: "efficiency",
          description: "Average commute time reduction",
          metric: "Commute Time",
          value: 28,
          unit: "%",
          improvement: 28,
          timeframe: "3 months",
        },
        {
          category: "satisfaction",
          description: "Rider satisfaction score",
          metric: "Satisfaction",
          value: 95,
          unit: "%",
          improvement: 22,
          timeframe: "6 months",
        },
      ],
      duration: "12 months",
      language: "en",
    },
    rating: {
      overall: 5,
      categories: [
        { category: "ease_of_use", score: 5 },
        { category: "features", score: 5 },
        { category: "performance", score: 5 },
        { category: "support", score: 5 },
      ],
      verified: true,
      date: new Date("2024-02-20"),
    },
    project: {
      name: "Smart Transit Management System",
      description: "AI-powered traffic and transit management",
      type: "full_implementation",
      scope: "city_wide",
      duration: "12 months",
      budget: "$2.8M",
      team_size: 15,
      technologies: ["AI/ML", "IoT Sensors", "Mobile Apps", "Cloud Analytics"],
      challenges: ["Legacy infrastructure", "Data integration", "User adoption"],
      outcomes: [
        {
          category: "efficiency",
          description: "Improved traffic flow and reduced congestion",
          achieved: true,
          impact: "Better commute times and reduced emissions",
          metrics: { before: 45, after: 72, unit: "%" },
        },
      ],
    },
    media: {
      images: [
        {
          url: "/images/testimonials/gvta-control-center.jpg",
          alt: "Green Valley Transit Control Center",
          category: "implementation",
          size: "large",
        },
      ],
      videos: [],
      documents: [],
    },
    metadata: {
      tags: ["transportation", "traffic", "transit"],
      keywords: ["smart transit", "traffic management", "AI"],
      source: {
        type: "direct_request",
        date: new Date("2024-02-20"),
      },
      priority: "medium",
      language: "en",
      verified: true,
      featured: false,
    },
    status: "published",
    featured: false,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "testimonial-3",
    customer: {
      id: "customer-3",
      name: "Dr. Emily Watson",
      title: "Environmental Director",
      company: {
        name: "EcoSmart Solutions",
        industry: "technology",
        size: "small",
        website: "https://ecosmart.ai",
        logo: "/images/logos/ecosmart.png",
        description: "AI-powered environmental monitoring startup",
        employees: 150,
      },
      avatar: {
        url: "/images/avatars/emily-watson.jpg",
        alt: "Dr. Emily Watson - Environmental Director",
        size: 80,
        format: "circle",
      },
      location: {
        city: "Seattle",
        state: "Washington",
        country: "USA",
      },
    },
    testimonial: {
      quote: "The environmental monitoring capabilities are exceptional. We've reduced carbon emissions by 42% and improved air quality monitoring accuracy by 65%. The real-time alerts help us respond to issues immediately.",
      summary: "Significant environmental improvements and monitoring accuracy",
      highlights: ["42% emissions reduction", "65% monitoring accuracy", "Real-time alerts"],
      context: "Environmental monitoring and sustainability initiatives",
      experience: "expert",
      useCase: "pollution_monitoring",
      challenges: ["Data accuracy", "Real-time monitoring", "Regulatory compliance"],
      solutions: ["AI sensors", "Predictive modeling", "Automated reporting"],
      results: [
        {
          category: "environmental",
          description: "Carbon emissions reduction",
          metric: "Carbon Reduction",
          value: 42,
          unit: "%",
          improvement: 42,
          timeframe: "9 months",
        },
        {
          category: "efficiency",
          description: "Monitoring accuracy improvement",
          metric: "Accuracy",
          value: 65,
          unit: "%",
          improvement: 65,
          timeframe: "6 months",
        },
      ],
      duration: "9 months",
      language: "en",
    },
    rating: {
      overall: 5,
      categories: [
        { category: "ease_of_use", score: 4 },
        { category: "features", score: 5 },
        { category: "performance", score: 5 },
        { category: "support", score: 5 },
      ],
      verified: true,
      date: new Date("2024-03-10"),
    },
    project: {
      name: "Environmental Intelligence Platform",
      description: "AI-powered environmental monitoring and prediction",
      type: "pilot",
      scope: "regional",
      duration: "9 months",
      budget: "$1.2M",
      team_size: 8,
      technologies: ["AI/ML", "IoT Sensors", "Environmental APIs", "Data Visualization"],
      challenges: ["Sensor deployment", "Data integration", "Model accuracy"],
      outcomes: [
        {
          category: "environmental",
          description: "Improved environmental monitoring and prediction",
          achieved: true,
          impact: "Better environmental outcomes and compliance",
          metrics: { before: 35, after: 78, unit: "%" },
        },
      ],
    },
    media: {
      images: [
        {
          url: "/images/testimonials/ecosmart-dashboard.jpg",
          alt: "EcoSmart Environmental Dashboard",
          category: "screenshot",
          size: "large",
        },
      ],
      videos: [],
      documents: [],
    },
    metadata: {
      tags: ["environmental", "sustainability", "monitoring"],
      keywords: ["AI environmental", "carbon reduction", "air quality"],
      source: {
        type: "referral",
        date: new Date("2024-03-10"),
      },
      priority: "medium",
      language: "en",
      verified: true,
      featured: false,
    },
    status: "published",
    featured: false,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
];

// Testimonial collections
const testimonialCollections: TestimonialCollection[] = [
  {
    id: "government-testimonials",
    name: "Government Success Stories",
    description: "How municipalities and government agencies are transforming with our solutions",
    testimonials: sampleTestimonials.filter(t => t.customer.company.industry === "government"),
    filters: {
      industry: ["government"],
    },
    layout: "grid",
    settings: {
      itemsPerPage: 6,
      showRatings: true,
      showCompanyInfo: true,
      showMedia: false,
      showFullTestimonial: false,
      allowSorting: false,
      allowFiltering: false,
      showPagination: false,
      autoPlay: false,
      animationSpeed: "normal",
      theme: "dark",
    },
    isPublic: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "transportation-testimonials",
    name: "Transportation Innovations",
    description: "Revolutionizing public transit and traffic management",
    testimonials: sampleTestimonials.filter(t => t.customer.company.industry === "transportation"),
    filters: {
      industry: ["transportation"],
    },
    layout: "carousel",
    settings: {
      itemsPerPage: 3,
      showRatings: true,
      showCompanyInfo: true,
      showMedia: true,
      showFullTestimonial: false,
      allowSorting: false,
      allowFiltering: false,
      showPagination: false,
      autoPlay: true,
      animationSpeed: "normal",
      theme: "dark",
    },
    isPublic: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "featured-testimonials",
    name: "Featured Customer Stories",
    description: "Our most impactful customer success stories",
    testimonials: sampleTestimonials.filter(t => t.featured),
    filters: {
      featured: true,
    },
    layout: "grid",
    settings: {
      itemsPerPage: 3,
      showRatings: true,
      showCompanyInfo: true,
      showMedia: true,
      showFullTestimonial: false,
      allowSorting: false,
      allowFiltering: false,
      showPagination: false,
      autoPlay: false,
      animationSpeed: "normal",
      theme: "dark",
    },
    isPublic: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

// Filter component
function TestimonialFilter({
  selectedIndustry,
  selectedSize,
  selectedRating,
  onIndustryChange,
  onSizeChange,
  onRatingChange,
  className = "",
}: {
  selectedIndustry?: IndustryType;
  selectedSize?: CompanySize;
  selectedRating?: number;
  onIndustryChange?: (industry?: IndustryType) => void;
  onSizeChange?: (size?: CompanySize) => void;
  onRatingChange?: (rating?: number) => void;
  className?: string;
}) {
  const industries: IndustryType[] = [
    "government",
    "transportation", 
    "utilities",
    "healthcare",
    "education",
    "retail",
    "manufacturing",
    "technology",
    "finance",
    "real_estate",
    "hospitality",
    "other",
  ];

  const sizes: CompanySize[] = ["startup", "small", "medium", "large", "enterprise"];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Industry Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
        <select
          value={selectedIndustry || ""}
          onChange={(e) => onIndustryChange?.(e.target.value ? e.target.value as IndustryType : undefined)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
        >
          <option value="">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>
              {industry.charAt(0).toUpperCase() + industry.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Company Size Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
        <select
          value={selectedSize || ""}
          onChange={(e) => onSizeChange?.(e.target.value ? e.target.value as CompanySize : undefined)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
        >
          <option value="">All Sizes</option>
          {sizes.map(size => (
            <option key={size} value={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
        <select
          value={selectedRating || ""}
          onChange={(e) => onRatingChange?.(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map(rating => (
            <option key={rating} value={rating}>
              {rating} Stars
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Stats component
function TestimonialStats({
  testimonials,
  className = "",
}: {
  testimonials: CustomerTestimonial[];
  className?: string;
}) {
  const totalTestimonials = testimonials.length;
  const verifiedCount = testimonials.filter(t => t.rating.verified).length;
  const avgRating = testimonials.reduce((sum, t) => sum + t.rating.overall, 0) / testimonials.length;
  const featuredCount = testimonials.filter(t => t.featured).length;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-blue">{totalTestimonials}</div>
        <div className="text-sm text-gray-400">Total Testimonials</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-green">{verifiedCount}</div>
        <div className="text-sm text-gray-400">Verified Reviews</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-yellow-500">{avgRating.toFixed(1)}</div>
        <div className="text-sm text-gray-400">Average Rating</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-neon-purple">{featuredCount}</div>
        <div className="text-sm text-gray-400">Featured Stories</div>
      </div>
    </div>
  );
}

// Main testimonials section component
export default function TestimonialsSection({
  title = "What Our Customers Say",
  subtitle = "Real stories from cities and organizations transforming with our AI-powered solutions",
  showFilters = true,
  showStats = true,
  layout = "mixed",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showStats?: boolean;
  layout?: "grid" | "carousel" | "mixed";
  className?: string;
}) {
  const [filteredTestimonials, setFilteredTestimonials] = useState(sampleTestimonials);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | undefined>();
  const [selectedSize, setSelectedSize] = useState<CompanySize | undefined>();
  const [selectedRating, setSelectedRating] = useState<number | undefined>();

  useEffect(() => {
    let filtered = sampleTestimonials;

    if (selectedIndustry) {
      filtered = filtered.filter(t => t.customer.company.industry === selectedIndustry);
    }

    if (selectedSize) {
      filtered = filtered.filter(t => t.customer.company.size === selectedSize);
    }

    if (selectedRating) {
      filtered = filtered.filter(t => t.rating.overall >= selectedRating);
    }

    setFilteredTestimonials(filtered);
  }, [selectedIndustry, selectedSize, selectedRating]);

  const featuredTestimonial = sampleTestimonials.find(t => t.featured);
  const otherTestimonials = sampleTestimonials.filter(t => !t.featured);

  return (
    <AccessibilityVisualization className={className}>
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <ScrollAnimation animation="fade" direction="up">
            <div className="text-center mb-16">
              <div className="inline-flex mb-4">
                <div className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-full">
                  <span className="text-neon-green text-sm font-medium">
                    💬 Customer Stories
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

          {/* Stats */}
          {showStats && (
            <ScrollAnimation animation="slide" direction="up" delay={0.6}>
              <div className="mb-12">
                <TestimonialStats testimonials={sampleTestimonials} />
              </div>
            </ScrollAnimation>
          )}

          {/* Featured Testimonial */}
          {featuredTestimonial && (
            <ScrollAnimation animation="slide" direction="up" delay={0.8}>
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  Featured Success Story
                </h3>
                <FeaturedTestimonial testimonial={featuredTestimonial} />
              </div>
            </ScrollAnimation>
          )}

          {/* Filters */}
          {showFilters && (
            <ScrollAnimation animation="slide" direction="up" delay={1}>
              <div className="mb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Filter Testimonials
                    </h3>
                    <TestimonialFilter
                      selectedIndustry={selectedIndustry}
                      selectedSize={selectedSize}
                      selectedRating={selectedRating}
                      onIndustryChange={setSelectedIndustry}
                      onSizeChange={setSelectedSize}
                      onRatingChange={setSelectedRating}
                    />
                  </div>
                  <div className="lg:w-1/3">
                    <div className="glass rounded-lg border border-white/10 p-6">
                      <h4 className="font-bold text-white mb-4">Quick Stats</h4>
                      <TestimonialStats testimonials={filteredTestimonials} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          )}

          {/* Testimonials Grid/Carousel */}
          <ScrollAnimation animation="slide" direction="up" delay={1.2}>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                More Customer Stories
              </h3>
              
              {layout === "carousel" ? (
                <TestimonialCarousel
                  testimonials={otherTestimonials}
                  autoPlay={true}
                  interval={6000}
                  showIndicators={true}
                  showNavigation={true}
                />
              ) : (
                <TestimonialGrid
                  testimonials={otherTestimonials}
                  columns={3}
                  filter={{
                    industry: selectedIndustry ? [selectedIndustry] : undefined,
                    rating: selectedRating,
                  }}
                />
              )}
            </div>
          </ScrollAnimation>

          {/* Collections */}
          <ScrollAnimation animation="slide" direction="up" delay={1.4}>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Success Stories by Industry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonialCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    className="glass rounded-lg border border-white/10 p-6 cursor-pointer hover:border-neon-blue/30 transition-colors"
                  >
                    <h4 className="font-bold text-white mb-2">{collection.name}</h4>
                    <p className="text-sm text-gray-400 mb-4">{collection.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        {collection.testimonials.length} stories
                      </span>
                      <span className="text-neon-blue text-sm">View →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Call to Action */}
          <ScrollAnimation animation="slide" direction="up" delay={1.6}>
            <div className="text-center">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Join Our Success Stories
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  See how cities and organizations like yours are achieving remarkable results with our smart city solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-3 bg-neon-blue text-black rounded-lg font-medium hover:bg-neon-blue/80 transition-colors">
                    Schedule a Demo
                  </button>
                  <button className="px-8 py-3 border border-white/20 text-white rounded-lg font-medium hover:border-white/40 transition-colors">
                    Read More Stories
                  </button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </AccessibilityVisualization>
  );
}

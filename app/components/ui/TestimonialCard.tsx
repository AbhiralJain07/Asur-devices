"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerTestimonial, type TestimonialCollection } from "../../types/testimonials";
import AccessibilityVisualization, { useScreenReaderAnnouncements } from "./AccessibilityVisualization";
import ResponsiveVisualization from "./ResponsiveVisualization";

// Testimonial card component
export function TestimonialCard({
  testimonial,
  variant = "default",
  showAvatar = true,
  showCompany = true,
  showRating = true,
  showResults = true,
  showMedia = false,
  isExpanded = false,
  onExpand,
  className = "",
}: {
  testimonial: CustomerTestimonial;
  variant?: "default" | "compact" | "detailed" | "featured";
  showAvatar?: boolean;
  showCompany?: boolean;
  showRating?: boolean;
  showResults?: boolean;
  showMedia?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { announce } = useScreenReaderAnnouncements();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? "text-yellow-500" : "text-gray-600"
        }`}
        aria-label={`${i < rating ? "Star" : "Empty star"} ${i + 1} of 5`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleCardClick = () => {
    onExpand?.();
    announce(`Expanded testimonial from ${testimonial.customer.name}`, "polite");
  };

  if (variant === "compact") {
    return (
      <AccessibilityVisualization className={className}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCardClick}
          className="glass rounded-lg border border-white/10 p-4 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div className="flex items-start gap-3">
            {showAvatar && testimonial.customer.avatar && (
              <img
                src={testimonial.customer.avatar.url}
                alt={testimonial.customer.avatar.alt}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-white truncate">
                    {testimonial.customer.name}
                  </h4>
                  {showCompany && (
                    <p className="text-sm text-gray-400 truncate">
                      {testimonial.customer.company.name}
                    </p>
                  )}
                </div>
                {showRating && (
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating.overall)}
                  </div>
                )}
              </div>
              <blockquote className="text-gray-300 text-sm line-clamp-2">
                "{testimonial.testimonial.quote}"
              </blockquote>
            </div>
          </div>
        </motion.div>
      </AccessibilityVisualization>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: variant === "featured" ? 1.02 : 1 }}
        className={`glass rounded-lg border border-white/10 overflow-hidden ${
          variant === "featured" ? "border-neon-blue/30" : ""
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {showAvatar && testimonial.customer.avatar && (
                <motion.img
                  src={testimonial.customer.avatar.url}
                  alt={testimonial.customer.avatar.alt}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  whileHover={{ scale: 1.05 }}
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {testimonial.customer.name}
                </h3>
                <p className="text-gray-300 mb-1">{testimonial.customer.title}</p>
                {showCompany && (
                  <div className="flex items-center gap-2">
                    {testimonial.customer.company.logo && (
                      <img
                        src={testimonial.customer.company.logo}
                        alt={testimonial.customer.company.name}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span className="text-sm text-gray-400">
                      {testimonial.customer.company.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      • {testimonial.customer.company.industry}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {showRating && (
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {renderStars(testimonial.rating.overall)}
                </div>
                <div className="text-sm text-gray-400">
                  {testimonial.rating.verified && "✓ Verified"}
                </div>
              </div>
            )}
          </div>

          {/* Testimonial content */}
          <blockquote className="text-gray-300 leading-relaxed">
            "{testimonial.testimonial.quote}"
          </blockquote>
          
          {testimonial.testimonial.summary && (
            <p className="text-sm text-gray-400 mt-3">
              {testimonial.testimonial.summary}
            </p>
          )}
        </div>

        {/* Results */}
        {showResults && testimonial.testimonial.results.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <h4 className="font-bold text-white mb-4">Key Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonial.testimonial.results.slice(0, 4).map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <div className="text-sm text-gray-400">{result.metric}</div>
                    <div className="font-bold text-white">
                      {result.value} {result.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      result.improvement > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {result.improvement > 0 ? "+" : ""}{result.improvement}%
                    </div>
                    <div className="text-xs text-gray-400">{result.timeframe}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Project info */}
        {variant === "detailed" && (
          <div className="p-6 border-b border-white/10">
            <h4 className="font-bold text-white mb-3">Project Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Project:</span>
                <span className="text-white">{testimonial.project.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{testimonial.project.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Scope:</span>
                <span className="text-white capitalize">{testimonial.project.scope.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technologies:</span>
                <span className="text-white">{testimonial.project.technologies.join(", ")}</span>
              </div>
            </div>
          </div>
        )}

        {/* Media */}
        {showMedia && testimonial.media.images.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <h4 className="font-bold text-white mb-4">Gallery</h4>
            <div className="grid grid-cols-3 gap-2">
              {testimonial.media.images.slice(0, 6).map((image, index) => (
                <motion.img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => announce(`Viewing image: ${image.alt}`, "polite")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {formatDate(testimonial.createdAt)}
            </div>
            <div className="flex items-center gap-4">
              {testimonial.testimonial.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {testimonial.testimonial.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
              {testimonial.media.case_study && (
                <button className="text-sm text-neon-blue hover:text-neon-blue/80">
                  View Case Study →
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

// Testimonial carousel component
export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showNavigation = true,
  className = "",
}: {
  testimonials: CustomerTestimonial[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showNavigation?: boolean;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { announce } = useScreenReaderAnnouncements();

  useEffect(() => {
    if (!autoPlay || isPaused || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    announce(`Showing testimonial ${index + 1} of ${testimonials.length}`, "polite");
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length;
    goToSlide(newIndex);
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No testimonials available
      </div>
    );
  }

  return (
    <AccessibilityVisualization className={className}>
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Testimonial slides */}
        <div className="overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                variant="featured"
                showMedia={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {showNavigation && testimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Next testimonial"
            >
              →
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-neon-blue" : "bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}
      </div>
    </AccessibilityVisualization>
  );
}

// Testimonial grid component
export function TestimonialGrid({
  testimonials,
  columns = 3,
  filter,
  className = "",
}: {
  testimonials: CustomerTestimonial[];
  columns?: number;
  filter?: {
    industry?: string[];
    rating?: number;
    featured?: boolean;
  };
  className?: string;
}) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<CustomerTestimonial | null>(null);
  const [filteredTestimonials, setFilteredTestimonials] = useState(testimonials);

  useEffect(() => {
    let filtered = testimonials;

    if (filter?.industry && filter.industry.length > 0) {
      filtered = filtered.filter(t => 
        filter.industry!.includes(t.customer.company.industry)
      );
    }

    if (filter?.rating) {
      filtered = filtered.filter(t => t.rating.overall >= filter.rating!);
    }

    if (filter?.featured !== undefined) {
      filtered = filtered.filter(t => t.featured === filter.featured);
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, filter]);

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <ResponsiveVisualization className={className}>
      <div className={`grid ${gridCols} gap-6`}>
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TestimonialCard
              testimonial={testimonial}
              variant="default"
              showResults={true}
              onExpand={() => setSelectedTestimonial(testimonial)}
            />
          </motion.div>
        ))}
      </div>

      {/* Modal for expanded testimonial */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <TestimonialCard
                testimonial={selectedTestimonial}
                variant="detailed"
                showMedia={true}
                isExpanded={true}
              />
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="mt-4 w-full px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/80 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ResponsiveVisualization>
  );
}

// Testimonial collection component
export function TestimonialCollection({
  collection,
  layout = "grid",
  className = "",
}: {
  collection: TestimonialCollection;
  layout?: "grid" | "carousel" | "masonry";
  className?: string;
}) {
  if (layout === "carousel") {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
          <p className="text-gray-300">{collection.description}</p>
        </div>
        <TestimonialCarousel
          testimonials={collection.testimonials}
          autoPlay={collection.settings.autoPlay}
          interval={collection.settings.animationSpeed === "slow" ? 7000 : 
                 collection.settings.animationSpeed === "fast" ? 3000 : 5000}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{collection.name}</h2>
        <p className="text-gray-300">{collection.description}</p>
      </div>
      <TestimonialGrid
        testimonials={collection.testimonials}
        columns={layout === "masonry" ? 2 : 3}
      />
    </div>
  );
}

// Featured testimonial component
export function FeaturedTestimonial({
  testimonial,
  className = "",
}: {
  testimonial: CustomerTestimonial;
  className?: string;
}) {
  return (
    <AccessibilityVisualization className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative glass rounded-xl border border-neon-blue/30 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-green/20 rounded-full blur-2xl" />
        
        <div className="relative p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded-full">
              <span className="text-neon-blue text-sm font-medium">Featured Story</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < testimonial.rating.overall ? "text-yellow-500" : "text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <TestimonialCard
            testimonial={testimonial}
            variant="default"
            showMedia={true}
            showResults={true}
          />
        </div>
      </motion.div>
    </AccessibilityVisualization>
  );
}

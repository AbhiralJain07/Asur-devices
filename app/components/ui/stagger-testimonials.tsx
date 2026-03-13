"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "SmartCity AI has transformed our urban planning process. The real-time analytics and predictive maintenance features have reduced our operational costs by 40%. Game changer! 🏙️",
    by: "Maria Rodriguez, CEO at UrbanTech",
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 1,
    testimonial: "The 3D visualization and AI-powered insights are incredible. We can now monitor traffic patterns and optimize routes in real-time. Our citizens love the improved efficiency! 🚗",
    by: "James Chen, CTO at CityFlow",
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    tempId: 2,
    testimonial: "From energy management to waste optimization, SmartCity AI does it all. The integration was seamless and ROI was immediate. Best decision for our smart city initiative! ⚡",
    by: "Aisha Patel, COO at GreenCities",
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: "The AI-powered traffic management has reduced congestion by 35% in our downtown area. Emergency response times are also 50% faster. Outstanding results! 🚓",
    by: "David Kim, Operations Manager at MetroTransit",
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    testimonial: "SmartCity AI's predictive analytics helped us prevent 3 major infrastructure failures last quarter. The cost savings alone justified the investment 10x over! 📊",
    by: "Sarah Johnson, Data Scientist at InfrastructurePro",
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 5,
    testimonial: "We've tried many smart city solutions, but SmartCity AI stands out for its reliability and ease of use. The citizen satisfaction scores have never been higher! 😊",
    by: "Michael Torres, City Manager at ModernGov",
    imgSrc: "https://i.pravatar.cc/150?img=6"
  },
  {
    tempId: 6,
    testimonial: "The energy grid optimization features are incredible. We've reduced our carbon footprint by 25% while improving service reliability. Environmental and economic win! 🌱",
    by: "Emily Chen, Sustainability Director at EcoFuture",
    imgSrc: "https://i.pravatar.cc/150?img=7"
  },
  {
    tempId: 7,
    testimonial: "SmartCity AI's dashboard gives us insights we never had before. We can now make data-driven decisions that impact millions of citizens daily. Revolutionary! 🎯",
    by: "Robert Martinez, Analytics Lead at DataDrivenGov",
    imgSrc: "https://i.pravatar.cc/150?img=8"
  },
  {
    tempId: 8,
    testimonial: "The integration process was smooth and the support team was exceptional. We were fully operational in just 2 weeks. Best vendor experience we've had! 🚀",
    by: "Lisa Wang, IT Director at TechMunicipality",
    imgSrc: "https://i.pravatar.cc/150?img=9"
  },
  {
    tempId: 9,
    testimonial: "Our emergency response coordination has improved dramatically. Real-time data sharing between departments saves critical minutes during incidents. Life-saving technology! 🚑",
    by: "James Wilson, Emergency Services Coordinator at SafeCity",
    imgSrc: "https://i.pravatar.cc/150?img=10"
  },
  {
    tempId: 10,
    testimonial: "The citizen engagement platform has increased public participation by 200%. People love how easy it is to report issues and track progress. Democracy in action! 🏛️",
    by: "Anna Petrova, Community Engagement Director at CivicTech",
    imgSrc: "https://i.pravatar.cc/150?img=11"
  },
  {
    tempId: 11,
    testimonial: "SmartCity AI's scalability is impressive. It grows with our needs from small pilot to city-wide deployment without any performance issues. Future-proof solution! 📈",
    by: "Carlos Rodriguez, CIO at ScaleCity",
    imgSrc: "https://i.pravatar.cc/150?img=12"
  },
  {
    tempId: 12,
    testimonial: "The waste management optimization has reduced collection costs by 30% while improving recycling rates. Smart, efficient, and environmentally conscious! ♻️",
    by: "Nina Schmidt, Environmental Manager at GreenTech",
    imgSrc: "https://i.pravatar.cc/150?img=13"
  },
  {
    tempId: 13,
    testimonial: "SmartCity AI's predictive maintenance has prevented countless equipment failures. We now schedule repairs before breakdowns occur. Proactive and cost-effective! 🔧",
    by: "Thomas Anderson, Maintenance Director at ProTech",
    imgSrc: "https://i.pravatar.cc/150?img=14"
  },
  {
    tempId: 14,
    testimonial: "The public transportation analytics have transformed our bus routes. We've increased efficiency by 45% and rider satisfaction is at an all-time high. Commuters love it! 🚌",
    by: "Maria Garcia, Transit Director at CityTransit",
    imgSrc: "https://i.pravatar.cc/150?img=15"
  },
  {
    tempId: 15,
    testimonial: "SmartCity AI's water management system has reduced waste by 40% and improved quality monitoring. We can now ensure clean water for all citizens. Essential service! 💧",
    by: "Ahmed Hassan, Water Resources Manager at AquaCity",
    imgSrc: "https://i.pravatar.cc/150?img=16"
  },
  {
    tempId: 16,
    testimonial: "The air quality monitoring network provides real-time data that helps us make immediate policy decisions. Public health outcomes have improved significantly. Breathing easier! 🌬",
    by: "Jennifer Liu, Environmental Health Director at HealthFirst",
    imgSrc: "https://i.pravatar.cc/150?img=17"
  },
  {
    tempId: 17,
    testimonial: "SmartCity AI's integration capabilities are unmatched. It connects all our existing systems seamlessly. Finally, a unified platform that actually works! 🔗",
    by: "Marcus Johnson, Integration Specialist at UnifiedGov",
    imgSrc: "https://i.pravatar.cc/150?img=18"
  },
  {
    tempId: 18,
    testimonial: "The citizen feedback system has transformed how we respond to community needs. We're now 3x faster at addressing issues and satisfaction is soaring. Responsive government! 🏢",
    by: "Yuki Tanaka, Public Services Director at FutureGov",
    imgSrc: "https://i.pravatar.cc/150?img=19"
  },
  {
    tempId: 19,
    testimonial: "SmartCity AI has exceeded all our expectations. The ROI is incredible, the support is outstanding, and our citizens are happier than ever. Complete transformation! 🌟",
    by: "Victor Petrov, City Administrator at SmartMetro",
    imgSrc: "https://i.pravatar.cc/150?img=20"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-primary text-primary-foreground border-primary opacity-100" 
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50 opacity-30"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className={cn(
          "mb-4 h-14 w-12 bg-muted object-cover object-top",
          isCenter ? "opacity-100" : "opacity-50"
        )}
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-primary-foreground opacity-100" : "text-foreground opacity-50"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-primary-foreground/80 opacity-100" : "text-muted-foreground opacity-50"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-muted/30"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

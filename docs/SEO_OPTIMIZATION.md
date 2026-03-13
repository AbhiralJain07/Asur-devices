# SEO Optimization and Meta Tags

This document outlines the comprehensive SEO optimization strategy for the Smart City Command Center, ensuring maximum visibility in search engines and optimal social media sharing capabilities.

## SEO Strategy Overview

### SEO Goals
- **Primary Target**: Rank for "smart city command center", "urban management platform", "city analytics dashboard"
- **Secondary Target**: Rank for "municipal data visualization", "smart city solutions", "city management software"
- **Local SEO**: Target city governments and municipal organizations
- **Technical SEO**: Ensure 100+ Lighthouse score and Core Web Vitals compliance

### Core SEO Metrics
- **Page Load Speed**: < 2 seconds (LCP < 2.5s)
- **Mobile Friendliness**: 100% mobile-responsive
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Content Quality**: 1000+ words of relevant content
- **Backlink Profile**: High-authority government and tech sites
- **Schema Markup**: Comprehensive structured data implementation

## 1. Meta Tags and SEO Head

#### Comprehensive SEO Head Component
```typescript
// app/components/SEOHead.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>[];
  additionalMeta?: Array<{
    name: string;
    content: string;
    property?: string;
  }>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Smart City Command Center - Advanced Urban Management Platform',
  description = 'Transform your city with our comprehensive smart city command center. Real-time analytics, data visualization, and intelligent urban management solutions for modern municipalities.',
  keywords = 'smart city command center, urban management platform, city analytics, municipal data visualization, smart city solutions, city management software, urban planning tools',
  canonical,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  noindex = false,
  structuredData,
  additionalMeta = []
}) => {
  const router = useRouter();
  const fullUrl = canonical || `https://smartcitycommandcenter.com${router.asPath}`;

  const metaTags = [
    // Basic SEO
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: fullUrl },
    { property: 'og:image', content: `https://smartcitycommandcenter.com${ogImage}` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Smart City Command Center Dashboard' },
    { property: 'og:site_name', content: 'Smart City Command Center' },
    { property: 'og:locale', content: 'en_US' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `https://smartcitycommandcenter.com${ogImage}` },
    { name: 'twitter:site', content: '@SmartCityCC' },
    { name: 'twitter:creator', content: '@SmartCityCC' },
    
    // Technical SEO
    { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' },
    { name: 'googlebot', content: noindex ? 'noindex,nofollow' : 'index,follow' },
    { name: 'author', content: 'Smart City Command Center Team' },
    { name: 'publisher', content: 'Smart City Command Center' },
    
    // Additional meta tags
    ...additionalMeta
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Meta tags */}
      {metaTags.map((tag, index) => (
        tag.property ? (
          <meta key={index} property={tag.property} content={tag.content} />
        ) : (
          <meta key={index} name={tag.name} content={tag.content} />
        )
      ))}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0066cc" />
      <meta name="msapplication-TileColor" content="#0066cc" />
      <meta name="theme-color" content="#0066cc" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="//analytics.google.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured Data */}
      {structuredData?.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  );
};
```

#### Dynamic SEO Component
```typescript
// app/components/DynamicSEO.tsx
import React from 'react';
import { SEOHead } from './SEOHead';

interface DynamicSEOProps {
  pageType: 'home' | 'features' | 'technology' | 'analytics' | 'contact';
  customData?: Record<string, any>;
}

export const DynamicSEO: React.FC<DynamicSEOProps> = ({ pageType, customData }) => {
  const seoConfig = {
    home: {
      title: 'Smart City Command Center - Advanced Urban Management Platform',
      description: 'Transform your city with our comprehensive smart city command center. Real-time analytics, data visualization, and intelligent urban management solutions for modern municipalities.',
      keywords: 'smart city command center, urban management platform, city analytics, municipal data visualization',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Smart City Command Center',
          description: 'Advanced urban management platform for smart cities',
          url: 'https://smartcitycommandcenter.com',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: 'Contact for pricing',
            priceCurrency: 'USD'
          }
        }
      ]
    },
    features: {
      title: 'Features - Smart City Command Center',
      description: 'Explore powerful features of our smart city command center including real-time analytics, 3D visualizations, predictive analytics, and comprehensive urban management tools.',
      keywords: 'smart city features, urban analytics, city management features, municipal dashboard',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Smart City Command Center Features',
          description: 'Comprehensive features for smart city management',
          url: 'https://smartcitycommandcenter.com/features',
          mainEntity: {
            '@type': 'SoftwareApplication',
            name: 'Smart City Command Center',
            applicationCategory: 'BusinessApplication'
          }
        }
      ]
    },
    technology: {
      title: 'Technology Stack - Smart City Command Center',
      description: 'Discover the cutting-edge technology powering our smart city command center including AI, machine learning, IoT integration, and advanced data processing capabilities.',
      keywords: 'smart city technology, urban tech stack, IoT integration, AI city management',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: 'Technology Behind Smart City Command Center',
          description: 'Advanced technology stack for urban management',
          author: {
            '@type': 'Organization',
            name: 'Smart City Command Center'
          }
        }
      ]
    },
    analytics: {
      title: 'City Analytics Dashboard - Smart City Command Center',
      description: 'Powerful analytics dashboard for real-time city data visualization, KPI tracking, and intelligent insights for urban decision-making.',
      keywords: 'city analytics, urban dashboard, municipal KPIs, smart city data',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'City Analytics Dashboard',
          description: 'Real-time analytics for smart city management',
          applicationCategory: 'BusinessApplication'
        }
      ]
    },
    contact: {
      title: 'Contact - Smart City Command Center',
      description: 'Get in touch with our smart city experts. Schedule a demo, request a consultation, or learn how our platform can transform your city operations.',
      keywords: 'smart city contact, city management consultation, demo request',
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Smart City Command Center',
          description: 'Get in touch for smart city solutions',
          url: 'https://smartcitycommandcenter.com/contact'
        }
      ]
    }
  };

  const config = seoConfig[pageType];
  
  return (
    <SEOHead
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      structuredData={config.structuredData}
      ogImage={`/images/og-${pageType}.jpg`}
    />
  );
};
```

## 2. Structured Data Implementation

#### Schema Markup Generator
```typescript
// app/lib/schema-generator.ts
export class SchemaGenerator {
  static generateOrganizationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Smart City Command Center',
      url: 'https://smartcitycommandcenter.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smartcitycommandcenter.com/logo.png',
        width: 512,
        height: 512
      },
      description: 'Advanced urban management platform for smart cities',
      sameAs: [
        'https://twitter.com/SmartCityCC',
        'https://linkedin.com/company/smartcitycommandcenter',
        'https://github.com/smartcitycommandcenter'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-0123-4567',
        contactType: 'sales',
        availableLanguage: ['English']
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94105',
        streetAddress: '123 Tech Street'
      }
    };
  }

  static generateWebApplicationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Smart City Command Center',
      description: 'Advanced urban management platform for smart cities',
      url: 'https://smartcitycommandcenter.com',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: 'Contact for pricing',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1'
      },
      screenshot: {
        '@type': 'ImageObject',
        url: 'https://smartcitycommandcenter.com/screenshots/dashboard.jpg',
        caption: 'Smart City Command Center Dashboard'
      },
      featureList: [
        'Real-time analytics',
        '3D city visualization',
        'Predictive analytics',
        'IoT integration',
        'Mobile access',
        'Custom dashboards'
      ]
    };
  }

  static generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  static generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url
      }))
    };
  }

  static generateReviewSchema(reviews: Array<{
    author: string;
    rating: number;
    review: string;
    date: string;
  }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: {
        '@type': 'WebApplication',
        name: 'Smart City Command Center'
      },
      ratingValue: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
      reviews: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating
        },
        reviewBody: review.review,
        datePublished: review.date
      }))
    };
  }

  static generateEventSchema(events: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    url: string;
  }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: events[0].name,
      description: events[0].description,
      startDate: events[0].startDate,
      endDate: events[0].endDate,
      location: {
        '@type': 'Place',
        name: events[0].location
      },
      url: events[0].url,
      offers: {
        '@type': 'Offer',
        price: 'Free',
        priceCurrency: 'USD'
      }
    };
  }

  static generateHowToSchema(steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Implement Smart City Command Center',
      description: 'Step-by-step guide to implementing our smart city platform',
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        image: step.image ? {
          '@type': 'ImageObject',
          url: step.image
        } : undefined
      }))
    };
  }
}
```

## 3. Content SEO Strategy

#### SEO-Optimized Content Components
```typescript
// app/components/SEOContent.tsx
import React from 'react';
import { SEOHead } from './SEOHead';

interface SEOContentProps {
  title: string;
  content: string;
  keywords: string[];
  headingLevel?: 'h1' | 'h2' | 'h3';
  includeSchema?: boolean;
}

export const SEOContent: React.FC<SEOContentProps> = ({
  title,
  content,
  keywords,
  headingLevel = 'h2',
  includeSchema = true
}) => {
  const HeadingTag = headingLevel;
  
  // Generate SEO-optimized content
  const optimizedContent = content.replace(
    new RegExp(keywords.join('|'), 'gi'),
    (match) => `<strong>${match}</strong>`
  );

  const structuredData = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: content.substring(0, 160),
    keywords: keywords.join(', '),
    author: {
      '@type': 'Organization',
      name: 'Smart City Command Center'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Smart City Command Center',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smartcitycommandcenter.com/logo.png'
      }
    }
  } : undefined;

  return (
    <>
      <SEOHead
        title={title}
        description={content.substring(0, 160)}
        keywords={keywords.join(', ')}
        structuredData={structuredData ? [structuredData] : []}
      />
      
      <article className="seo-content">
        <HeadingTag className="seo-title">{title}</HeadingTag>
        <div 
          className="seo-text"
          dangerouslySetInnerHTML={{ __html: optimizedContent }}
        />
      </article>
    </>
  );
};
```

#### Blog Post SEO Component
```typescript
// app/components/BlogPostSEO.tsx
import React from 'react';
import { SEOHead } from './SEOHead';

interface BlogPostSEOProps {
  title: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  readingTime: number;
}

export const BlogPostSEO: React.FC<BlogPostSEOProps> = ({
  title,
  description,
  content,
  author,
  publishDate,
  modifiedDate,
  category,
  tags,
  featuredImage,
  readingTime
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: featuredImage ? `https://smartcitycommandcenter.com${featuredImage}` : undefined,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Smart City Command Center',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smartcitycommandcenter.com/logo.png'
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://smartcitycommandcenter.com/blog'
    },
    wordCount: content.split(' ').length,
    keywords: tags.join(', '),
    articleSection: category,
    timeRequired: `PT${readingTime}M`
  };

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={tags.join(', ')}
      ogImage={featuredImage}
      ogType="article"
      structuredData={[structuredData]}
      additionalMeta={[
        { name: 'article:author', content: author },
        { name: 'article:published_time', content: publishDate },
        { name: 'article:modified_time', content: modifiedDate || publishDate },
        { name: 'article:section', content: category },
        { name: 'article:tag', content: tags.join(', ') }
      ]}
    />
  );
};
```

## 4. Technical SEO Implementation

#### Sitemap Generation
```typescript
// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const SITEMAP_URL = 'https://smartcitycommandcenter.com';

const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/features', priority: 0.9, changefreq: 'weekly' },
  { url: '/technology', priority: 0.8, changefreq: 'monthly' },
  { url: '/analytics', priority: 0.9, changefreq: 'weekly' },
  { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  { url: '/demo', priority: 0.8, changefreq: 'weekly' },
  { url: '/pricing', priority: 0.8, changefreq: 'monthly' },
  { url: '/about', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog', priority: 0.8, changefreq: 'daily' },
  { url: '/case-studies', priority: 0.7, changefreq: 'monthly' }
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${SITEMAP_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };
```

#### Robots.txt Generation
```typescript
// scripts/generate-robots.js
const fs = require('fs');
const path = require('path');

function generateRobots() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://smartcitycommandcenter.com/sitemap.xml

# Block unnecessary crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /`;

  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots);
  console.log('Robots.txt generated successfully!');
}

if (require.main === module) {
  generateRobots();
}

module.exports = { generateRobots };
```

## 5. Local SEO Implementation

#### Local Business Schema
```typescript
// app/lib/local-seo.ts
export class LocalSEO {
  static generateLocalBusinessSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Smart City Command Center',
      description: 'Advanced urban management platform for municipalities',
      url: 'https://smartcitycommandcenter.com',
      telephone: '+1-555-0123-4567',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Tech Street',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94105',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 37.7749,
        longitude: -122.4194
      },
      openingHours: [
        'Mo-Fr 09:00-17:00',
        'Sa-Su Closed'
      ],
      priceRange: '$$$',
      paymentAccepted: ['Credit Card', 'Invoice'],
      currenciesAccepted: 'USD',
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 37.7749,
          longitude: -122.4194
        },
        geoRadius: '100000'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Smart City Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Smart City Analytics',
              description: 'Real-time city analytics dashboard'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Urban Management Platform',
              description: 'Comprehensive city management solution'
            }
          }
        ]
      }
    };
  }

  static generateCityPages(cities: Array<{
    name: string;
    state: string;
    population: number;
    description: string;
  }>): Array<Record<string, any>> {
    return cities.map(city => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Smart City Solutions for ${city.name}, ${city.state}`,
      description: `Advanced smart city command center solutions for ${city.name}. Transform urban management with real-time analytics and intelligent insights.`,
      url: `https://smartcitycommandcenter.com/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`,
      mainEntity: {
        '@type': 'City',
        name: city.name,
        description: city.description,
        population: city.population,
        isPartOf: {
          '@type': 'State',
          name: city.state
        }
      },
      about: {
        '@type': 'Thing',
        name: 'Smart City Solutions',
        description: 'Urban management and analytics platform'
      }
    }));
  }
}
```

## 6. SEO Analytics and Monitoring

#### SEO Performance Tracking
```typescript
// app/lib/seo-analytics.ts
export class SEOAnalytics {
  static trackPageView(page: string, title: string): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href
      });
    }
  }

  static trackSEOEvent(action: string, category: string, label?: string): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  }

  static trackCoreWebVitals(): void {
    if (typeof window !== 'undefined') {
      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcp = entries[entries.length - 1];
        
        if ('gtag' in window) {
          (window as any).gtag('event', 'FCP', {
            event_category: 'Web Vitals',
            value: Math.round(fcp.startTime),
            event_label: 'First Contentful Paint'
          });
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcp = entries[entries.length - 1];
        
        if ('gtag' in window) {
          (window as any).gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(lcp.startTime),
            event_label: 'Largest Contentful Paint'
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if ('gtag' in window) {
            (window as any).gtag('event', 'FID', {
              event_category: 'Web Vitals',
              value: Math.round(entry.processingStart - entry.startTime),
              event_label: 'First Input Delay'
            });
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        if ('gtag' in window) {
          (window as any).gtag('event', 'CLS', {
            event_category: 'Web Vitals',
            value: Math.round(clsValue * 1000),
            event_label: 'Cumulative Layout Shift'
          });
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  static generateSEOReport(): SEOReport {
    if (typeof document === 'undefined') {
      return {
        timestamp: new Date().toISOString(),
        url: '',
        title: '',
        description: '',
        keywords: [],
        h1Count: 0,
        h2Count: 0,
        internalLinks: 0,
        externalLinks: 0,
        imageAltTexts: 0,
        wordCount: 0,
        readabilityScore: 0
      };
    }

    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(', ') || [];
    
    const h1Count = document.querySelectorAll('h1').length;
    const h2Count = document.querySelectorAll('h2').length;
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]').length;
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="smartcitycommandcenter.com"])').length;
    const imageAltTexts = document.querySelectorAll('img[alt]').length;
    const wordCount = document.body.innerText.split(' ').length;
    
    // Simple readability score (Flesch-Kincaid approximation)
    const sentences = document.body.innerText.split('.').length;
    const avgWordsPerSentence = wordCount / sentences;
    const avgSyllablesPerWord = 1.5; // Approximation
    const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      title,
      description,
      keywords,
      h1Count,
      h2Count,
      internalLinks,
      externalLinks,
      imageAltTexts,
      wordCount,
      readabilityScore: Math.max(0, Math.min(100, readabilityScore))
    };
  }
}

interface SEOReport {
  timestamp: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  h1Count: number;
  h2Count: number;
  internalLinks: number;
  externalLinks: number;
  imageAltTexts: number;
  wordCount: number;
  readabilityScore: number;
}
```

## 7. SEO Testing and Validation

#### SEO Testing Suite
```typescript
// tests/seo/seo-compliance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('SEO Compliance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page has proper meta tags', async ({ page }) => {
    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Check description
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThan(160);
    
    // Check keywords
    const keywords = await page.getAttribute('meta[name="keywords"]', 'content');
    expect(keywords).toBeTruthy();
    expect(keywords!.split(',').length).toBeGreaterThan(3);
  });

  test('Open Graph tags are present', async ({ page }) => {
    const ogTags = [
      'og:title',
      'og:description',
      'og:type',
      'og:url',
      'og:image',
      'og:site_name'
    ];

    for (const tag of ogTags) {
      const content = await page.getAttribute(`meta[property="${tag}"]`, 'content');
      expect(content).toBeTruthy();
    }
  });

  test('Twitter Card tags are present', async ({ page }) => {
    const twitterTags = [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image'
    ];

    for (const tag of twitterTags) {
      const content = await page.getAttribute(`meta[name="${tag}"]`, 'content');
      expect(content).toBeTruthy();
    }
  });

  test('Structured data is valid', async ({ page }) => {
    const structuredDataScripts = await page.locator('script[type="application/ld+json"]');
    const count = await structuredDataScripts.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const script = structuredDataScripts.nth(i);
      const content = await script.getAttribute('content');
      
      expect(content).toBeTruthy();
      
      // Validate JSON
      expect(() => JSON.parse(content!)).not.toThrow();
    }
  });

  test('Canonical URL is present', async ({ page }) => {
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('https://smartcitycommandcenter.com');
  });

  test('Images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Heading structure is proper', async ({ page }) => {
    const h1s = page.locator('h1');
    const h1Count = await h1s.count();
    
    // Should have exactly one H1
    expect(h1Count).toBe(1);
    
    // Check heading hierarchy
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
    
    // H2s should follow H1
    const h1Text = await h1s.first().textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(0);
  });

  test('Internal and external links are present', async ({ page }) => {
    const internalLinks = page.locator('a[href^="/"], a[href^="#"]');
    const externalLinks = page.locator('a[href^="http"]:not([href*="smartcitycommandcenter.com"])');
    
    expect(await internalLinks.count()).toBeGreaterThan(5);
    expect(await externalLinks.count()).toBeGreaterThan(0);
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent:');
    expect(content).toContain('Sitemap:');
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('<?xml version="1.0"');
    expect(content).toContain('<urlset');
  });
});
```

This comprehensive SEO optimization strategy ensures the Smart City Command Center achieves maximum visibility in search engines, provides optimal social media sharing capabilities, and maintains technical SEO best practices.

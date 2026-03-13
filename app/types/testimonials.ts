// Customer Testimonial Types

export interface CustomerTestimonial {
  id: string;
  customer: CustomerInfo;
  testimonial: TestimonialContent;
  rating: Rating;
  project: ProjectInfo;
  media: MediaContent;
  metadata: TestimonialMetadata;
  status: TestimonialStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  id: string;
  name: string;
  title: string;
  company: CompanyInfo;
  avatar: AvatarInfo;
  contact: ContactInfo;
  bio?: string;
  location: LocationInfo;
  socialLinks?: SocialLink[];
}

export interface CompanyInfo {
  name: string;
  industry: IndustryType;
  size: CompanySize;
  website?: string;
  logo: string;
  description?: string;
  founded?: number;
  employees?: number;
  revenue?: string;
}

export type IndustryType = 
  | "government"
  | "transportation"
  | "utilities"
  | "healthcare"
  | "education"
  | "retail"
  | "manufacturing"
  | "technology"
  | "finance"
  | "real_estate"
  | "hospitality"
  | "other";

export type CompanySize = 
  | "startup"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export interface AvatarInfo {
  url: string;
  alt: string;
  size?: number;
  format?: "circle" | "square";
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
}

export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "instagram" | "website";
  url: string;
  handle?: string;
}

export interface TestimonialContent {
  quote: string;
  summary?: string;
  highlights: string[];
  context: string;
  experience: ExperienceLevel;
  useCase: UseCaseType;
  challenges: string[];
  solutions: string[];
  results: Result[];
  duration: string;
  language: string;
  translatedContent?: TranslatedContent[];
}

export type ExperienceLevel = 
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type UseCaseType = 
  | "traffic_management"
  | "pollution_monitoring"
  | "waste_optimization"
  | "energy_management"
  | "public_safety"
  | "infrastructure"
  | "citizen_services"
  | "data_analytics"
  | "emergency_response"
  | "urban_planning"
  | "other";

export interface Result {
  category: ResultCategory;
  description: string;
  metric: string;
  value: number;
  unit: string;
  improvement: number; // percentage
  timeframe: string;
}

export type ResultCategory = 
  | "efficiency"
  | "cost_savings"
  | "environmental"
  | "safety"
  | "satisfaction"
  | "compliance"
  | "scalability"
  | "innovation";

export interface TranslatedContent {
  language: string;
  quote: string;
  summary?: string;
  highlights: string[];
}

export interface Rating {
  overall: number; // 1-5
  categories: CategoryRating[];
  verified: boolean;
  date: Date;
  reviewCount?: number;
}

export interface CategoryRating {
  category: RatingCategory;
  score: number; // 1-5
  weight?: number; // for weighted average
}

export type RatingCategory = 
  | "ease_of_use"
  | "features"
  | "performance"
  | "reliability"
  | "support"
  | "value_for_money"
  | "implementation"
  | "innovation";

export interface ProjectInfo {
  name: string;
  description: string;
  type: ProjectType;
  scope: ProjectScope;
  duration: string;
  budget?: string;
  team_size?: number;
  technologies: string[];
  challenges: string[];
  outcomes: ProjectOutcome[];
}

export type ProjectType = 
  | "pilot"
  | "partial_rollout"
  | "full_implementation"
  | "upgrade"
  | "integration"
  | "consulting";

export type ProjectScope = 
  | "single_department"
  | "city_wide"
  | "regional"
  | "national"
  | "multi_city";

export interface ProjectOutcome {
  category: ResultCategory;
  description: string;
  achieved: boolean;
  impact: string;
  metrics: {
    before: number;
    after: number;
    unit: string;
  };
}

export interface MediaContent {
  images: MediaImage[];
  videos: MediaVideo[];
  documents: MediaDocument[];
  case_study?: CaseStudyLink;
}

export interface MediaImage {
  url: string;
  alt: string;
  caption?: string;
  category: ImageCategory;
  size?: ImageSize;
  format?: string;
}

export type ImageCategory = 
  | "headshot"
  | "team_photo"
  | "office"
  | "project"
  | "implementation"
  | "results"
  | "infographic"
  | "screenshot";

export type ImageSize = "small" | "medium" | "large" | "original";

export interface MediaVideo {
  url: string;
  title: string;
  description?: string;
  duration: number;
  thumbnail: string;
  category: VideoCategory;
  platform: VideoPlatform;
}

export type VideoCategory = 
  | "testimonial"
  | "demo"
  | "tutorial"
  | "case_study"
  | "interview"
  | "presentation";

export type VideoPlatform = 
  | "youtube"
  | "vimeo"
  | "wistia"
  | "self_hosted"
  | "other";

export interface MediaDocument {
  url: string;
  title: string;
  description?: string;
  format: DocumentFormat;
  size: number;
  category: DocumentCategory;
}

export type DocumentFormat = 
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "txt";

export type DocumentCategory = 
  | "case_study"
  | "white_paper"
  | "report"
  | "specification"
  | "presentation"
  | "certificate";

export interface CaseStudyLink {
  url: string;
  title: string;
  summary: string;
  format: "pdf" | "web" | "video";
  length: string;
  downloadUrl?: string;
}

export interface TestimonialMetadata {
  tags: string[];
  keywords: string[];
  campaign?: string;
  source: TestimonialSource;
  collection?: string;
  priority: Priority;
  expiresAt?: Date;
  geoTargeting?: GeoTargeting;
  language: string;
  verified: boolean;
  featured: boolean;
}

export interface TestimonialSource {
  type: SourceType;
  platform?: string;
  campaign?: string;
  form?: string;
  agent?: string;
  date: Date;
}

export type SourceType = 
  | "direct_request"
  | "survey"
  | "interview"
  | "social_media"
  | "review_site"
  | "email"
  | "phone"
  | "event"
  | "referral"
  | "other";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface GeoTargeting {
  countries: string[];
  regions: string[];
  cities: string[];
  languages: string[];
}

export type TestimonialStatus = 
  | "draft"
  | "pending_review"
  | "approved"
  | "published"
  | "archived"
  | "rejected";

export interface TestimonialCollection {
  id: string;
  name: string;
  description: string;
  testimonials: CustomerTestimonial[];
  filters: CollectionFilters;
  layout: CollectionLayout;
  settings: CollectionSettings;
  isPublic: boolean;
  shareUrl?: string;
  embedCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionFilters {
  industry?: IndustryType[];
  companySize?: CompanySize[];
  rating?: {
    min: number;
    max: number;
  };
  category?: UseCaseType[];
  featured?: boolean;
  verified?: boolean;
  hasMedia?: boolean;
  language?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export type CollectionLayout = 
  | "grid"
  | "list"
  | "carousel"
  | "masonry"
  | "timeline"
  | "map";

export interface CollectionSettings {
  itemsPerPage: number;
  showRatings: boolean;
  showCompanyInfo: boolean;
  showMedia: boolean;
  showFullTestimonial: boolean;
  allowSorting: boolean;
  allowFiltering: boolean;
  showPagination: boolean;
  autoPlay: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  theme: "light" | "dark" | "auto";
}

// Legacy interfaces for backward compatibility
export interface TestimonialResult {
  metric: string;
  value: string;
  improvement?: string;
}

// Action types for state management
export type TestimonialActionType =
  | "SET_LOADING"
  | "SET_ERROR"
  | "SET_TESTIMONIALS"
  | "ADD_TESTIMONIAL"
  | "UPDATE_TESTIMONIAL"
  | "REMOVE_TESTIMONIAL"
  | "SET_FILTERS"
  | "SET_COLLECTION"
  | "TOGGLE_FEATURED"
  | "SET_STATUS"
  | "ADD_COLLECTION"
  | "UPDATE_COLLECTION"
  | "REMOVE_COLLECTION"
  | "EXPORT_TESTIMONIALS"
  | "GENERATE_WIDGET"
  | "UPDATE_ANALYTICS";

export interface TestimonialActionPayload {
  type: TestimonialActionType;
  payload?: any;
}

// Context interface for React Context
export interface TestimonialContextType {
  state: TestimonialState;
  testimonials: CustomerTestimonial[];
  collections: TestimonialCollection[];
  widgets: TestimonialWidget[];
  analytics: TestimonialAnalytics;
  dispatch: (action: TestimonialActionPayload) => void;
  actions: {
    addTestimonial: (testimonial: CustomerTestimonial) => void;
    updateTestimonial: (id: string, updates: Partial<CustomerTestimonial>) => void;
    removeTestimonial: (id: string) => void;
    featureTestimonial: (id: string, featured: boolean) => void;
    createCollection: (collection: TestimonialCollection) => void;
    generateWidget: (config: TestimonialWidget) => void;
    exportTestimonials: (format: "pdf" | "excel" | "csv" | "json") => void;
  };
}

export interface TestimonialState {
  isLoading: boolean;
  error: string | null;
  selectedCollection: string | null;
  filters: CollectionFilters;
  viewMode: "grid" | "list" | "carousel";
  sortBy: SortOption;
  sortOrder: "asc" | "desc";
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}

export type SortOption = 
  | "date"
  | "rating"
  | "company"
  | "name"
  | "featured"
  | "verified";

// Additional interfaces for widgets and analytics
export interface TestimonialWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  configuration: WidgetConfiguration;
  collectionId: string;
  customTestimonials?: string[];
  styling: WidgetStyling;
  isEmbedded: boolean;
  embedCode?: string;
  analytics: WidgetAnalytics;
}

export type WidgetType = 
  | "carousel"
  | "grid"
  | "list"
  | "single"
  | "ticker"
  | "wall_of_love"
  | "quotes"
  | "stats";

export interface WidgetConfiguration {
  autoPlay: boolean;
  showRating: boolean;
  showCompany: boolean;
  showAvatar: boolean;
  showDate: boolean;
  itemsToShow: number;
  animationSpeed: "slow" | "normal" | "fast";
  randomOrder: boolean;
  filterByRating?: number;
  filterByIndustry?: IndustryType[];
  filterByCompanySize?: CompanySize[];
  customCSS?: string;
}

export interface WidgetStyling {
  theme: WidgetTheme;
  colors: ColorScheme;
  typography: TypographySettings;
  spacing: SpacingSettings;
  borderRadius: BorderRadiusSettings;
  shadows: ShadowSettings;
}

export type WidgetTheme = "light" | "dark" | "custom";

export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  border: string;
}

export interface TypographySettings {
  fontFamily: string;
  titleSize: string;
  bodySize: string;
  captionSize: string;
  weight: string;
  lineHeight: string;
}

export interface SpacingSettings {
  padding: string;
  margin: string;
  gap: string;
}

export interface BorderRadiusSettings {
  small: string;
  medium: string;
  large: string;
  full: string;
}

export interface ShadowSettings {
  none: string;
  small: string;
  medium: string;
  large: string;
}

export interface WidgetAnalytics {
  impressions: number;
  clicks: number;
  ctr: number; // click-through rate
  engagementTime: number;
  conversionRate: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface TestimonialAnalytics {
  views: number;
  clicks: number;
  shares: number;
  downloads: number;
  averageTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  topPerformingTestimonials: string[];
  popularTags: string[];
  geographicDistribution: GeoDistribution[];
  deviceBreakdown: DeviceBreakdown[];
  sourceBreakdown: SourceBreakdown[];
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface GeoDistribution {
  country: string;
  views: number;
  percentage: number;
}

export interface DeviceBreakdown {
  device: "desktop" | "mobile" | "tablet";
  views: number;
  percentage: number;
}

export interface SourceBreakdown {
  source: SourceType;
  count: number;
  percentage: number;
}

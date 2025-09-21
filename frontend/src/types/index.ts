// Shared types between frontend and backend
export interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

export interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

export interface ImageInsights {
  summary: string;
  tags: string[];
  altText: string;
}

export interface ResearchInsights {
  bullets: string[];
}

export interface ScheduledPost {
  id: string;
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
  scheduledTime: string;
  timezone: string;
  status: 'pending' | 'published' | 'failed';
}

export interface CalendarDay {
  day: number;
  date: string;
  dayName: string;
  posts: SocialMediaPost[];
  recommendedTimes: number[];
}

export interface GenerateOptions {
  imageBase64?: string;
  imageMimeType?: string;
  researchQuery?: string;
  websiteUrl?: string;
  voice?: 'friendly' | 'luxury' | 'playful' | 'clinical' | 'casual';
  schedulePosts?: boolean;
  timezone?: string;
}

export interface GeneratePostsResponse {
  success: boolean;
  posts: SocialMediaPost[];
  imageInsights?: ImageInsights;
  researchInsights?: ResearchInsights;
  scheduledPosts?: ScheduledPost[];
  generated_at: string;
  count: number;
}

export interface WebResearchResponse {
  success: boolean;
  data: {
    query: string;
    results: Array<{
      title: string;
      url: string;
      snippet: string;
      publishedDate?: string;
    }>;
    insights: string[];
    generatedAt: string;
  };
  timestamp: string;
}

export interface CalendarResponse {
  success: boolean;
  calendar: CalendarDay[];
  timezone: string;
  generatedAt: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string[];
  timestamp: string;
}

export type Platform = 'twitter' | 'instagram' | 'linkedin';
export type BrandVoice = 'friendly' | 'luxury' | 'playful' | 'clinical' | 'casual';

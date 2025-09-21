export interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

export type Platform = 'twitter' | 'instagram' | 'linkedin';

export interface SocialMediaPost {
  platform: Platform;
  content: string;
}

// New: Analysis and generation options
export interface ImageInsights {
  summary: string; // one sentence visual summary
  tags: string[]; // visual tags
  altText: string; // accessibility alt text
}

export interface ResearchInsights {
  bullets: string[]; // 3-5 concise facts
}

export type BrandVoice = 'friendly' | 'luxury' | 'playful' | 'clinical' | 'casual';

export interface GenerateOptions {
  // image (optional)
  imageBase64?: string; // data without prefix
  imageMimeType?: string; // e.g., image/png
  // research (optional)
  websiteUrl?: string;
  researchQuery?: string;
  // brand voice
  voice?: BrandVoice;
  includePlan?: boolean; // 7‑day plan
  // scheduling
  schedulePosts?: boolean;
  timezone?: string;
}

export interface PlanItem {
  day: number;
  recommendedTime: string;
  posts: SocialMediaPost[];
}

export interface GenerateResponse {
  posts: SocialMediaPost[];
  imageInsights?: ImageInsights;
  researchInsights?: ResearchInsights;
  plan?: PlanItem[];
  scheduledPosts?: ScheduledPost[];
}

export interface ScheduledPost {
  id: string;
  platform: Platform;
  content: string;
  scheduledTime: string;
  timezone: string;
  status: 'pending' | 'published' | 'failed';
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface WebResearchData {
  query: string;
  results: WebSearchResult[];
  insights: string[];
  generatedAt: string;
}
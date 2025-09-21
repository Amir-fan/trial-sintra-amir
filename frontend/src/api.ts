interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface GenerateOptions {
  imageBase64?: string;
  imageMimeType?: string;
  researchQuery?: string;
  websiteUrl?: string;
  voice?: 'friendly' | 'luxury' | 'playful' | 'clinical' | 'casual';
  schedulePosts?: boolean;
  timezone?: string;
}

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

interface ImageInsights {
  summary: string;
  tags: string[];
  altText: string;
}

interface ResearchInsights {
  bullets: string[];
}

interface ScheduledPost {
  id: string;
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
  scheduledTime: string;
  timezone: string;
  status: 'pending' | 'published' | 'failed';
}

interface GeneratePostsResponse {
  success: boolean;
  posts: SocialMediaPost[];
  imageInsights?: ImageInsights;
  researchInsights?: ResearchInsights;
  scheduledPosts?: ScheduledPost[];
  generated_at: string;
  count: number;
}

interface WebResearchResponse {
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

interface CalendarResponse {
  success: boolean;
  calendar: Array<{
    day: number;
    date: string;
    dayName: string;
    posts: SocialMediaPost[];
    recommendedTimes: number[];
  }>;
  timezone: string;
  generatedAt: string;
}

interface ApiError {
  error: string;
  message?: string;
  details?: string[];
  timestamp: string;
}

export async function generatePosts(
  product: Product,
  options?: GenerateOptions
): Promise<GeneratePostsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(
    `${apiUrl}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, options }),
    }
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to generate posts');
  }

  const data = await response.json();
  return data;
}

export async function uploadImage(file: File): Promise<ImageInsights> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${apiUrl}/api/upload-image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to analyze image');
  }

  const data = await response.json();
  return data.insights;
}

export async function performWebResearch(query: string, maxResults: number = 5): Promise<WebResearchResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, maxResults }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Web research failed');
  }

  return response.json();
}

export async function generateContentCalendar(
  posts: SocialMediaPost[],
  startDate?: string,
  timezone: string = 'UTC'
): Promise<CalendarResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/calendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ posts, startDate, timezone }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Calendar generation failed');
  }

  return response.json();
}

export async function getOptimalTimes(
  platform: 'twitter' | 'instagram' | 'linkedin',
  timezone: string = 'UTC'
): Promise<{ optimalTimes: number[] }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(
    `${apiUrl}/api/optimal-times/${platform}?timezone=${encodeURIComponent(timezone)}`
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to get optimal times');
  }

  const data = await response.json();
  return { optimalTimes: data.optimalTimes };
}

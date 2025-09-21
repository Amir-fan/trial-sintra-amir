// API client for communicating with the backend
import { 
  Product, 
  SocialMediaPost, 
  GenerateOptions, 
  ImageInsights, 
  ResearchInsights, 
  ScheduledPost, 
  GeneratePostsResponse, 
  WebResearchResponse, 
  CalendarResponse,
  ApiError
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function generatePosts(
  product: Product,
  options?: GenerateOptions
): Promise<GeneratePostsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product, options }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to generate posts');
  }

  return response.json();
}

export async function uploadImage(file: File): Promise<ImageInsights> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
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
  const response = await fetch(`${API_BASE_URL}/api/research`, {
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
  const response = await fetch(`${API_BASE_URL}/api/calendar`, {
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
  const response = await fetch(
    `${API_BASE_URL}/api/optimal-times/${platform}?timezone=${encodeURIComponent(timezone)}`
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to get optimal times');
  }

  return response.json();
}
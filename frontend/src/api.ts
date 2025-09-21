interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface GeneratePostsResponse {
  success: boolean;
  posts: Array<{
    platform: "twitter" | "instagram" | "linkedin";
    content: string;
  }>;
  generated_at: string;
  count: number;
}

interface ApiError {
  error: string;
  message?: string;
  details?: string[];
  timestamp: string;
}

export async function generatePosts(
  product: Product
): Promise<GeneratePostsResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    }
  );

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || errorData.error || 'Failed to generate posts');
  }

  const data = await response.json();
  return data;
}

import OpenAI from "openai";
import { SocialMediaPost } from "./types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    client = new OpenAI({
      apiKey: apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 2,
    });
  }

  return client;
}

export async function callOpenAI(prompt: string): Promise<SocialMediaPost[]> {
  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.8"),
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || "1000"),
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    const parsed = JSON.parse(content);
    
    if (!parsed.posts || !Array.isArray(parsed.posts)) {
      throw new Error('Invalid response format from OpenAI API');
    }

    // Validate each post
    const validatedPosts = parsed.posts.filter((post: any) => 
      post && 
      typeof post === 'object' && 
      post.platform && 
      post.content &&
      ['twitter', 'instagram', 'linkedin'].includes(post.platform)
    );

    if (validatedPosts.length === 0) {
      throw new Error('No valid posts generated');
    }

    return validatedPosts;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key');
      }
      if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('OpenAI API rate limit exceeded');
      }
    }
    
    throw new Error('Failed to generate posts: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

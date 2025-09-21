import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { SocialMediaPost, ImageInsights } from "./types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    // Force reload .env file as fallback
    require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
    
    // Prefer the key from backend-ts/.env explicitly, regardless of session/global env
    const envPath = path.resolve(__dirname, '../.env');
    // Parse file with robust handling and override env var, to ensure .env wins
    if (fs.existsSync(envPath)) {
      try {
        const raw = fs.readFileSync(envPath);
        const text = raw.toString('utf8').replace(/^\uFEFF/, '');
        const parsed = dotenv.parse(text);
        if (parsed.OPENAI_API_KEY) {
          process.env.OPENAI_API_KEY = parsed.OPENAI_API_KEY.trim();
        }
      } catch {}
    }
    let fileKey = '';
    try {
      if (fs.existsSync(envPath)) {
        const contents = fs.readFileSync(envPath, 'utf8');
        const match = contents.split(/\r?\n/).find(l => l.trim().startsWith('OPENAI_API_KEY='));
        if (match) {
          fileKey = match.split('OPENAI_API_KEY=')[1] || '';
        }
      }
    } catch {}

    // Sanitize: remove BOM, quotes, stray whitespace
    const sanitize = (v: string) => v.replace(/^\uFEFF/, '').replace(/^['"]|['"]$/g, '').trim();
    const raw = process.env.OPENAI_API_KEY || '';
    const apiKey = sanitize(fileKey) || sanitize(raw);
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      console.error('🔍 Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    console.log('✅ OpenAI client initialized with API key:', apiKey.substring(0, 20) + '...');
    
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

// Analyze an image using GPT-4o vision and return concise insights
export async function analyzeImage(
  imageBase64: string,
  mimeType: string
): Promise<ImageInsights> {
  const client = getClient();

  // Build a data URL so we don't need public hosting
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  const prompt = `You are an expert product photography analyst.
Return strict JSON with keys: summary (one sentence), tags (array of 3-6 short visual tags), altText (concise accessibility text).`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } as any },
          ] as any,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content from vision response");

    const parsed = JSON.parse(content);
    return {
      summary: String(parsed.summary || ""),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6).map((t: any) => String(t)) : [],
      altText: String(parsed.altText || "Product image"),
    };
  } catch (error) {
    console.error("Vision analysis error:", error);
    // Fail soft with minimal empty insights to keep flow working
    return { summary: "", tags: [], altText: "Product image" };
  }
}

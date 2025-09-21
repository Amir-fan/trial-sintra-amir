import { callOpenAI } from "./openai";
import { Product, SocialMediaPost } from "./types";

const POST_COUNT = 5;

export async function generateSocialMediaPosts(
  product: Product
): Promise<SocialMediaPost[]> {
  const prompt = buildPrompt(product);

  const posts = await callOpenAI(prompt);

  return posts;
}

function buildPrompt(product: Product): string {
  return `Generate ${POST_COUNT} social media posts for this product:

Product: ${product.name}
Description: ${product.description}
Price: $${product.price}
${product.category ? `Category: ${product.category}` : ""}

Create engaging social media posts for Twitter, Instagram, and LinkedIn. Use emojis and make them compelling.

Return the response as a JSON object with this exact structure:
{
  "posts": [
    {
      "platform": "twitter",
      "content": "Your Twitter post content here"
    },
    {
      "platform": "instagram", 
      "content": "Your Instagram post content here"
    },
    {
      "platform": "linkedin",
      "content": "Your LinkedIn post content here"
    }
  ]
}

Make sure each post is unique and tailored to the specific platform's audience and character limits.`;
}

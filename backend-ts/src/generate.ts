import { Product, SocialMediaPost, GenerateOptions, ImageInsights, ResearchInsights, GenerateResponse, WebResearchData } from "./types";
import { callOpenAI, analyzeImage } from "./openai";
import { WebResearchService } from "./services/WebResearchService";
import { SchedulingService } from "./services/SchedulingService";

const POST_COUNT = 5;

export async function generateSocialMediaPosts(
  product: Product,
  options: GenerateOptions = {}
): Promise<GenerateResponse> {
  let imageInsights: ImageInsights | undefined;
  let researchInsights: ResearchInsights | undefined;
  let webResearchData: WebResearchData | undefined;

  // Process image if provided
  if (options.imageBase64 && options.imageMimeType) {
    try {
      imageInsights = await analyzeImage(options.imageBase64, options.imageMimeType);
    } catch (error) {
      console.error('Image analysis failed:', error);
    }
  }

  // Perform web research if requested
  if (options.researchQuery || options.websiteUrl) {
    try {
      const webResearch = new WebResearchService(process.env.OPENAI_API_KEY || '');
      const query = options.researchQuery || `${product.name} ${product.category || 'product'}`;
      webResearchData = await webResearch.searchWeb(query);
      researchInsights = {
        bullets: webResearchData.insights
      };
    } catch (error) {
      console.error('Web research failed:', error);
    }
  }

  // Build enhanced prompt with all available data
  const prompt = buildPrompt(product, options, imageInsights, researchInsights);
  const posts = await callOpenAI(prompt);

  // Create scheduling if requested
  let scheduledPosts;
  if (options.schedulePosts) {
    const scheduler = new SchedulingService(options.timezone);
    scheduledPosts = scheduler.createSchedule(posts);
  }

  return { 
    posts, 
    imageInsights, 
    researchInsights,
    scheduledPosts
  };
}

function buildPrompt(product: Product, opts: GenerateOptions, image?: ImageInsights, research?: ResearchInsights): string {
  return `Generate ${POST_COUNT} social media posts for this product:

Product: ${product.name}
Description: ${product.description}
Price: $${product.price}
${product.category ? `Category: ${product.category}` : ""}
${opts.voice ? `\nBrand voice: ${opts.voice}` : ""}
${image ? `\nObserved Visuals: ${image.tags.join(', ')}\nImage Summary: ${image.summary}\n` : ""}
${research && research.bullets?.length ? `\nResearch Insights:\n- ${research.bullets.slice(0,5).join('\n- ')}` : ""}

Create engaging social media posts for Twitter, Instagram, and LinkedIn. Use emojis and make them compelling.

Return the response as a JSON object with this exact structure:
{
  "posts": [
    { "platform": "twitter", "content": "..." },
    { "platform": "instagram", "content": "..." },
    { "platform": "linkedin", "content": "..." },
    { "platform": "twitter", "content": "..." },
    { "platform": "instagram", "content": "..." }
  ]
}

Make sure each post is unique and tailored to the specific platform's audience and character limits.`;
}

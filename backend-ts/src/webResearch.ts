import axios from 'axios';
import { WebResearchData, WebSearchResult } from './types';

/**
 * Web Research Service
 * Provides web search functionality using OpenAI's Responses API
 * to enhance content generation with real-time market insights
 */
export class WebResearchService {
  private readonly openaiApiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.openaiApiKey = apiKey;
  }

  /**
   * Performs web search using OpenAI's Responses API
   * @param query - Search query string
   * @param maxResults - Maximum number of results to return (default: 5)
   * @returns Promise<WebResearchData>
   */
  async searchWeb(query: string, maxResults: number = 5): Promise<WebResearchData> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/responses`,
        {
          query,
          max_results: maxResults,
          search_domains: ['linkedin.com', 'twitter.com', 'instagram.com', 'forbes.com', 'techcrunch.com'],
          include_images: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const results: WebSearchResult[] = response.data.results?.map((result: any) => ({
        title: result.title || 'No title',
        url: result.url || '',
        snippet: result.snippet || 'No description available',
        publishedDate: result.published_date || undefined
      })) || [];

      const insights = this.generateInsights(results, query);

      return {
        query,
        results,
        insights,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Web search error:', error);
      
      // Fallback: return empty results with error insight
      return {
        query,
        results: [],
        insights: ['Web research temporarily unavailable. Content generated without market insights.'],
        generatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Generates insights from search results
   * @param results - Array of search results
   * @param query - Original search query
   * @returns Array of insight strings
   */
  private generateInsights(results: WebSearchResult[], query: string): string[] {
    if (results.length === 0) {
      return ['No recent market data found for this product category.'];
    }

    const insights: string[] = [];
    
    // Analyze trending topics
    const trendingTopics = this.extractTrendingTopics(results);
    if (trendingTopics.length > 0) {
      insights.push(`Trending topics: ${trendingTopics.join(', ')}`);
    }

    // Analyze competitor mentions
    const competitorMentions = this.extractCompetitorMentions(results);
    if (competitorMentions.length > 0) {
      insights.push(`Competitor activity: ${competitorMentions.join(', ')}`);
    }

    // Analyze sentiment patterns
    const sentiment = this.analyzeSentiment(results);
    if (sentiment) {
      insights.push(`Market sentiment: ${sentiment}`);
    }

    // Add general market insights
    insights.push(`Based on ${results.length} recent sources, market shows strong interest in ${query.toLowerCase()}`);

    return insights.slice(0, 5); // Limit to 5 insights
  }

  /**
   * Extracts trending topics from search results
   */
  private extractTrendingTopics(results: WebSearchResult[]): string[] {
    const topics = new Set<string>();
    
    results.forEach(result => {
      // Simple keyword extraction (in a real implementation, you'd use NLP)
      const words = result.title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 4 && !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will'].includes(word)) {
          topics.add(word);
        }
      });
    });

    return Array.from(topics).slice(0, 3);
  }

  /**
   * Extracts competitor mentions from search results
   */
  private extractCompetitorMentions(results: WebSearchResult[]): string[] {
    const competitors = new Set<string>();
    
    // Common competitor patterns (in a real implementation, you'd have a database)
    const competitorPatterns = [
      /vs\.?\s+(\w+)/gi,
      /compared to (\w+)/gi,
      /alternative to (\w+)/gi,
      /better than (\w+)/gi
    ];

    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      competitorPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const competitor = match.replace(pattern, '$1').trim();
            if (competitor.length > 2) {
              competitors.add(competitor);
            }
          });
        }
      });
    });

    return Array.from(competitors).slice(0, 3);
  }

  /**
   * Analyzes sentiment from search results
   */
  private analyzeSentiment(results: WebSearchResult[]): string | null {
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'outstanding'];
    const negativeWords = ['terrible', 'awful', 'bad', 'worst', 'hate', 'disappointing', 'poor'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    results.forEach(result => {
      const text = `${result.title} ${result.snippet}`.toLowerCase();
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}

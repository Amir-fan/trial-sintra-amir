import { Router, Request, Response } from 'express';
import { WebResearchService } from '../services/WebResearchService';
import { defaultRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Web research endpoint
router.post('/', 
  defaultRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { query, maxResults = 5 } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Query is required and must be a non-empty string',
          timestamp: new Date().toISOString()
        });
      }

      const webResearch = new WebResearchService(process.env.OPENAI_API_KEY || '');
      const researchData = await webResearch.searchWeb(query.trim(), maxResults);
      
      res.json({
        success: true,
        data: researchData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Web research error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Web research failed',
        message: 'An unexpected error occurred during web research.',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;

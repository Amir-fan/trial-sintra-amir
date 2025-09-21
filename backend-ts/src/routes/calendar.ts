import { Router, Request, Response } from 'express';
import { SchedulingService } from '../services/SchedulingService';
import { defaultRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Generate content calendar
router.post('/', 
  defaultRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { posts, startDate, timezone = 'UTC' } = req.body;
      
      if (!posts || !Array.isArray(posts) || posts.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Posts array is required and must not be empty',
          timestamp: new Date().toISOString()
        });
      }

      const scheduler = new SchedulingService(timezone);
      const calendar = scheduler.generateContentCalendar(posts, startDate);
      
      res.json({
        success: true,
        calendar,
        timezone,
        generatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Calendar generation error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Calendar generation failed',
        message: 'An unexpected error occurred while generating the content calendar.',
        timestamp: new Date().toISOString()
      });
    }
  }
);

// Get optimal posting times for a platform
router.get('/optimal-times/:platform', 
  defaultRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const { timezone = 'UTC' } = req.query;
      
      if (!['twitter', 'instagram', 'linkedin'].includes(platform)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid platform. Must be twitter, instagram, or linkedin',
          timestamp: new Date().toISOString()
        });
      }

      const scheduler = new SchedulingService(timezone as string);
      const optimalTimes = scheduler.getOptimalTimes(platform as 'twitter' | 'instagram' | 'linkedin');
      
      res.json({
        success: true,
        optimalTimes,
        platform,
        timezone,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Optimal times error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to get optimal times',
        message: 'An unexpected error occurred while fetching optimal posting times.',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;

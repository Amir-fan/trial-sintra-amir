import { Router, Request, Response } from 'express';
import { generateSocialMediaPosts } from '../generate';
import { validateRequest } from '../middleware/validation';
import { defaultRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Generate social media posts
router.post('/', 
  defaultRateLimiter,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { validatedProduct, options } = req.body;
      
      // Generate posts with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );
      
      const generatePromise = generateSocialMediaPosts(validatedProduct, options || {});
      
      const result = await Promise.race([generatePromise, timeoutPromise]) as any;
      
      res.json({
        success: true,
        posts: result.posts,
        imageInsights: result.imageInsights,
        researchInsights: result.researchInsights,
        scheduledPosts: result.scheduledPosts,
        generated_at: new Date().toISOString(),
        count: result.posts.length,
      });
      
    } catch (error) {
      console.error('Error generating posts:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          return res.status(408).json({
            success: false,
            error: 'Request timeout',
            message: 'The request took too long to process. Please try again.',
            timestamp: new Date().toISOString()
          });
        }
        
        if (error.message.includes('API key')) {
          return res.status(500).json({
            success: false,
            error: 'Configuration error',
            message: 'OpenAI API key is invalid or missing.',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while generating posts.',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;

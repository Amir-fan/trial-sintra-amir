import { Router, Request, Response } from 'express';
import multer from 'multer';
import { OpenAIService } from '../services/OpenAIService';
import { defaultRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Image upload and analysis endpoint
router.post('/image', 
  defaultRateLimiter,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file provided',
          timestamp: new Date().toISOString()
        });
      }

      const { buffer, mimetype } = req.file;
      const base64 = buffer.toString('base64');
      
      const openaiService = new OpenAIService(process.env.OPENAI_API_KEY || '');
      const insights = await openaiService.analyzeImage(base64, mimetype);
      
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Image upload error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      
      if (error instanceof Error && error.message.includes('Only image files')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type',
          message: 'Only image files are allowed',
          timestamp: new Date().toISOString()
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Image analysis failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred while analyzing the image.',
        timestamp: new Date().toISOString()
      });
    }
  }
);

export default router;

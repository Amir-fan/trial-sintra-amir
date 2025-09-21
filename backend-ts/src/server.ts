import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { generateSocialMediaPosts } from "./generate";
import { Product } from "./types";

const app = express();
const PORT = process.env.PORT || 3001;

// Validate environment variables on startup
function validateEnvironment() {
  const requiredEnvVars = ['OPENAI_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please create a .env file with the required variables.');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
  console.log('🔑 API Key loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
  console.log('🔑 API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
  console.log('🔑 API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + '...' : 'N/A');
}

// Validate environment on startup
validateEnvironment();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: any) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({ 
    hello: "world", 
    timestamp: new Date().toISOString(),
    status: "healthy",
    api_key_configured: !!process.env.OPENAI_API_KEY
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    port: PORT,
    api_key_configured: !!process.env.OPENAI_API_KEY
  });
});

// Input validation function
function validateProduct(product: any): { isValid: boolean; errors: string[]; validatedProduct?: Product } {
  const errors: string[] = [];
  
  if (!product || typeof product !== 'object') {
    errors.push('Product data is required');
    return { isValid: false, errors };
  }
  
  if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  }
  
  if (!product.description || typeof product.description !== 'string' || product.description.trim().length === 0) {
    errors.push('Product description is required and must be a non-empty string');
  }
  
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Product price is required and must be a non-negative number');
  }
  
  if (product.category && (typeof product.category !== 'string' || product.category.trim().length === 0)) {
    errors.push('Product category must be a non-empty string if provided');
  }
  
  if (product.name && product.name.length > 200) {
    errors.push('Product name must be 200 characters or less');
  }
  
  if (product.description && product.description.length > 2000) {
    errors.push('Product description must be 2000 characters or less');
  }
  
  if (product.price && product.price > 999999) {
    errors.push('Product price must be less than $999,999');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  return {
    isValid: true,
    errors: [],
    validatedProduct: {
      name: product.name.trim(),
      description: product.description.trim(),
      price: product.price,
      category: product.category?.trim() || undefined
    }
  };
}

// Generate social media posts
app.post("/api/generate", async (req: Request, res: Response) => {
  try {
    const { product } = req.body;
    
    // Validate input
    const validation = validateProduct(product);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate posts with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );
    
    const postsPromise = generateSocialMediaPosts(validation.validatedProduct!);
    
    const posts = await Promise.race([postsPromise, timeoutPromise]) as any[];
    
    res.json({
      success: true,
      posts,
      generated_at: new Date().toISOString(),
      count: posts.length,
    });
    
  } catch (error) {
    console.error('Error generating posts:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Request timeout') {
        return res.status(408).json({
          error: 'Request timeout',
          message: 'The request took too long to process. Please try again.',
          timestamp: new Date().toISOString()
        });
      }
      
      if (error.message.includes('API key')) {
        return res.status(500).json({
          error: 'Configuration error',
          message: 'OpenAI API key is invalid or missing.',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while generating posts.',
      timestamp: new Date().toISOString()
    });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Server also accessible on http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check available at http://localhost:${PORT}/health`);
  console.log(`✅ API endpoint available at http://localhost:${PORT}/api/generate`);
});

// Handle server errors
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process using this port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

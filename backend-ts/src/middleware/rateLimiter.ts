import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (options: RateLimitOptions) => {
  const { windowMs, maxRequests, message = 'Too many requests' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < now) {
        requestCounts.delete(key);
      }
    }

    const clientData = requestCounts.get(clientId);
    
    if (!clientData || clientData.resetTime < now) {
      // New window or first request
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        timestamp: new Date().toISOString()
      });
    }

    clientData.count++;
    next();
  };
};

// Default rate limiter: 10 requests per minute
export const defaultRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many requests, please try again later'
});

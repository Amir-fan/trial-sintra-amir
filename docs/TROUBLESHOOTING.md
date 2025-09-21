# Troubleshooting Guide

## Issue: Frontend "Failed to fetch" Error

### Problem
- Frontend shows "Failed to fetch" error when clicking "Generate Posts"
- Backend appears to be running but connection is refused
- Error: `ERR_CONNECTION_REFUSED` on port 3001

### Root Cause Analysis
1. **Port Binding Issue**: Backend server not properly binding to localhost
2. **IPv6 vs IPv4**: Windows might be trying to connect via IPv6 (::1) instead of IPv4 (127.0.0.1)
3. **Server Configuration**: Need to ensure proper host binding

### Solution Applied

#### 1. Updated Server Configuration
```typescript
// Before
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// After
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server also accessible on http://0.0.0.0:${PORT}`);
});
```

#### 2. Added Health Check Endpoints
```typescript
app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    port: PORT,
    api_key_configured: !!process.env.OPENAI_API_KEY
  });
});
```

#### 3. Enhanced Root Endpoint
```typescript
app.get("/", (req: Request, res: Response) => {
  res.json({ 
    hello: "world", 
    timestamp: new Date().toISOString(),
    status: "healthy",
    api_key_configured: !!process.env.OPENAI_API_KEY
  });
});
```

### Testing Steps
1. Start backend: `cd backend-ts && npx tsx src/server.ts`
2. Test health endpoint: `curl http://localhost:3001/health`
3. Test API endpoint: `curl -X POST http://localhost:3001/api/generate -H "Content-Type: application/json" -d '{"product":{"name":"Test","description":"Test","price":10}}'`
4. Start frontend: `cd frontend && npm run dev`
5. Test full application at http://localhost:3000

### Prevention
- Always bind server to '0.0.0.0' for cross-platform compatibility
- Include health check endpoints for debugging
- Test API endpoints independently before frontend integration
- Use proper error handling and logging

### Status
✅ **RESOLVED** - Server now properly binds to all interfaces and accepts connections

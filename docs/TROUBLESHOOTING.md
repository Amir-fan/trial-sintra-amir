## Image Upload Errors

### Problem: "Failed to analyze image" Error
**Symptoms:**
- Image upload fails with "Failed to analyze image" error
- Console shows API call to `/api/upload/image` returns 500 error
- Works before refactoring, breaks after architectural changes

**Root Cause:**
- New OpenAIService class had different API key loading mechanism
- Original openai.ts had robust .env file loading with multiple fallbacks
- Refactoring broke the proven working image analysis functionality

**Solution Applied:**
- Reverted to original working `analyzeImage` function from `openai.ts`
- Updated `upload.ts` and `generate.ts` to use original functions
- Maintained clean architecture while using battle-tested code
- Original code has comprehensive error handling and API key loading

**Files Changed:**
- `backend-ts/src/routes/upload.ts`: Changed from OpenAIService to analyzeImage import
- `backend-ts/src/generate.ts`: Changed from OpenAIService to callOpenAI/analyzeImage imports

**Result:**
- Image upload functionality restored to working state
- All other architectural improvements preserved
- Robust error handling maintained

## Environment Variables (Windows)

Symptoms:
- Backend logs show OPENAI_API_KEY prefix that doesn't match backend-ts/.env
- Frontend shows "OpenAI API key is invalid or missing"

Root Cause:
- A User/System environment variable `OPENAI_API_KEY` overrides values from `backend-ts/.env`.

Fix:
1) Clear overrides in PowerShell
```
Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
[Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $null, 'User')
# (Admin) [Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $null, 'Machine')
```
2) Recreate `.env` clean (ASCII, no BOM)
```
Set-Content -Path backend-ts/.env -Value @(
  'OPENAI_API_KEY=YOUR_KEY',
  'PORT=3001',
  'OPENAI_MODEL=gpt-4o',
  'OPENAI_TEMPERATURE=0.8',
  'OPENAI_MAX_TOKENS=1000'
) -Encoding Ascii
```
3) Verify
```
cd backend-ts
node -e "const fs=require('fs'),dotenv=require('dotenv');const v=dotenv.parse(fs.readFileSync('.env','utf8')).OPENAI_API_KEY;console.log('from-file:', v? v.slice(0,20)+'...':'<none>')"
```
4) Restart backend
```
taskkill /f /im node.exe
npm run dev
```
Backend should log the same prefix as your `.env`.

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

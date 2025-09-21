@echo off
echo Starting Social Media Post Generator...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend-ts && npx tsx src/server.ts"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul

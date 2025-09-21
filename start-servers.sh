#!/bin/bash
echo "Starting Social Media Post Generator..."
echo

echo "Starting Backend Server..."
cd backend-ts && npx tsx src/server.ts &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

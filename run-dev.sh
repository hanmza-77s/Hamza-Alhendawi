#!/bin/bash

echo "🚀 Starting AutoSocial Development Environment"
echo "=============================================="

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Running setup first..."
    ./setup.sh
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down AutoSocial..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to cleanup on exit
trap cleanup SIGINT SIGTERM

echo "🔧 Starting Backend Server..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "🎨 Starting Frontend Development Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ AutoSocial is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
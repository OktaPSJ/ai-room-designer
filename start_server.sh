#!/bin/bash

# AI Room Designer - Local Server Starter
# This script starts the development server for the AI Room Designer application

echo "🚀 Starting AI Room Designer..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please add your Gemini API key to .env file"
    echo "   1. Visit: https://makersuite.google.com/app/apikey"
    echo "   2. Create a free API key"
    echo "   3. Add it to .env file: VITE_GEMINI_API_KEY=your_key_here"
    echo ""
fi

# Check if API key is configured
if grep -q "VITE_GEMINI_API_KEY=$" .env || grep -q "VITE_GEMINI_API_KEY=your_gemini_api_key_here" .env; then
    echo "⚠️  Warning: Gemini API key not configured!"
    echo "   The app will work but AI features will not function."
    echo "   Add your API key to .env file to enable AI features."
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✨ Starting development server..."
echo "📍 Local URL: http://localhost:5173"
echo "🌐 Network URL: Use --host flag to expose"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the development server
npm run dev

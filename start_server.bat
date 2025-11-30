@echo off
REM AI Room Designer - Local Server Starter (Windows)
REM This script starts the development server for the AI Room Designer application

echo.
echo 🚀 Starting AI Room Designer...
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found!
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please add your Gemini API key to .env file
    echo    1. Visit: https://makersuite.google.com/app/apikey
    echo    2. Create a free API key
    echo    3. Add it to .env file: VITE_GEMINI_API_KEY=your_key_here
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo ✨ Starting development server...
echo 📍 Local URL: http://localhost:5173
echo 🌐 Network URL: Use --host flag to expose
echo.
echo Press Ctrl+C to stop the server
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start the development server
call npm run dev

#!/bin/bash

echo "🍽️ Setting up Lunch Buddy App..."
echo "================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Set up backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Set up frontend
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

echo "✅ Frontend setup complete!"

# Create .env file if it doesn't exist
cd ../backend
if [ ! -f ".env" ]; then
    cp .env.template .env
    echo "📝 Created .env file. Please add your Google Places API key."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To run the application:"
echo "1. Start backend: cd backend && source venv/bin/activate && python app.py"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Don't forget to add your Google Places API key to backend/.env"
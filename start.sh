#!/bin/bash

echo "🚀 Starting GitHub Candidate Match MVP..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "📦 Building and starting containers..."
docker-compose up --build -d

echo ""
echo "✅ Application is starting up!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "⏳ Please wait a moment for the services to fully start..."
echo "📝 Check the logs with: docker-compose logs -f"
echo ""
echo "🛑 To stop the application: docker-compose down"

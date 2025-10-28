#!/bin/bash

# Kambel Consult Deployment Script
# This script helps deploy the application to DigitalOcean

set -e

echo "🚀 Kambel Consult Deployment Script"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found!"
    echo "Creating from env.example..."
    cp env.example .env.production
    echo ""
    echo "📝 Please edit .env.production with your production values:"
    echo "   nano .env.production"
    echo ""
    read -p "Press enter when you're ready to continue..."
fi

echo "📦 Building Docker image..."
docker build -t kambel-app:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

echo ""
echo "🛑 Stopping existing container (if any)..."
docker stop kambel-app 2>/dev/null || true
docker rm kambel-app 2>/dev/null || true

echo ""
echo "🚀 Starting new container..."
docker run -d \
  --name kambel-app \
  -p 3000:3000 \
  --env-file .env.production \
  -v $(pwd)/uploads:/app/public/uploads \
  -v $(pwd)/database:/app/prisma \
  --restart unless-stopped \
  kambel-app:latest

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container Status:"
    docker ps | grep kambel-app
    echo ""
    echo "🌐 Your app should be running at: http://localhost:3000"
    echo "🔐 Admin panel: http://localhost:3000/admin/login"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:    docker logs kambel-app"
    echo "   Stop app:     docker stop kambel-app"
    echo "   Restart app:  docker restart kambel-app"
    echo "   Remove app:   docker stop kambel-app && docker rm kambel-app"
else
    echo "❌ Failed to start container"
    exit 1
fi


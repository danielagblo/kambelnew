#!/bin/bash

# Production Setup Script for DigitalOcean
# Run this after first deployment to set up the database

set -e

echo "🚀 Starting production setup..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set!"
    echo "Please configure it in DigitalOcean App Platform settings."
    exit 1
fi

echo "✅ DATABASE_URL is configured"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Seed the database (optional)
echo "🌱 Seeding database with initial data..."
npx prisma db seed || echo "⚠️  Seeding skipped (already seeded or failed)"

echo ""
echo "✅ Production setup complete!"
echo ""
echo "🎉 Your Kambel Consult website is ready!"
echo ""
echo "Next steps:"
echo "1. Visit your admin panel: https://your-app.ondigitalocean.app/admin/login"
echo "2. Login with your configured credentials"
echo "3. Start adding content!"
echo ""


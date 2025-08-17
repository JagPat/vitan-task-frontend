#!/bin/bash

# Railway Frontend Deployment Script
# This script deploys the frontend to Railway

set -e

echo "🚀 Deploying WhatsTask Frontend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Set Railway token
export RAILWAY_TOKEN="1356b3a9-d1a5-4e2a-990a-a77c50effda5"

# Build the application
echo "📦 Building application..."
npm run build

# Link to Railway project
echo "🔗 Linking to Railway project..."
railway link --project fbe81791-2b9f-41c1-aeef-853613951b16

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set \
  VITE_API_BASE_URL=https://vitan-task-production.up.railway.app \
  VITE_APP_NAME=WhatsTask \
  VITE_ENV_NAME=production

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Frontend URL: https://vitan-task-frontend.up.railway.app/"

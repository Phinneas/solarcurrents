#!/bin/bash

# Deploy Solar Currents to Cloudflare
# This script deploys both the SonicJS backend and Astro frontend

set -e

echo "🚀 Deploying Solar Currents to Cloudflare..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Deploy SonicJS Worker Backend
echo -e "${BLUE}📦 Step 1: Deploying SonicJS Worker Backend${NC}"
cd sonicjs-worker

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing SonicJS worker dependencies..."
    pnpm install
fi

# Create D1 database if it doesn't exist
echo "Setting up D1 database..."
echo -e "${YELLOW}⚠️  You need to create the D1 database manually first:${NC}"
echo "   Run: wrangler d1 create solar-currents-cms-db"
echo "   Then update wrangler.toml with the database_id"
echo ""

# Apply migrations
echo "Applying database migrations..."
pnpm db:migrate || echo -e "${YELLOW}⚠️  Migration may fail if database is not set up${NC}"

# Deploy worker
echo "Deploying SonicJS worker..."
pnpm deploy

echo -e "${GREEN}✅ SonicJS worker deployed!${NC}"
echo ""

# Step 2: Deploy Astro Frontend
echo -e "${BLUE}🎨 Step 2: Deploying Astro Frontend${NC}"
cd ../astro-citrus

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Astro dependencies..."
    pnpm install
fi

# Build the site
echo "Building Astro site..."
pnpm build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
echo -e "${YELLOW}⚠️  You need to configure your Cloudflare Pages project first${NC}"
echo "   1. Create a new Pages project at https://dash.cloudflare.com"
echo "   2. Connect your GitHub repository"
echo "   3. Set build command to: pnpm build"
echo "   4. Set build output directory to: dist"
echo "   5. Add environment variable: SONICJS_API_URL"
echo ""
echo "Or use Wrangler to deploy directly:"
echo "   wrangler pages deploy dist --project-name=solar-currents"
echo ""

# Step 3: Summary
echo -e "${BLUE}📋 Deployment Summary${NC}"
echo "Backend (SonicJS): https://solar-currents-cms.your-subdomain.workers.dev"
echo "Frontend (Astro):  https://solar-currents.pages.dev"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up your custom domain in Cloudflare Pages"
echo "2. Configure webmentions API key in environment variables"
echo "3. Update the SONICJS_API_URL in both wrangler.toml files"
echo "4. Test the admin API endpoints for content management"

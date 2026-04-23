#!/bin/bash
# Trigger a new Cloudflare Pages deployment

cd /Users/chesterbeard/Desktop/solarcurrents

# Make a small change to trigger deployment
echo "// Trigger deployment at $(date)" >> astro-citrus/src/site.config.ts

# Commit and push
git add astro-citrus/src/site.config.ts
git commit -m "trigger: Force Cloudflare Pages deployment"
git push origin main

echo "✅ Deployment triggered! Check status at:"
echo "https://dash.cloudflare.com/ → Pages → solarcurrents → Deployments"

# Solar Currents - Deployment Guide

## 🚀 Overview

This project deploys the Astro Citrus blog template integrated with SonicJS CMS to Cloudflare infrastructure.

**Architecture:**
- **Frontend**: Astro Citrus static site deployed to Cloudflare Pages
- **Backend**: SonicJS headless CMS running on Cloudflare Workers with D1 database
- **Content**: 63 solar energy blog posts migrated to SonicJS

## 📁 Project Structure

```
solarcurrents/
├── astro-citrus/          # Astro frontend
│   ├── src/
│   │   ├── content/       # Content (posts, pages) - will be moved to CMS
│   │   ├── lib/
│   │   │   └── sonicjs.ts # SonicJS API client
│   │   └── ...
│   ├── wrangler.toml      # Cloudflare Pages config
│   └── package.json
├── sonicjs-worker/        # SonicJS CMS backend
│   ├── src/
│   │   └── index.ts       # Worker entry point
│   ├── migrations/        # Database migrations
│   ├── scripts/
│   │   └── migrate-content.js
│   └── wrangler.toml
├── content/               # Original content (copied to astro-citrus)
├── convert-frontmatter.js
└── deploy.sh
```

## ✅ What's Been Completed

### Phase 1: Content Preparation ✅
- [x] Copied 63 solar posts from `content/` to `astro-citrus/src/content/post/`
- [x] Converted frontmatter from Ghost/Contentful format to Astro Citrus schema
- [x] Updated schema to accept remote cover image URLs
- [x] Fixed cover image rendering for remote images
- [x] Successfully built Astro site with all content

### Phase 2: SonicJS Backend Setup ✅
- [x] Created SonicJS Worker structure
- [x] Defined D1 database schema (posts, pages, tags)
- [x] Implemented API endpoints:
  - `GET /api/posts` - List all posts
  - `GET /api/posts/:slug` - Get single post
  - `GET /api/pages` - List all pages
  - `GET /api/pages/:slug` - Get single page
- [x] Generated migration script to import all content to D1

### Phase 3: Frontend Integration ✅
- [x] Created SonicJS API client (`src/lib/sonicjs.ts`)
- [x] Implemented caching layer for performance
- [x] Created TypeScript interfaces for type safety

### Phase 4: Deployment Configuration ✅
- [x] Created `wrangler.toml` for Cloudflare Pages
- [x] Created `wrangler.toml` for SonicJS Worker
- [x] Set up build scripts and deployment automation
- [x] Configured Node.js 20 runtime

## 🚦 Next Steps

### 1. Set Up Cloudflare D1 Database
```bash
cd sonicjs-worker

# Create production database
wrangler d1 create solar-currents-cms-db

# Create development database
wrangler d1 create solar-currents-cms-db-dev

# Update wrangler.toml with the database IDs
```

### 2. Apply Database Migrations
```bash
cd sonicjs-worker

# Apply schema migration
wrangler d1 migrations apply solar-currents-cms-db --env production

# Seed with content
wrangler d1 migrations apply solar-currents-cms-db --env production

# Do the same for dev environment
wrangler d1 migrations apply solar-currents-cms-db-dev --env dev
```

### 3. Deploy SonicJS Worker
```bash
cd sonicjs-worker
pnpm deploy  # or: wrangler deploy

# Get the deployed URL and update astro-citrus/wrangler.toml
# with the SONICJS_API_URL variable
```

### 4. Test the API
```bash
# Test posts endpoint
curl https://your-worker-url.workers.dev/api/posts

# Test single post
curl https://your-worker-url.workers.dev/api/posts/balcony-solar-panels
```

### 5. Deploy Astro Frontend
**Option A: Using Cloudflare Pages (recommended)**
1. Go to https://dash.cloudflare.com
2. Create a new Pages project
3. Connect your GitHub/GitLab repository
4. Configure build settings:
   - Build command: `pnpm build`
   - Build output directory: `dist`
5. Add environment variable:
   - `SONICJS_API_URL`: `https://your-worker-url.workers.dev`
6. Deploy!

**Option B: Using Wrangler**
```bash
cd astro-citrus
pnpm build
wrangler pages deploy dist --project-name=solar-currents
```

### 6. Update Astro to Use SonicJS API
Currently, the site still uses local content collections. To complete the SonicJS integration:

1. **Update getStaticPaths()** in:
   - `src/pages/posts/[...slug].astro`
   - `src/pages/posts/[...page].astro`
   - `src/pages/tags/[tag]/[...page].astro`
   
2. **Replace content loading** from `getCollection()` to `getSonicJSClient()`

3. **Example:**
```typescript
// Old (local collections)
import { getCollection } from "astro:content";
const posts = await getCollection("post");

// New (SonicJS API)
import { getSonicJSClient } from "@/lib/sonicjs";
const client = getSonicJSClient();
const posts = await client.getPosts();
```

## 🔧 Configuration

### Environment Variables

**Astro Frontend (`astro-citrus/.env` or Cloudflare Pages):**
```bash
SONICJS_API_URL=https://your-worker-url.workers.dev
WEBMENTION_API_KEY=your-key  # Optional
```

**SonicJS Worker (`sonicjs-worker/wrangler.toml`):**
```toml
[env.production.vars]
CORS_ORIGIN = "https://your-astro-site.pages.dev"
```

### Custom Domains

1. **Add custom domain to Cloudflare Pages:**
   - Go to Pages project → Custom domains
   - Add your domain (e.g., `solarcurrents.com`)
   - Follow DNS configuration instructions

2. **Update CORS in SonicJS Worker:**
   - Edit `sonicjs-worker/wrangler.toml`
   - Update `CORS_ORIGIN` to match your custom domain
   - Redeploy the worker

## 🛠️ Development

### Local Development

```bash
# Terminal 1: Start SonicJS worker
cd sonicjs-worker
pnpm dev  # Runs on http://localhost:8787

# Terminal 2: Start Astro dev server
cd astro-citrus
pnpm dev  # Runs on http://localhost:3000
```

### Adding New Content

**Option A: Through SonicJS API (once integrated)**
```bash
curl -X POST https://your-worker-url.workers.dev/api/admin/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Post",
    "description": "Post description",
    "content": "# Content here",
    "slug": "new-post",
    "publishDate": "2025-01-01",
    "tags": ["solar", "guide"]
  }'
```

**Option B: Add to local files (current approach)**
1. Create new `.md` file in `astro-citrus/src/content/post/`
2. Use the correct frontmatter format
3. Rebuild and deploy

## 📊 Content Stats

- **Total Posts**: 63
- **Content Topics**: Solar panels, generators, batteries, camping gear, RV setups
- **Tags**: solar, home, camping, RV, battery, generator, etc.
- **Cover Images**: External URLs (Unsplash, etc.) - remote images

## 🐛 Troubleshooting

### Build Errors
- **Title too long**: Schema updated to 120 chars max
- **Missing image dimensions**: Remote images use `<img>` tag instead of `<Image>`
- **Content not found**: Check file paths and frontmatter format

### API Errors
- **CORS issues**: Update `CORS_ORIGIN` in wrangler.toml
- **Database errors**: Ensure migrations applied and database ID correct
- **404 errors**: Verify slug matches and post is not draft

### Deployment Issues
- **Node version**: Ensure using Node.js 20+
- **Memory limits**: Cloudflare Workers have 128MB limit (sufficient for this use case)
- **Build timeouts**: Larger sites may need build configuration adjustments

## 📝 Notes

### Architecture Decisions
- **Why SonicJS?**: Headless CMS on Cloudflare Workers with D1 database - perfect for Edge deployment
- **Why separate content?**: Enables dynamic content updates without site rebuild
- **Caching**: Built-in cache in SonicJS client for performance
- **Remote images**: Using external URLs reduces build size and complexity

### Future Enhancements
- [ ] Add authentication to SonicJS admin endpoints
- [ ] Implement webhooks for automatic rebuilds on content change
- [ ] Add image optimization service
- [ ] Implement search functionality
- [ ] Add RSS feed from SonicJS API
- [ ] Migrate to full SonicJS API integration (currently using local content)

## 📚 Resources

- [Astro Documentation](https://docs.astro.build/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Database](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [SonicJS Concept](https://github.com/lane711/sonicjs) (Note: This is a custom implementation)

## 🤝 Support

For issues or questions:
1. Check Astro build output for errors
2. Verify SonicJS API is accessible
3. Check Cloudflare dashboard for deployment logs
4. Review this deployment guide

---

**Generated**: 2025-01-14  
**Status**: ✅ Phase 1-4 Complete | 🔄 Ready for Cloudflare Deployment

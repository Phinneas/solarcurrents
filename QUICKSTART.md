# 🚀 Quick Start - Deploy to Cloudflare

## ✅ What's Ready

Your Astro Citrus blog with 63 solar posts is **ready to deploy**!

**Completed:**
- ✅ All content migrated and converted
- ✅ Astro site builds successfully
- ✅ SonicJS CMS backend configured
- ✅ Deployment scripts ready
- ✅ D1 database migrations prepared

## 🎯 Next Steps (5-10 minutes)

### 1. Set Up D1 Database

```bash
cd sonicjs-worker

# Create databases
wrangler d1 create solar-currents-cms-db
wrangler d1 create solar-currents-cms-db-dev

# Copy the database IDs from output and add to wrangler.toml
```

### 2. Deploy SonicJS Backend (2 min)

```bash
cd sonicjs-worker
pnpm install
wrangler d1 migrations apply solar-currents-cms-db --env production
pnpm deploy

# Note the deployed URL - looks like: https://solar-currents-cms.your-subdomain.workers.dev
```

### 3. Deploy Astro Frontend to Cloudflare Pages (3 min)

**Option A: Automatic (Recommended)**
```bash
cd astro-citrus
pnpm install
pnpm build

# Set your SonicJS URL from step 2:
export SONICJS_API_URL="https://solar-currents-cms.your-subdomain.workers.dev"

# Deploy:
wrangler pages deploy dist --project-name=solar-currents
```

**Option B: GitHub Integration**  
Go to https://dash.cloudflare.com → Pages → Create Project → Connect GitHub
- Build command: `pnpm build`
- Build directory: `dist`
- Environment variable: `SONICJS_API_URL` = your worker URL

### 4. Visit Your Site! 🎉

Your site will be at: `https://solar-currents.pages.dev` (or your custom domain)

## 🔧 Customize

### Update Site Config
Edit `astro-citrus/src/site.config.ts`:
```typescript
export const siteConfig = {
  title: "Your Site Name",        // Change this
  description: "Your description", // Change this
  author: "Your Name",             // Change this
  // ...
};
```

### Add New Posts

**Currently (local files):**  
Create `astro-citrus/src/content/post/my-post.md`:
```yaml
---
title: "Your Post Title"
description: "Post description"
publishDate: "15 January 2025"
tags: ["solar", "guide"]
coverImage:
  src: "https://images.unsplash.com/..."
  alt: "Image description"
---

Your content here...
```

Then rebuild: `pnpm build && wrangler pages deploy dist`

**Future (SonicJS API):** Use admin API endpoints (not yet set up)

### Custom Domain

1. In Cloudflare Pages dashboard: Custom Domains → Add Domain
2. Enter your domain (e.g., `solarcurrents.com`)
3. Follow DNS instructions
4. Update `sonicjs-worker/wrangler.toml`:
   ```toml
   CORS_ORIGIN = "https://yourdomain.com"
   ```
5. Redeploy: `cd sonicjs-worker && pnpm deploy`

## 📊 Current Content

- **63 blog posts** about solar energy
- Topics: Solar panels, generators, batteries, camping, RVs
- All posts have cover images, descriptions, and tags
- Responsive design with dark/light mode
- SEO optimized with OG images

## 🐛 If Something Goes Wrong

**Build fails?**
```bash
cd astro-citrus
pnpm install
pnpm build
```

**Worker won't deploy?**
```bash
cd sonicjs-worker
pnpm install
pnpm deploy
```

**Content not showing?**
- Check `astro-citrus/src/content/post/` has .md files
- Run: `node /Users/chesterbeard/Desktop/solarcurrents/convert-frontmatter.js`
- Rebuild: `pnpm build`

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎯 You're Done!

Your solar energy blog is now live on Cloudflare infrastructure with:
- ⚡ Lightning-fast static site (Astro + Cloudflare Pages)
- 🗄️ Headless CMS ready (SonicJS + D1 database)
- 🌐 Global CDN
- 🔒 SSL certificate included
- 📱 Fully responsive
- 🎨 Beautiful design

**Total setup time ~10 minutes** (if you already have Cloudflare account)

---

**Ready to deploy?** Run the commands above or execute: `./deploy.sh`

# ☁️ Cloudflare Pages Deployment - Quick Setup

## Step 1: Go to Cloudflare Dashboard

**URL**: https://dash.cloudflare.com/

1. Login to your Cloudflare account
2. Click **"Pages"** in the left sidebar
3. Click **"Create a project"**

## Step 2: Connect GitHub Repository

1. Click **"Connect to Git"**
2. Select **"GitHub"**
3. Authorize Cloudflare to access your GitHub (if prompted)
4. Find and select the repository: **Phinneas/solarcurrents**
5. Click **"Begin setup"**

## Step 3: Configure Build Settings

### Build Settings Section:

- **Framework preset**: Select **"Astro"** (or "None" if Astro not listed)
- **Build command**: `pnpm build`
- **Build output directory**: `dist`

### Environment Variables Section:

Click **"Add variable"** and add:

```
Variable name:  SONICJS_API_URL
Value:          https://solar-currents-cms.buzzuw2.workers.dev
```

### Build System Configuration:

- **Root Directory**: `/astro-citrus` (IMPORTANT! Your Astro site is in the astro-citrus subdirectory)
- **Node.js version**: 20 (or latest LTS)

## Step 4: Save and Deploy

1. Review all settings
2. Click **"Save and Deploy"**
3. Wait for build to complete (2-3 minutes)
4. Watch the logs in real-time!

## Step 5: Visit Your Site! 🎉

Once deployment completes, your site will be live at:

**https://solar-currents.pages.dev**

## Optional: Custom Domain

1. In your Pages project, click **"Custom domains"**
2. Add your domain (e.g., `solarcurrents.com`)
3. Follow the DNS setup instructions
4. Update the CORS setting in your worker:
   ```bash
   cd sonicjs-worker
   sed -i '' 's/CORS_ORIGIN = "https:\/\/solar-currents.pages.dev"/CORS_ORIGIN = "https:\/\/yourdomain.com"/' wrangler.toml
   npx wrangler deploy src/index.ts
   ```

## 🧪 Test Your Deployment

Once live, test these URLs:

- **Homepage**: https://solar-currents.pages.dev
- **Blog**: https://solar-currents.pages.dev/posts
- **API**: https://solar-currents-cms.buzzuw2.workers.dev/api/posts

## 📊 Expected Build Output

You should see in the Cloudflare build logs:

```
✓ 66 pages built
✓ Search indexed 7274 words
✓ Static assets deployed
✅ Build complete!
```

## 🔥 Build Fails?

If you see errors:

1. **"Command not found: pnpm"**
   - Add environment variable: `NODE_VERSION = 20`
   - Or use npm instead: `npm run build`

2. **"Cannot find module"**
   - Add build command: `pnpm install`

3. **"Permission denied"**
   - Make sure you're using Node.js 20+

4. **Wrong root directory**
   - Set **Root Directory** to `/astro-citrus`

## 🎉 Success!

Once you see "✅ Build complete!", your solar energy blog is live!

---

**Need Help?** Check the logs in Cloudflare dashboard or run:
```bash
cd /Users/chesterbeard/Desktop/solarcurrents/astro-citrus
pnpm build
```

# 🚀 Deploy to Cloudflare Pages

## ✅ What's Ready

- GitHub: `Phinneas/solarcurrents`
- 63 solar posts ready
- SonicJS API running at: https://solar-currents-cms.buzzuw2.workers.dev
- Everything committed and pushed

## 🎯 Deploy in 3 Minutes

### 1. Create Cloudflare Pages Project

Go to https://dash.cloudflare.com/
- Click **Pages** → **Create a project**
- Connect **GitHub** → Select **Phinneas/solarcurrents**

### 2. Configure Build Settings

**⚠️ CRITICAL - Your site is in a subfolder:**

| Setting | Value |
|---------|-------|
| Framework preset | **Astro** (or None) |
| **Root Directory** | **`/astro-citrus`** |
| Build command | `pnpm build` |
| Build output directory | `dist` |

### 3. Add Environment Variables

```
NODE_VERSION = 20
SONICJS_API_URL = https://solar-currents-cms.buzzuw2.workers.dev
```

### 4. Click "Save and Deploy"

Wait 2-3 minutes...

### 5. Your Site is Live! 🎉

**Visit**: https://solarcurrents.pages.dev

---

## 🔥 Build Failed?

**"package.json not found"** → Set Root Directory to `/astro-citrus`

**"pnpm command not found"** → Add `NODE_VERSION = 20`

---

## 🧪 Test

```bash
# Test site
curl https://solarcurrents.pages.dev

# Test API
curl https://solar-currents-cms.buzzuw2.workers.dev/api/posts
```

---

**Ready? Deploy now!** 🚀
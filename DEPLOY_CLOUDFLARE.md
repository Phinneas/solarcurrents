# ☁️ Deploy to Cloudflare Pages - Quick Guide

## ✅ What You Already Have

- ✅ GitHub repository: `Phinneas/solarcurrents`
- ✅ All 63 solar posts ready
- ✅ SonicJS API running: https://solar-currents-cms.buzzuw2.workers.dev
- ✅ Astro site built and ready

## 🎯 Deploy in 3 Minutes

### Step 1: Create Cloudflare Pages Project

**1. Go to Cloudflare Dashboard:**
https://dash.cloudflare.com/

**2. Click:**
- **Pages** (left sidebar)
- **Create a project**

**3. Select:**
- **"Connect to Git"**
- **GitHub** (authorize if needed)
- Find and select: **Phinneas/solarcurrents**

### Step 2: Configure Build Settings

**THIS IS CRITICAL - Your site is in a subfolder!**

Set these values exactly:

| Setting | Value |
|---------|-------|
| Framework preset | **Astro** (or "None") |
| **Root Directory** | **`/astro-citrus`** ⚠️ |
| Build command | `pnpm build` |
| Build output directory | `dist` |

**How to set Root Directory:**
- Look for "Root Directory" field in the setup
- Enter exactly: `/astro-citrus`
- This tells Cloudflare your `package.json` is in that subfolder

### Step 3: Add Environment Variables

Click **"Environment variables (advanced)"** → **"Add variable"**

```
Variable name:  NODE_VERSION
Value:          20
```

Click **"Add variable"** again:

```
Variable name:  SONICJS_API_URL
Value:          https://solar-currents-cms.buzzuw2.workers.dev
```

### Step 4: Deploy!

Click **"Save and Deploy"**

**Wait 2-3 minutes** for the build to complete

### Step 5: Visit Your Site! 🎉

Once complete, visit:
**https://solarcurrents.pages.dev**

---

## 🧪 Test Your Deployment

```bash
# Test the site
curl -I https://solarcurrents.pages.dev

# Test the API
curl https://solar-currents-cms.buzzuw2.workers.dev/api/posts | head -5
```

---

## 🔥 Build Fails? Quick Fixes

### **Error: "package.json not found"**
→ You forgot to set **Root Directory** to `/astro-citrus`

**Fix:**
- Go to Pages → solarcurrents → Settings → Builds & deployments
- Find "Root Directory"
- Change to: `/astro-citrus`
- Click "Save" → "Retry deployment"

### **Error: "pnpm command not found"**
→ Node.js version issue

**Fix:**
- Settings → Environment variables
- Add: `NODE_VERSION = 20`
- Click "Save" → "Retry deployment"

### **Error: "404 on all pages"**
→ Wait 30 seconds and refresh (propagation time)
- Or check if build actually completed

---

## 📝 What's Being Deployed

Your site includes:
- **63 solar energy blog posts**
- Responsive design (mobile, tablet, desktop)
- Dark/light mode toggle
- Search functionality
- Fast static hosting on Cloudflare edge
- SEO optimized

**Sample posts:**
- Balcony Solar Panels, Urban Power Revolution
- Best Solar Generators for Camping
- LiFePO4 Solar Battery Guide
- Solar Panels for Renters

---

## 🎯 Project Structure Reminder

```
solarcurrents/          ← Git repository root
├── astro-citrus/       ← Your Astro site (this gets built)
│   ├── src/
│   │   └── content/post/  ← Your 63 posts
│   ├── package.json
│   └── dist/          ← Built files (generated)
├── sonicjs-worker/     ← Your CMS (already deployed)
└── ...
```

**Build happens in:** `astro-citrus/` subfolder  
**Output goes to:** `astro-citrus/dist/`

---

## 🎉 Expected Result

After successful deployment:

✅ **Your solar blog is LIVE!**  
✅ **All 63 posts published**  
✅ **Lightning fast** on Cloudflare edge  
✅ **Search enabled**  
✅ **CMS API ready** for future enhancements

---

## 📞 Need Help?

1. **Build fails?** Check the build logs in Cloudflare dashboard
2. **404 errors?** Wait 30 seconds and refresh, or check if build finished
3. **Wrong repo?** Disconnect and reconnect to Phinneas/solarcurrents

---

**Ready? Go deploy now!** 🚀

Just go to https://dash.cloudflare.com/ → Pages → Create project → Follow steps above.

**Total setup time: 2-3 minutes**
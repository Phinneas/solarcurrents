# Solar Currents — Architecture Summary

Last updated: 2026-07-28

## How the site works

- **Framework:** Astro 5 with SSR via `@astrojs/cloudflare`
- **Hosting:** Cloudflare Pages
- **Blog posts:** Astro content collections (`src/content/post/*.md`)
- **Notes:** Astro content collections (`src/content/note/*.md`)
- **Search:** In-memory filter over `getCollection('post')` at runtime (no external DB)
- **No D1 required for posts.** D1 was previously used but has been removed from the post data layer.

## Adding a new blog post

1. Create a markdown file in `src/content/post/<slug>.md`
2. Use this frontmatter template:

```yaml
---
title: "Your Post Title"
description: "One-sentence summary for SEO and previews."
publishDate: 2026-07-28
tags:
  - rv-solar
  - van-life
draft: false
---
```

3. Run `pnpm run build`
4. Deploy: `wrangler pages deploy dist --project-name=solarcurrents`

That's it. No database migration, no seed script, no D1 sync.

## Key files

| File | Purpose |
|------|---------|
| `src/data/post.ts` | Blog data layer. Uses `getCollection('post')`. |
| `src/content.config.ts` | Content collection schemas for posts, notes, series. |
| `src/content/post/` | All blog post markdown files. |
| `src/pages/posts/[...slug].astro` | Individual post renderer. |
| `src/pages/posts/index.astro` | Post list (paginated). |
| `src/pages/api/search.ts` | Search endpoint (filters in-memory). |
| `src/pages/rss.xml.ts` | RSS feed. |

## What NOT to change

- Do **not** re-introduce D1 queries in `src/data/post.ts` or `src/pages/api/search.ts`.
- Do **not** pass `db` (from `Astro.locals.runtime.env.DB`) into any function in `src/data/post.ts`.
- The `DB` binding can remain in `wrangler.toml` for other uses, but posts no longer use it.

## Common issues and fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| 500 on `/posts/` or home | Post data layer trying to use D1 | Ensure `src/data/post.ts` uses `getCollection('post')` |
| New post not showing | Missing frontmatter field | Check `title`, `description`, `publishDate`, `tags` in frontmatter |
| Build fails | Content schema mismatch | Update `src/content.config.ts` if adding new frontmatter fields |
| Search returns nothing | Query too short | Search requires ≥2 characters |

## Deployment checklist

- [ ] `pnpm run build` succeeds with no errors
- [ ] `curl https://solarcurrents.pages.dev/` returns 200
- [ ] `curl https://solarcurrents.pages.dev/posts/` returns 200
- [ ] `curl https://solarcurrents.pages.dev/posts/<new-post-slug>/` returns 200
- [ ] `curl "https://solarcurrents.pages.dev/api/search?q=solar"` returns 200

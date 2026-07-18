# Spec: Remove SonicJS Worker, Direct D1 Access, SSR Content Delivery

## Objective

Eliminate the SonicJS CMS worker intermediary. Have the Astro frontend query D1 directly for blog content. Switch to `output: 'server'` so content can be published, updated, and deleted without requiring a site rebuild or redeploy.

---

## Current State

| Component | Status | Notes |
|---|---|---|
| Astro frontend | Static build (`output` not set, defaults to static) | Content baked at build time via `getCollection("post")` |
| SonicJS worker | Deployed at `solar-currents-cms.buzzuw2.workers.dev` | REST API wrapper around D1; CORS-enabled |
| D1 database | `solar-currents-cms-db` (id: `8db2540a-af3d-497a-af35-11235bb44503`) | Schema created; seed migration `0002_seed_content.sql` has 63 posts |
| Content source | Local Markdown (`astro-citrus/src/content/post/`) | 63 `.md` files; Astro content collections |
| D1 binding in Pages | **Missing** | `astro-citrus/wrangler.toml` has no `[[d1_databases]]` block |
| Cloudflare adapter | **Missing** | `@astrojs/cloudflare` not in `package.json` |

**Key issue:** The Astro site cannot access D1 today because it is a static build with no adapter and no D1 binding. The SonicJS worker is the only thing that can talk to D1.

---

## Target Architecture

```
┌─────────────────────────────────────┐
│  Cloudflare Pages (Astro SSR)       │
│  - @astrojs/cloudflare adapter      │
│  - D1 binding: DB                   │
│  - output: 'server'                 │
└──────────────┬──────────────────────┘
               │ SQL queries
               ▼
┌─────────────────────────────────────┐
│  D1 Database                        │
│  - posts, tags, post_tags, pages    │
│  - 63+ seeded posts                 │
└─────────────────────────────────────┘
```

The SonicJS worker is removed entirely. The Astro site queries D1 directly inside server-side rendered pages.

---

## Detailed Implementation Plan

### Phase 1 — Verify D1 Data Integrity (do not skip)

Before deleting any code, confirm the D1 database actually contains the posts.

1. Query the production D1 database for post count:
   ```bash
   cd sonicjs-worker
   wrangler d1 execute solar-currents-cms-db --command="SELECT COUNT(*) as post_count FROM posts WHERE is_draft = 0;"
   ```
2. Spot-check a known slug:
   ```bash
   wrangler d1 execute solar-currents-cms-db --command="SELECT slug, title, publish_date FROM posts WHERE slug = 'community-solar-programs';"
   ```
3. Verify tags are linked:
   ```bash
   wrangler d1 execute solar-currents-cms-db --command="SELECT t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id JOIN posts p ON pt.post_id = p.id WHERE p.slug = 'community-solar-programs';"
   ```
4. If count is 0 or data is missing, apply the seed migration **before proceeding**:
   ```bash
   wrangler d1 migrations apply solar-currents-cms-db
   ```

> **Gate:** Do not proceed to Phase 2 unless D1 contains all 63 posts with correct tags.

---

### Phase 2 — Install Cloudflare Adapter & Configure SSR

1. Add the adapter to `astro-citrus`:
   ```bash
   cd astro-citrus
   pnpm add @astrojs/cloudflare
   ```

2. Update `astro.config.ts`:
   - Add `import cloudflare from "@astrojs/cloudflare";`
   - Set `output: "server"`
   - Set `adapter: cloudflare()`
   - Keep all existing integrations (MDX, Tailwind, sitemap, etc.)

3. Update `astro-citrus/wrangler.toml`:
   ```toml
   name = "solarcurrents"
   pages_build_output_dir = "dist"
   compatibility_date = "2024-11-12"

   [build.environment]
   NODE_VERSION = "20"

   # D1 Database — direct binding, no SonicJS worker
   [[d1_databases]]
   binding = "DB"
   database_name = "solar-currents-cms-db"
   database_id = "8db2540a-af3d-497a-af35-11235bb44503"

   [env.production.vars]
   ENVIRONMENT = "production"

   [env.preview.vars]
   ENVIRONMENT = "preview"
   ```
   > Remove `SONICJS_API_URL` — no longer needed.

4. Add ambient type declarations for the D1 binding:
   Create or update `astro-citrus/src/env.d.ts` (or `src/types/env.d.ts`) so TypeScript knows about `DB`:
   ```typescript
   /// <reference types="astro/client" />

   type D1Database = import('@cloudflare/workers-types').D1Database;

   declare namespace App {
     interface Locals {
       runtime: {
         env: {
           DB: D1Database;
         };
       };
     }
   }
   ```
   > Also install `@cloudflare/workers-types` as a devDependency if not already present.

---

### Phase 3 — Rewrite Data Layer (`src/data/post.ts`)

Replace Astro content collections with D1 queries. The interface shape should remain as compatible as possible to minimize upstream changes in components.

**New `src/data/post.ts` responsibilities:**
- `getAllPosts()` → `SELECT ... FROM posts JOIN post_tags JOIN tags WHERE is_draft = 0 ORDER BY publish_date DESC`
- `getPostBySlug(slug)` → `SELECT ... FROM posts ... WHERE slug = ? AND is_draft = 0`
- `getPostsByTag(tag)` → `SELECT ... FROM posts ... JOIN ... WHERE t.name = ?`
- `getUniqueTags(posts)` → derive from post list, or query `SELECT name FROM tags`
- `groupPostsByYear(posts)` → keep existing helper, just change input type

**Type changes:**
- Replace `CollectionEntry<"post">` with a custom `BlogPost` interface that mirrors the shape Astro components expect (at minimum: `id`, `data.title`, `data.description`, `data.publishDate`, `data.updatedDate`, `data.coverImage`, `data.tags`, `body` or rendered `Content`).
- Since we are in SSR mode and no longer using `astro:content`, we lose `render()`. We must render markdown to HTML ourselves. Options:
  1. **Store pre-rendered HTML in D1** (add a `content_html` column, populate at write time).
  2. **Render Markdown on-the-fly** in the route using a lightweight MDX/Markdown processor (e.g., `marked`, `micromark`, or Astro's own `astro/runtime/server` internals).
  
  **Recommendation:** Option 2 with `marked` or `micromark` for now, because it does not require a schema migration. If performance becomes an issue, migrate to Option 1 later.

**Important:** The individual post route (`[...slug].astro`) currently does:
```astro
const { Content } = await render(post);
<PostLayout post={post}><Content /></PostLayout>
```
After the change, it will need to pass raw HTML or a rendered component. Plan for this in the route files.

---

### Phase 4 — Update Page Routes for SSR

#### `src/pages/posts/[...slug].astro`
- Remove `getStaticPaths` entirely.
- Read `slug` from `Astro.params`.
- Fetch post from D1 via `getPostBySlug(slug)` using `Astro.locals.runtime.env.DB`.
- If no post → return `404` response (`return new Response(null, { status: 404 })` or Astro's `Astro.redirect('/404')`).
- Render markdown body to HTML (using `marked` or similar).
- Pass raw HTML string to `PostLayout` (update `PostLayout` if needed to accept `htmlContent` prop and render with `set:html`).

#### `src/pages/posts/[...page].astro`
- Remove `getStaticPaths` and `paginate()`.
- Accept `?page=` query parameter for pagination.
- Fetch all posts from D1, apply pagination in-memory or with SQL `LIMIT`/`OFFSET`.
- Return paginated list to `PostPreview` components.

#### `src/pages/tags/[tag]/[...page].astro`
- Similar conversion: SSR, fetch posts by tag, paginate.

#### `src/pages/rss.xml.ts`
- Currently uses `getCollection`. Switch to D1 query.

#### `src/pages/og-image/[...slug].png.ts`
- Uses `getEntry` from `astro:content`. Switch to D1 query.

---

### Phase 5 — Update Layouts & Components

- `PostLayout.astro` may need to accept either a rendered component or an HTML string. If we use `marked` to produce HTML, change:
  ```astro
  <PostLayout post={post}>
    <Fragment set:html={htmlContent} />
  </PostLayout>
  ```
- `PostPreview.astro` — verify it only accesses `post.data.*` fields; if we match the shape, no changes needed.

---

### Phase 6 — Delete SonicJS Worker Code

Once Phases 1–5 are complete and tested locally, delete:

```
sonicjs-worker/
  src/index.ts
  scripts/migrate-content.js
  migrations/0001_create_posts_table.sql
  migrations/0002_seed_content.sql
  package.json
  pnpm-lock.yaml
  wrangler.toml
```

> **Do not delete the D1 database itself.** Only delete the worker code and its wrangler.toml. The D1 database `solar-currents-cms-db` remains the source of truth.

Also delete from `astro-citrus`:
- `src/lib/sonicjs.ts` — no longer needed.

Update project documentation (`DEPLOYMENT.md`, `README.md`) to reflect:
- No more SonicJS worker.
- Content lives in D1.
- Astro queries D1 directly via Cloudflare Pages Functions.

---

### Phase 7 — Build, Test, Deploy

1. **Local dev test:**
   ```bash
   cd astro-citrus
   pnpm build
   ```
   With `output: 'server'`, `astro build` will produce a Pages Functions bundle.

2. **Deploy to Cloudflare Pages:**
   ```bash
   pnpm build
   wrangler pages deploy dist --project-name=solarcurrents
   ```
   Or via Git integration if configured.

3. **Post-deploy verification:**
   - Homepage loads.
   - `/posts/` lists posts.
   - `/posts/community-solar-programs` renders correctly.
   - Tags work.
   - RSS works.
   - 404s for missing slugs.

---

## File Changes Summary

| File | Action | Description |
|---|---|---|
| `astro-citrus/package.json` | Modify | Add `@astrojs/cloudflare`, `marked` (or similar), `@cloudflare/workers-types` |
| `astro-citrus/astro.config.ts` | Modify | Add `output: 'server'`, `adapter: cloudflare()` |
| `astro-citrus/wrangler.toml` | Modify | Add `[[d1_databases]]` binding; remove `SONICJS_API_URL` |
| `astro-citrus/src/env.d.ts` | Create/Modify | Add `App.Locals.runtime.env.DB` typing |
| `astro-citrus/src/data/post.ts` | Rewrite | D1 queries instead of `getCollection` |
| `astro-citrus/src/lib/sonicjs.ts` | Delete | No longer needed |
| `astro-citrus/src/pages/posts/[...slug].astro` | Rewrite | SSR route, no `getStaticPaths` |
| `astro-citrus/src/pages/posts/[...page].astro` | Rewrite | SSR pagination |
| `astro-citrus/src/pages/tags/[tag]/[...page].astro` | Rewrite | SSR tag filtering |
| `astro-citrus/src/pages/rss.xml.ts` | Modify | D1 query |
| `astro-citrus/src/pages/og-image/[...slug].png.ts` | Modify | D1 query |
| `astro-citrus/src/layouts/BlogPost.astro` | Modify | Accept HTML string if needed |
| `sonicjs-worker/` | Delete entire directory | Worker, migrations, scripts, config |
| `DEPLOYMENT.md` | Modify | Update architecture docs |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| D1 database is empty or incomplete | **Phase 1 gate:** Verify post count and spot-check data before any deletions. Re-run migration if needed. |
| Markdown rendering differs from Astro's | Use `marked` with GFM enabled. Accept minor rendering differences. Test multiple posts. |
| Performance: every request hits D1 | D1 is fast for reads and runs at the edge. Add `Cache-Control` headers or Astro caching if needed. |
| SEO: SSR pages need proper meta tags | `PostLayout` already handles this. Ensure `post.data` shape is preserved. |
| Cloudflare Pages build size limits | `@astrojs/cloudflare` bundles efficiently. Monitor build output. |
| Existing inbound links break | Keep slug schema identical. D1 slugs come from the same markdown filenames. |
| `pagefind` search index breaks | `pagefind` runs at build time. With SSR, there is no static HTML to index at build time. **Decision needed:** either keep a subset of pages prerendered, run `pagefind` against a crawled snapshot, or replace with a D1-based search. |

### Open Decision: Search (`pagefind`)

`pagefind` is currently run in `postbuild`. With full SSR, there are no static HTML files to index at build time.

**Options:**
1. **Prerender `/posts/` and all individual post pages** (`export const prerender = true`), while keeping admin/dynamic routes as SSR. This preserves `pagefind` compatibility but means new posts still require a rebuild for search indexing.
2. **Replace `pagefind`** with a lightweight D1-based search (SQL `LIKE` query on title + description + content). Simple and fully dynamic, but less sophisticated than `pagefind`.
3. **Crawl after deploy:** Run `pagefind` against the deployed site URL in CI after deployment.

**Recommendation for this spec:** Option 1 — prerender posts. This gives us the best of both worlds: content is dynamic (reads from D1 at request time for the HTML), but the search index is rebuilt on deploy. If the user truly wants *zero* rebuilds ever, choose Option 2.

> **Note:** Ask the user which search approach they prefer before implementation.

---

## Rollback Plan

1. **Code rollback:** `sonicjs-worker/` is deleted but can be restored from Git history.
2. **Database rollback:** D1 is never deleted. If needed, the SonicJS worker can be redeployed and pointed back at the same D1 database.
3. **Astro config rollback:** Revert `astro.config.ts` to remove `output: 'server'` and the adapter; restore `src/data/post.ts` to use `getCollection`.

---

## Success Criteria

- [ ] D1 database contains all 63+ posts with tags verified.
- [ ] `sonicjs-worker/` directory is fully deleted.
- [ ] `astro-citrus` builds successfully with `output: 'server'` and `@astrojs/cloudflare`.
- [ ] Homepage, `/posts/`, individual post pages, tag pages, RSS, and OG images all render correctly from D1.
- [ ] Adding a new post directly to D1 (via SQL or a future admin UI) makes it appear on the site immediately with no rebuild.
- [ ] No `SONICJS_API_URL` references remain in the codebase.

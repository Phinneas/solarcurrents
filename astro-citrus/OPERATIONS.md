# Solar Currents — Operations Runbook

## Architecture

- **Framework**: Astro 5.18.0 with `@astrojs/cloudflare` adapter
- **Hosting**: Cloudflare Pages (`solarcurrents`)
- **Database**: Cloudflare D1 (`solar-currents-cms-db`)
- **Runtime**: Cloudflare Workers (not Node.js)
- **Content source**: Markdown posts stored in D1, queried at request time

## Critical Constraint: Cloudflare Workers Runtime

This site runs in a **Cloudflare Worker**, not a Node.js server. That means:

- **No filesystem access** (`node:fs` will crash the Worker)
- **No Node.js built-in modules** unless explicitly polyfilled by `nodejs_compat`
- `nodejs_compat` polyfills **only** `node:`-prefixed imports (e.g., `node:stream`, `node:util`). It does **not** polyfill bare imports like `stream` or `util`.

> If you see an empty-body 500 on routes that previously worked, the first suspect is a newly added npm package that imports Node.js built-ins at module load time.

## Key Files

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Pages + D1 binding config |
| `src/data/post.ts` | D1 queries and markdown rendering. Uses `micromark` (Worker-safe) |
| `src/utils/webmentions.ts` | Fetches webmentions from webmention.io. Uses in-memory cache only |
| `src/pages/api/diag.ts` | Health-check endpoint: confirms D1 connectivity and post count |
| `src/pages/api/ping.ts` | Minimal liveness check |

## Deployment

```bash
# 1. Build
pnpm run build

# 2. Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=solarcurrents
```

The production URL is `https://solarcurrents.pages.dev`.

## D1 Database

### Check post count
```bash
npx wrangler d1 execute solar-currents-cms-db --remote --command="SELECT COUNT(*) as posts FROM posts;"
```

### Run a migration
```bash
npx wrangler d1 execute solar-currents-cms-db --remote --file=./migrations/0001_create_schema.sql
```

> Do **not** use `BEGIN TRANSACTION` or `SAVEPOINT` in D1 SQL files. D1 handles transactions automatically. If you need atomicity, use the JavaScript `state.storage.transaction()` API in Durable Objects, or rely on D1's automatic behavior.

## Content Model

Posts are stored in D1 with these key fields:

- `posts`: `id`, `title`, `description`, `content`, `slug`, `publish_date`, `updated_date`, `cover_image_src`, `cover_image_alt`, `is_draft`
- `tags`: `id`, `name`
- `post_tags`: join table linking posts to tags

The `content` column contains raw Markdown. `src/data/post.ts` renders it to HTML via `micromark()`.

## Known Issues & Fixes Applied

### 1. `marked` caused empty-body 500s
`marked` imports bare `stream` and `util`, which crash in the Workers runtime. **Fix**: replaced `marked` with `micromark` in `src/data/post.ts`.

### 2. `node:fs` in webmentions caused 500s on blog posts
`src/utils/webmentions.ts` originally read/wrote a local cache file using `node:fs`. Workers have no filesystem, so every blog post page crashed when loading the `<WebMentions />` component. **Fix**: removed `node:fs` entirely; the module now keeps an in-memory cache only.

### 3. D1 binding was missing in `env.production`
`wrangler.toml` previously had D1 config only at the top level, but an `[env.production]` block existed without the binding. Wrangler warned: `"d1_databases" exists at the top level, but not on "env.production"`. **Fix**: simplified `wrangler.toml` to a single top-level config with the D1 binding.

## Adding Dependencies

Before installing any new npm package, verify it does **not** import Node.js built-ins (`fs`, `stream`, `util`, `path`, `crypto`, etc.) unless:

1. It uses `node:` prefixes (e.g., `node:stream`), **and**
2. `compatibility_flags = ["nodejs_compat"]` is set in `wrangler.toml`

After installing, run `pnpm run build` and check the Vite output for warnings like:

```
Automatically externalized node built-in module "stream" imported from ...
```

That warning means the package will likely crash at runtime.

## Diagnostic Endpoints

Use these to verify health after deploy:

| Endpoint | Expected | Checks |
|----------|----------|--------|
| `/api/ping` | `{"ok":true,"time":...}` | Worker is alive |
| `/api/diag` | `{"ok":true,"count":78,...}` | D1 binding + query works |
| `/api/marked-test` | `{"ok":true,"html":"<h1>Hello</h1>"}` | Markdown parser loads |
| `/api/runtime-test` | `{"ok":true,"hasRuntime":true,...}` | `context.locals.runtime.env.DB` exists |

## If the Site 500s Again

1. Check `/api/ping` — if it fails, the Worker itself is broken (likely a module-load crash).
2. Check `/api/diag` — if it fails, D1 is unreachable or the query is broken.
3. Check `/api/marked-test` — if it fails, a markdown dependency regressed.
4. Look at the most recent change: new npm package? New import? New file using `node:fs`?
5. Run `wrangler pages deployment tail --project-name=solarcurrents` to stream live logs.

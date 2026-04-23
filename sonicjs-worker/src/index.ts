/**
 * SonicJS-like CMS Worker for Astro Citrus
 * Runs on Cloudflare Workers with D1 Database
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
}

// Helper to format JSON responses
const jsonResponse = (data: any, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...headers,
    },
  });
};

// Handle CORS preflight
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

// Get all published posts
async function getPublishedPosts(env: Env) {
  const result = await env.DB.prepare(`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.content,
      p.slug,
      p.publish_date as publishDate,
      p.updated_date as updatedDate,
      p.cover_image_src as "coverImage.src",
      p.cover_image_alt as "coverImage.alt",
      GROUP_CONCAT(t.name) as tags
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.is_draft = 0
    GROUP BY p.id
    ORDER BY p.publish_date DESC
  `).all();

  return result.results.map(post => {
    return {
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      coverImage: {
        src: post['coverImage.src'],
        alt: post['coverImage.alt']
      }
    };
  });
}

// Get a single post by slug
async function getPostBySlug(env: Env, slug: string) {
  const result = await env.DB.prepare(`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.content,
      p.slug,
      p.publish_date as publishDate,
      p.updated_date as updatedDate,
      p.cover_image_src as "coverImage.src",
      p.cover_image_alt as "coverImage.alt",
      GROUP_CONCAT(t.name) as tags
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.slug = ? AND p.is_draft = 0
    GROUP BY p.id
  `).bind(slug).first();

  if (!result) return null;

  return {
    ...result,
    tags: result.tags ? result.tags.split(',') : [],
    coverImage: {
      src: result['coverImage.src'],
      alt: result['coverImage.alt']
    }
  };
}

// Get all pages
async function getPages(env: Env) {
  const result = await env.DB.prepare(`
    SELECT 
      id,
      title,
      description,
      content,
      slug
    FROM pages
    WHERE is_draft = 0
    ORDER BY created_at DESC
  `).all();

  return result.results;
}

// Get a single page by slug
async function getPageBySlug(env: Env, slug: string) {
  const result = await env.DB.prepare(`
    SELECT 
      id,
      title,
      description,
      content,
      slug
    FROM pages
    WHERE slug = ? AND is_draft = 0
  `).bind(slug).first();

  return result;
}

// Admin: Create/update post (protected endpoint)
async function upsertPost(env: Env, data: any) {
  const {
    title,
    description,
    content,
    slug,
    publishDate,
    updatedDate,
    coverImage,
    tags = [],
    isDraft = false
  } = data;

  // Start a transaction
  const db = env.DB;
  
  // Insert or update post
  const result = await db.prepare(`
    INSERT OR REPLACE INTO posts (
      id, title, description, content, slug, publish_date, 
      updated_date, cover_image_src, cover_image_alt, is_draft
    ) VALUES (
      (SELECT id FROM posts WHERE slug = ?),
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `).bind(
    slug,
    title,
    description,
    content,
    slug,
    publishDate,
    updatedDate,
    coverImage?.src || null,
    coverImage?.alt || null,
    isDraft ? 1 : 0
  ).run();

  const postId = result.meta.last_row_id;

  // Clear existing tags
  await db.prepare('DELETE FROM post_tags WHERE post_id = ?')
    .bind(postId).run();

  // Add tags
  for (const tagName of tags) {
    // Find or create tag
    let tag = await db.prepare('SELECT id FROM tags WHERE name = ?')
      .bind(tagName).first();
    
    if (!tag) {
      const tagResult = await db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)')
        .bind(tagName, tagName.toLowerCase().replace(/\s+/g, '-')).run();
      tag = { id: tagResult.meta.last_row_id };
    }

    // Link tag to post
    await db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)')
      .bind(postId, tag.id).run();
  }

  return { id: postId, slug };
}

// Main request handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      // Public API Routes
      
      // GET /api/posts - Get all published posts
      if (method === 'GET' && path === '/api/posts') {
        const posts = await getPublishedPosts(env);
        return jsonResponse({ posts });
      }

      // GET /api/posts/:slug - Get single post
      if (method === 'GET' && path.match(/^\/api\/posts\/[^/]+$/)) {
        const slug = path.split('/').pop() || '';
        const post = await getPostBySlug(env, slug);
        
        if (!post) {
          return jsonResponse({ error: 'Post not found' }, 404);
        }
        
        return jsonResponse({ post });
      }

      // GET /api/pages - Get all pages
      if (method === 'GET' && path === '/api/pages') {
        const pages = await getPages(env);
        return jsonResponse({ pages });
      }

      // GET /api/pages/:slug - Get single page
      if (method === 'GET' && path.match(/^\/api\/pages\/[^/]+$/)) {
        const slug = path.split('/').pop() || '';
        const page = await getPageBySlug(env, slug);
        
        if (!page) {
          return jsonResponse({ error: 'Page not found' }, 404);
        }
        
        return jsonResponse({ page });
      }

      // Admin Routes (in production, add authentication)
      
      // POST /api/admin/posts - Create/update post
      if (method === 'POST' && path === '/api/admin/posts') {
        const data = await request.json();
        const result = await upsertPost(env, data);
        return jsonResponse({ success: true, data: result });
      }

      // 404 for unknown routes
      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error) {
      console.error('Error handling request:', error);
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  }
};

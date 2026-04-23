#!/usr/bin/env node
/**
 * Migrate content from Astro Markdown files to SonicJS/D1 database
 * Usage: node sonicjs-worker/scripts/migrate-content.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to the script location
const PROJECT_ROOT = path.join(__dirname, '../../');
const ASTRO_CONTENT_DIR = path.join(PROJECT_ROOT, 'astro-citrus/src/content');
const POSTS_DIR = path.join(ASTRO_CONTENT_DIR, 'post');
const PAGES_DIR = path.join(ASTRO_CONTENT_DIR, 'pages');
const MIGRATION_FILE = path.join(PROJECT_ROOT, 'sonicjs-worker/migrations/0002_seed_content.sql');

// Helper to parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };
  
  const frontmatterStr = match[1];
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  // Simple YAML parser for frontmatter
  const lines = frontmatterStr.split('\n');
  const frontmatter = {};
  let currentKey = null;
  let inNested = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Top-level key
    const topMatch = trimmed.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (topMatch && !inNested) {
      const key = topMatch[1];
      const value = topMatch[2];
      
      if (value === '' || key === 'coverImage') {
        // Start nested object
        frontmatter[key] = {};
        currentKey = key;
        inNested = true;
      } else {
        frontmatter[key] = parseValue(value);
        currentKey = null;
      }
    } else if (inNested && currentKey) {
      // Nested property
      const nestedMatch = trimmed.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (nestedMatch) {
        frontmatter[currentKey][nestedMatch[1]] = parseValue(nestedMatch[2]);
      }
    }
  }
  
  return { frontmatter, body };
}

function parseValue(value) {
  value = value.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    const content = value.slice(1, -1);
    return content.split(',').map(v => v.trim().replace(/^["']|["']$/g, '')).filter(v => v);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function extractData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    if (!frontmatter || !frontmatter.title) return null;
    
    const filename = path.basename(filePath, '.md');
    const slug = frontmatter.slug || filename;
    
    return {
      title: frontmatter.title,
      description: frontmatter.description || '',
      content: body,
      slug,
      publish_date: frontmatter.publishDate ? new Date(frontmatter.publishDate).toISOString() : new Date().toISOString(),
      updated_date: frontmatter.updatedDate ? new Date(frontmatter.updatedDate).toISOString() : null,
      cover_image_src: frontmatter.coverImage?.src || null,
      cover_image_alt: frontmatter.coverImage?.alt || null,
      tags: frontmatter.tags || [],
      is_draft: frontmatter.draft || false
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function findMarkdownFiles(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...findMarkdownFiles(fullPath));
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory doesn't exist
  }
  return files;
}

async function generateMigration() {
  console.log('🔍 Scanning for content files...\n');
  
  const postFiles = findMarkdownFiles(POSTS_DIR);
  console.log(`Found ${postFiles.length} post files`);
  
  const posts = [];
  for (const filePath of postFiles) {
    const data = extractData(filePath);
    if (data) posts.push(data);
  }
  
  const pageFiles = findMarkdownFiles(PAGES_DIR);
  const pages = [];
  for (const filePath of pageFiles) {
    const data = extractData(filePath);
    if (data) pages.push(data);
  }
  
  console.log(`✓ ${posts.length} posts, ${pages.length} pages ready\n`);
  
  // Generate SQL
  let sql = '-- Auto-generated migration from Astro content\n';
  sql += '-- Generated at: ' + new Date().toISOString() + '\n\n';
  sql += 'BEGIN TRANSACTION;\n\n';
  
  const escape = (str) => str ? str.replace(/'/g, "''").replace(/\$/g, '$$$$') : '';
  
  for (const post of posts) {
    sql += `-- Post: ${post.title}\n`;
    sql += `INSERT INTO posts (title, description, content, slug, publish_date, updated_date, cover_image_src, cover_image_alt, is_draft) VALUES (`;
    sql += `'${escape(post.title)}', '${escape(post.description)}', '${escape(post.content)}', '${escape(post.slug)}', '${post.publish_date}', `;
    sql += `${post.updated_date ? `'${post.updated_date}'` : 'NULL'}, `;
    sql += `${post.cover_image_src ? `'${escape(post.cover_image_src)}'` : 'NULL'}, `;
    sql += `${post.cover_image_alt ? `'${escape(post.cover_image_alt)}'` : 'NULL'}, `;
    sql += `${post.is_draft ? '1' : '0'});\n`;
    
    const postId = 'last_insert_rowid()';
    for (const tag of post.tags) {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
      sql += `INSERT OR IGNORE INTO tags (name, slug) VALUES ('${escape(tag)}', '${escape(tagSlug)}');\n`;
      sql += `INSERT INTO post_tags (post_id, tag_id) VALUES (${postId}, (SELECT id FROM tags WHERE slug = '${escape(tagSlug)}'));\n`;
    }
    sql += '\n';
  }
  
  for (const page of pages) {
    sql += `-- Page: ${page.title}\n`;
    sql += `INSERT INTO pages (title, description, content, slug, is_draft) VALUES ('${escape(page.title)}', '${escape(page.description)}', '${escape(page.content)}', '${escape(page.slug)}', ${page.is_draft ? '1' : '0'});\n\n`;
  }
  
  sql += 'COMMIT;\n';
  
  fs.mkdirSync(path.dirname(MIGRATION_FILE), { recursive: true });
  fs.writeFileSync(MIGRATION_FILE, sql);
  
  console.log(`✅ Migration file created: ${MIGRATION_FILE}`);
  console.log(`   - ${posts.length} posts`);
  console.log(`   - ${pages.length} pages`);
}

// Run the migration generator
generateMigration().catch(error => {
  console.error('❌ Migration generation failed:', error);
  process.exit(1);
});

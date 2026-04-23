#!/usr/bin/env node
/**
 * Converts Ghost/Contentful-style frontmatter to Astro Citrus format
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = './astro-citrus/src/content/post';

// Helper to format date for Astro Citrus
function formatDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// Helper to parse frontmatter manually
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: null, body: content };
  
  try {
    const frontmatterStr = match[1];
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Parse the YAML-like frontmatter manually
    const lines = frontmatterStr.split('\n');
    const frontmatter = {};
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        value = arrayContent.split(',').map(item => 
          item.trim().replace(/^["']|["']$/g, '')
        ).filter(item => item);
      }
      
      frontmatter[key] = value;
    }
    
    return { frontmatter, body };
  } catch (e) {
    console.error('Failed to parse frontmatter:', e);
    return { frontmatter: null, body: content };
  }
}

// Convert frontmatter format
function convertFrontmatter(oldFM) {
  const newFM = {
    title: oldFM.title,
    description: oldFM.meta_description || oldFM.description || 'A post about solar energy',
    publishDate: formatDate(oldFM.published_at),
  };

  // Add updated date if it exists
  if (oldFM.updated_at) {
    newFM.updatedDate = formatDate(oldFM.updated_at);
  }

  // Convert cover image if it exists
  if (oldFM.feature_image) {
    newFM.coverImage = {
      src: oldFM.feature_image,
      alt: oldFM.feature_image_alt || oldFM.title || 'Cover image'
    };
  }

  // Copy tags if they exist
  if (oldFM.tags && Array.isArray(oldFM.tags)) {
    newFM.tags = oldFM.tags;
  } else if (typeof oldFM.tags === 'string') {
    // Parse comma-separated string
    newFM.tags = oldFM.tags.split(',').map(tag => tag.trim());
  }

  return newFM;
}

// Process a single file
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    if (!frontmatter || !frontmatter.published_at) {
      console.log(`Skipping ${filePath}: No Ghost/Contentful frontmatter found`);
      return false;
    }

    const newFrontmatter = convertFrontmatter(frontmatter);
    
    // Build new content with YAML format instead of JSON
    const yamlLines = [];
    yamlLines.push(`title: "${newFrontmatter.title.replace(/"/g, '\\"')}"`);
    yamlLines.push(`description: "${newFrontmatter.description.replace(/"/g, '\\"')}"`);
    yamlLines.push(`publishDate: "${newFrontmatter.publishDate}"`);
    
    if (newFrontmatter.updatedDate) {
      yamlLines.push(`updatedDate: "${newFrontmatter.updatedDate}"`);
    }
    
    if (newFrontmatter.coverImage) {
      yamlLines.push('coverImage:');
      yamlLines.push(`  src: "${newFrontmatter.coverImage.src}"`);
      yamlLines.push(`  alt: "${newFrontmatter.coverImage.alt.replace(/"/g, '\\"')}"`);
    }
    
    if (newFrontmatter.tags && newFrontmatter.tags.length > 0) {
      yamlLines.push(`tags: [${newFrontmatter.tags.map(tag => `"${tag}"`).join(', ')}]`);
    }
    
    const yamlContent = yamlLines.join('\n');
    const newContent = `---\n${yamlContent}\n---\n\n${body}`;
    
    writeFileSync(filePath, newContent);
    console.log(`✓ Converted ${filePath.replace(POSTS_DIR + '/', '')}`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Recursively process all markdown files
function processDirectory(dir) {
  const files = readdirSync(dir);
  let convertedCount = 0;
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      convertedCount += processDirectory(filePath);
    } else if (file.endsWith('.md') && !file.startsWith('.')) {
      if (processFile(filePath)) {
        convertedCount++;
      }
    }
  }
  
  return convertedCount;
}

// Run conversion
console.log('🔄 Converting frontmatter to Astro Citrus format...\n');
try {
  const count = processDirectory(POSTS_DIR);
  console.log(`\n✅ Conversion complete! Converted ${count} posts.`);
} catch (error) {
  console.error('\n❌ Conversion failed:', error.message);
  process.exit(1);
}

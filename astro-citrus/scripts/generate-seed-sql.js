#!/usr/bin/env node
/**
 * Generate SQL seed file from Astro content markdown posts.
 * Reads src/content/post/*.md, parses frontmatter, outputs INSERT statements.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, basename, extname, dirname } from "path";

const POSTS_DIR = "./src/content/post";
const OUTPUT_SQL = "./migrations/0002_seed_posts.sql";

function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return null;

	const lines = match[1].split("\n");
	const fm = {};
	let currentKey = null;
	let indentLevel = 0;
	let inArray = false;
	let arrayValues = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Empty line
		if (!trimmed) continue;

		// Array continuation: tags: ["a", "b"]
		if (inArray) {
			if (trimmed.endsWith("]")) {
				const val = trimmed.slice(0, -1);
				if (val) arrayValues.push(parseValue(val));
				fm[currentKey] = arrayValues;
				inArray = false;
				arrayValues = [];
			} else {
				const val = trimmed.replace(/,$/, "");
				if (val) arrayValues.push(parseValue(val));
			}
			continue;
		}

		// Check for array start on same line: tags: ["a", "b"]
		const arrayMatch = trimmed.match(/^([^:]+):\s*\[(.*)$/);
		if (arrayMatch) {
			currentKey = arrayMatch[1].trim();
			const rest = arrayMatch[2].trim();
			if (rest.endsWith("]")) {
				const inner = rest.slice(0, -1);
				fm[currentKey] = inner
					.split(",")
					.map((v) => parseValue(v.trim()))
					.filter((v) => v !== "");
			} else {
				inArray = true;
				arrayValues = rest ? [parseValue(rest)] : [];
			}
			continue;
		}

		// Nested object: coverImage: /n  src: "..."
		const colonIndex = trimmed.indexOf(":");
		if (colonIndex === -1) continue;

		const key = trimmed.slice(0, colonIndex).trim();
		const value = trimmed.slice(colonIndex + 1).trim();

		// Check if next line is indented (nested object)
		if (i + 1 < lines.length && lines[i + 1].startsWith("  ") && !lines[i + 1].trim().startsWith("-")) {
			fm[key] = {};
			currentKey = key;
			// Parse nested keys on subsequent lines
			let j = i + 1;
			while (j < lines.length && (lines[j].startsWith("  ") || lines[j].trim() === "")) {
				const nested = lines[j].trim();
				if (!nested) { j++; continue; }
				const nc = nested.indexOf(":");
				if (nc !== -1) {
					const nkey = nested.slice(0, nc).trim();
					const nval = parseValue(nested.slice(nc + 1).trim());
					fm[key][nkey] = nval;
				}
				j++;
			}
			i = j - 1;
		} else {
			fm[key] = parseValue(value);
		}
	}

	return fm;
}

function parseValue(val) {
	if (!val) return "";
	// Remove surrounding quotes
	if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
		return val.slice(1, -1);
	}
	return val;
}

function parseDate(dateStr) {
	if (!dateStr) return null;
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return null;
	// Return ISO date string YYYY-MM-DD
	return d.toISOString().split("T")[0];
}

function escapeSql(str) {
	if (str == null) return "NULL";
	return "'" + String(str).replace(/'/g, "''") + "'";
}

function processDirectory(dir) {
	const files = readdirSync(dir);
	const posts = [];

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);
		if (stat.isDirectory()) {
			posts.push(...processDirectory(filePath));
		} else if (file.endsWith(".md") && !file.startsWith(".")) {
			const content = readFileSync(filePath, "utf8");
			const fm = parseFrontmatter(content);
			if (!fm || !fm.title) {
				console.log(`⚠️ Skipping ${file}: no parseable frontmatter`);
				continue;
			}

			let slug = basename(file, extname(file));
			const parentDir = basename(dirname(filePath));
			// For files in subdirectories, prefix slug with directory name
			if (parentDir !== "post") {
				if (slug === "index") {
					slug = parentDir;
				} else {
					slug = `${parentDir}-${slug}`;
				}
			}
			const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();

			posts.push({
				slug,
				title: fm.title || "",
				description: fm.description || "",
				content: body,
				publishDate: parseDate(fm.publishDate),
				updatedDate: parseDate(fm.updatedDate),
				coverImageSrc: fm.coverImage?.src || null,
				coverImageAlt: fm.coverImage?.alt || null,
				tags: Array.isArray(fm.tags) ? fm.tags : [],
			});
		}
	}

	return posts;
}

console.log("🌱 Generating D1 seed SQL from markdown posts...\n");

const posts = processDirectory(POSTS_DIR);
console.log(`📄 Found ${posts.length} posts\n`);

const sqlLines = [
	"-- D1 seed data generated from src/content/post/*.md",
	"-- Run: wrangler d1 execute solar-currents-cms-db --file=./migrations/0002_seed_posts.sql",
	"",
];

// Collect unique tags
const tagSet = new Set();
for (const post of posts) {
	for (const tag of post.tags) {
		tagSet.add(tag.toLowerCase().trim());
	}
}
const tags = [...tagSet].sort();

// Insert tags first
for (const tag of tags) {
	sqlLines.push(`INSERT OR IGNORE INTO tags (name) VALUES (${escapeSql(tag)});`);
}
sqlLines.push("");

// Insert posts
for (const post of posts) {
	sqlLines.push(
		`INSERT INTO posts (title, description, content, slug, publish_date, updated_date, cover_image_src, cover_image_alt, is_draft) ` +
		`VALUES (${escapeSql(post.title)}, ${escapeSql(post.description)}, ${escapeSql(post.content)}, ${escapeSql(post.slug)}, ${escapeSql(post.publishDate)}, ${escapeSql(post.updatedDate)}, ${escapeSql(post.coverImageSrc)}, ${escapeSql(post.coverImageAlt)}, 0);`,
	);
}
sqlLines.push("");

// Insert post_tags relationships
for (const post of posts) {
	const seenTags = new Set();
	for (const tag of post.tags) {
		const tagName = tag.toLowerCase().trim();
		if (seenTags.has(tagName)) continue;
		seenTags.add(tagName);
		sqlLines.push(
			`INSERT OR IGNORE INTO post_tags (post_id, tag_id) ` +
			`SELECT p.id, t.id FROM posts p, tags t WHERE p.slug = ${escapeSql(post.slug)} AND t.name = ${escapeSql(tagName)};`,
		);
	}
}

sqlLines.push("");

writeFileSync(OUTPUT_SQL, sqlLines.join("\n") + "\n");
console.log(`✅ Seed SQL written to ${OUTPUT_SQL}`);
console.log(`   ${posts.length} posts, ${tags.length} tags`);

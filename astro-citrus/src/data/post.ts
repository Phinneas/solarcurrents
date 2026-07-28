import { micromark } from "micromark";
import getReadingTime from "reading-time";
import type { MarkdownHeading } from "astro";

export interface BlogPost {
	id: string;
	data: {
		title: string;
		description: string;
		publishDate: Date;
		updatedDate?: Date;
		coverImage?: {
			src: string;
			alt: string;
		};
		tags: string[];
		draft?: boolean;
		seriesId?: string;
		ogImage?: string;
		readingTime?: string;
	};
	body: string;
	headings: MarkdownHeading[];
}

interface D1PostRow {
	id: number;
	title: string;
	description: string;
	content: string;
	slug: string;
	publishDate: string;
	updatedDate: string | null;
	coverImageSrc: string | null;
	coverImageAlt: string | null;
	tags: string | null;
}

function parsePostRow(row: D1PostRow): BlogPost {
	const publishDate = new Date(row.publishDate);
	const updatedDate = row.updatedDate ? new Date(row.updatedDate) : undefined;

	return {
		id: row.slug,
		data: {
			title: row.title,
			description: row.description,
			publishDate,
			updatedDate,
			coverImage:
				row.coverImageSrc
					? {
							src: row.coverImageSrc,
							alt: row.coverImageAlt || "",
						}
					: undefined,
			tags: row.tags ? row.tags.split(",") : [],
			draft: false,
			readingTime: getReadingTime(row.content).text,
		},
		body: row.content,
		headings: extractHeadings(row.content),
	};
}

function extractHeadings(content: string): MarkdownHeading[] {
	const headings: MarkdownHeading[] = [];
	const lines = content.split("\n");
	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (match) {
			const depth = match[1].length;
			const text = match[2].trim();
			const slug = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");
			headings.push({ depth, slug, text });
		}
	}
	return headings;
}

export async function renderPost(content: string): Promise<{ html: string; readingTime: string }> {
	const html = micromark(content);
	const readingTime = getReadingTime(content).text;
	return { html, readingTime };
}

export async function getAllPosts(db: D1Database): Promise<BlogPost[]> {
	const result = await db
		.prepare(
			`
			SELECT
				p.id,
				p.title,
				p.description,
				p.content,
				p.slug,
				p.publish_date as publishDate,
				p.updated_date as updatedDate,
				p.cover_image_src as coverImageSrc,
				p.cover_image_alt as coverImageAlt,
				GROUP_CONCAT(t.name) as tags
			FROM posts p
			LEFT JOIN post_tags pt ON p.id = pt.post_id
			LEFT JOIN tags t ON pt.tag_id = t.id
			WHERE p.is_draft = 0
			GROUP BY p.id
			ORDER BY p.publish_date DESC
			`,
		)
		.all<D1PostRow>();

	return (result.results || []).map(parsePostRow);
}

export async function getPostBySlug(db: D1Database, slug: string): Promise<BlogPost | null> {
	const row = await db
		.prepare(
			`
			SELECT
				p.id,
				p.title,
				p.description,
				p.content,
				p.slug,
				p.publish_date as publishDate,
				p.updated_date as updatedDate,
				p.cover_image_src as coverImageSrc,
				p.cover_image_alt as coverImageAlt,
				GROUP_CONCAT(t.name) as tags
			FROM posts p
			LEFT JOIN post_tags pt ON p.id = pt.post_id
			LEFT JOIN tags t ON pt.tag_id = t.id
			WHERE p.slug = ? AND p.is_draft = 0
			GROUP BY p.id
			`,
		)
		.bind(slug)
		.first<D1PostRow>();

	if (!row) return null;
	return parsePostRow(row);
}

export async function getPostsByTag(db: D1Database, tag: string): Promise<BlogPost[]> {
	const result = await db
		.prepare(
			`
			SELECT
				p.id,
				p.title,
				p.description,
				p.content,
				p.slug,
				p.publish_date as publishDate,
				p.updated_date as updatedDate,
				p.cover_image_src as coverImageSrc,
				p.cover_image_alt as coverImageAlt,
				GROUP_CONCAT(t2.name) as tags
			FROM posts p
			JOIN post_tags pt ON p.id = pt.post_id
			JOIN tags t ON pt.tag_id = t.id
			LEFT JOIN post_tags pt2 ON p.id = pt2.post_id
			LEFT JOIN tags t2 ON pt2.tag_id = t2.id
			WHERE t.name = ? AND p.is_draft = 0
			GROUP BY p.id
			ORDER BY p.publish_date DESC
			`,
		)
		.bind(tag)
		.all<D1PostRow>();

	return (result.results || []).map(parsePostRow);
}

export async function getAllTags(db: D1Database): Promise<string[]> {
	const result = await db.prepare("SELECT name FROM tags ORDER BY name").all<{ name: string }>();
	return (result.results || []).map((r) => r.name);
}

export function groupPostsByYear(posts: BlogPost[]) {
	return posts.reduce<Record<string, BlogPost[]>>((acc, post) => {
		const year = post.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

export function getAllTagsFromPosts(posts: BlogPost[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

export function getUniqueTags(posts: BlogPost[]) {
	return [...new Set(getAllTagsFromPosts(posts))];
}

export function getUniqueTagsWithCount(posts: BlogPost[]): [string, number][] {
	return [...getAllTagsFromPosts(posts).reduce(
		(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
		new Map<string, number>(),
	)].sort((a, b) => b[1] - a[1]);
}

export function collectionDateSort(a: BlogPost, b: BlogPost) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

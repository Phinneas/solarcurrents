import { getCollection, type CollectionEntry } from "astro:content";
import { micromark } from "micromark";
import type { MarkdownHeading } from "astro";
import { getReadingTime } from "@/utils/reading-time";

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

function entryToBlogPost(entry: CollectionEntry<"post">): BlogPost {
	const id = entry.id.replace(/\.md$/, "");
	return {
		id,
		data: {
			title: entry.data.title,
			description: entry.data.description,
			publishDate: entry.data.publishDate,
			updatedDate: entry.data.updatedDate,
			coverImage: entry.data.coverImage,
			tags: entry.data.tags || [],
			draft: entry.data.draft,
			seriesId: entry.data.seriesId,
			ogImage: entry.data.ogImage,
			readingTime: getReadingTime(entry.body || "").text,
		},
		body: entry.body || "",
		headings: extractHeadings(entry.body || ""),
	};
}

export async function getAllPosts(): Promise<BlogPost[]> {
	const entries = await getCollection("post");
	return entries
		.filter((e) => !e.data.draft)
		.map(entryToBlogPost)
		.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const entries = await getCollection("post");
	const entry = entries.find((e) => e.id.replace(/\.md$/, "") === slug && !e.data.draft);
	if (!entry) return null;
	return entryToBlogPost(entry);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
	const posts = await getAllPosts();
	return posts.filter((p) => p.data.tags.includes(tag.toLowerCase()));
}

export async function getAllTags(): Promise<string[]> {
	const entries = await getCollection("post");
	const tagSet = new Set<string>();
	for (const entry of entries) {
		if (entry.data.draft) continue;
		for (const tag of entry.data.tags || []) {
			tagSet.add(tag.toLowerCase());
		}
	}
	return [...tagSet].sort();
}

export async function renderPost(content: string): Promise<{ html: string; readingTime: string }> {
	const html = micromark(content);
	const readingTime = getReadingTime(content).text;
	return { html, readingTime };
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

import { getCollection, type CollectionEntry } from "astro:content";
import { micromark } from "micromark";
import type { MarkdownHeading } from "astro";
import { getReadingTime } from "@/utils/reading-time";

export interface Newsletter {
	id: string;
	data: {
		title: string;
		description: string;
		publishDate: Date;
		updatedDate?: Date | undefined;
		coverImage?: {
			src: string;
			alt: string;
		} | undefined;
		tags: string[];
		draft?: boolean | undefined;
		readingTime?: string | undefined;
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
			const depth = match[1]!.length;
			const text = match[2]!.trim();
			const slug = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");
			headings.push({ depth, slug, text });
		}
	}
	return headings;
}

function entryToNewsletter(entry: CollectionEntry<"newsletter">): Newsletter {
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
			readingTime: getReadingTime(entry.body || "").text,
		},
		body: entry.body || "",
		headings: extractHeadings(entry.body || ""),
	};
}

export async function getAllNewsletters(): Promise<Newsletter[]> {
	const entries = await getCollection("newsletter");
	return entries
		.filter((e) => !e.data.draft)
		.map(entryToNewsletter)
		.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getNewsletterBySlug(slug: string): Promise<Newsletter | null> {
	const entries = await getCollection("newsletter");
	const entry = entries.find((e) => e.id.replace(/\.md$/, "") === slug && !e.data.draft);
	if (!entry) return null;
	return entryToNewsletter(entry);
}

export async function renderNewsletter(content: string): Promise<{ html: string; readingTime: string }> {
	const html = micromark(content);
	const readingTime = getReadingTime(content).text;
	return { html, readingTime };
}

export function groupNewslettersByYear(newsletters: Newsletter[]) {
	return newsletters.reduce<Record<string, Newsletter[]>>((acc, nl) => {
		const year = nl.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(nl);
		return acc;
	}, {});
}

import { WEBMENTION_API_KEY } from "astro:env/server";
import type { WebmentionsCache, WebmentionsChildren, WebmentionsFeed } from "@/types";

const DOMAIN = import.meta.env.SITE;
const validWebmentionTypes = ["like-of", "mention-of", "in-reply-to"];

const hostName = DOMAIN ? new URL(DOMAIN).hostname : "";

// Calls webmention.io api.
async function fetchWebmentions(timeFrom: string | null, perPage = 1000) {
	if (!DOMAIN) {
		console.warn("No domain specified. Please set in astro.config.ts");
		return null;
	}

	if (!WEBMENTION_API_KEY) {
		console.warn("No webmention api token specified in .env");
		return null;
	}

	let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${WEBMENTION_API_KEY}&sort-dir=up&per-page=${perPage}`;

	if (timeFrom) url += `&since${timeFrom}`;

	const res = await fetch(url);

	if (res.ok) {
		const data = (await res.json()) as WebmentionsFeed;
		return data;
	}

	return null;
}

// Merge cached entries [a] with fresh webmentions [b], merge by wm-id
function mergeWebmentions(a: WebmentionsCache, b: WebmentionsFeed): WebmentionsChildren[] {
	return Array.from(
		[...a.children, ...b.children]
			.reduce((map, obj) => map.set(obj["wm-id"], obj), new Map())
			.values(),
	);
}

// filter out WebmentionChildren
export function filterWebmentions(webmentions: WebmentionsChildren[]) {
	return webmentions.filter((webmention) => {
		// make sure the mention has a property so we can sort them later
		if (!validWebmentionTypes.includes(webmention["wm-property"])) return false;

		// make sure 'mention-of' or 'in-reply-to' has text content.
		if (webmention["wm-property"] === "mention-of" || webmention["wm-property"] === "in-reply-to") {
			return webmention.content && webmention.content.text !== "";
		}

		return true;
	});
}

// In-memory cache (persists for the lifetime of the Worker instance)
let memoryCache: WebmentionsCache | null = null;

async function getAndCacheWebmentions() {
	const cache = memoryCache ?? { lastFetched: null, children: [] };
	const mentions = await fetchWebmentions(cache.lastFetched);

	if (mentions) {
		mentions.children = filterWebmentions(mentions.children);
		const merged: WebmentionsCache = {
			lastFetched: new Date().toISOString(),
			// Make sure the first arg is the cache
			children: mergeWebmentions(cache, mentions),
		};

		memoryCache = merged;
		return merged;
	}

	return cache;
}

let webMentions: WebmentionsCache | undefined;

export async function getWebmentionsForUrl(url: string) {
	if (!webMentions) webMentions = await getAndCacheWebmentions();

	return webMentions.children.filter((entry) => entry["wm-target"] === url);
}

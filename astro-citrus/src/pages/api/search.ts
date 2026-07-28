import type { APIContext } from "astro";
import { getAllPosts } from "@/data/post";

export async function GET(context: APIContext) {
	const url = new URL(context.request.url);
	const q = url.searchParams.get("q")?.trim().toLowerCase();

	if (!q || q.length < 2) {
		return new Response(JSON.stringify({ results: [] }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const posts = await getAllPosts();

		const results = posts
			.filter((post) => {
				const haystack = `${post.data.title} ${post.data.description} ${post.body}`.toLowerCase();
				return haystack.includes(q);
			})
			.map((post) => ({
				slug: post.id,
				title: post.data.title,
				description: post.data.description,
				url: `/posts/${post.id}/`,
				tags: post.data.tags,
			}))
			.slice(0, 20);

		return new Response(JSON.stringify({ results }), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=60",
			},
		});
	} catch (error) {
		console.error("Search error:", error);
		return new Response(JSON.stringify({ results: [], error: "Search unavailable" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

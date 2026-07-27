import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const url = new URL(context.request.url);
	const q = url.searchParams.get("q")?.trim();

	if (!q || q.length < 2) {
		return new Response(JSON.stringify({ results: [] }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const db = context.locals.runtime.env.DB;
		const like = `%${q}%`;

		const result = await db
			.prepare(
				`
				SELECT
					p.slug,
					p.title,
					p.description,
					p.publish_date as publishDate,
					GROUP_CONCAT(t.name) as tags
				FROM posts p
				LEFT JOIN post_tags pt ON p.id = pt.post_id
				LEFT JOIN tags t ON pt.tag_id = t.id
				WHERE p.is_draft = 0
					AND (p.title LIKE ? OR p.description LIKE ? OR p.content LIKE ?)
				GROUP BY p.id
				ORDER BY p.publish_date DESC
				LIMIT 20
				`,
			)
			.bind(like, like, like)
			.all<{ slug: string; title: string; description: string; publishDate: string; tags: string | null }>();

		const results = (result.results || []).map((row) => ({
			slug: row.slug,
			title: row.title,
			description: row.description,
			url: `/posts/${row.slug}/`,
			tags: row.tags ? row.tags.split(",") : [],
		}));

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

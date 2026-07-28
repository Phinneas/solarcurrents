import type { APIContext } from "astro";
import { getAllPosts } from "@/data/post";

export async function GET(context: APIContext) {
	try {
		const posts = await getAllPosts();
		return new Response(
			JSON.stringify({ ok: true, count: posts.length, firstSlug: posts[0]?.id }),
			{ headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		return new Response(
			JSON.stringify({ ok: false, error: error?.message, stack: error?.stack }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export const GET = async (context: APIContext) => {
	const db = context.locals.runtime.env.DB;
	const posts = await getAllPosts(db);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site ?? "https://www.solarcurrents.co",
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `posts/${post.id}/`,
		})),
	});
};

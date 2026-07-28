import { micromark } from "micromark";

export async function GET() {
	try {
		const html = micromark("# Hello");
		return new Response(JSON.stringify({ ok: true, html }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		return new Response(
			JSON.stringify({ ok: false, error: error?.message, stack: error?.stack }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

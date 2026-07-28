export async function GET(context: any) {
	try {
		const hasRuntime = !!context.locals?.runtime;
		const hasEnv = !!context.locals?.runtime?.env;
		const hasDB = !!context.locals?.runtime?.env?.DB;
		return new Response(
			JSON.stringify({ ok: true, hasRuntime, hasEnv, hasDB }),
			{ headers: { "Content-Type": "application/json" } }
		);
	} catch (error: any) {
		return new Response(
			JSON.stringify({ ok: false, error: error?.message }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

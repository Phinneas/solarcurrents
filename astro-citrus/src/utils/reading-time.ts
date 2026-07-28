export function getReadingTime(text: string): { text: string } {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.ceil(words / 200));
	return { text: `${minutes} min read` };
}

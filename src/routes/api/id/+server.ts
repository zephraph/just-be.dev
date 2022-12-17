import { timeSchema, ulid, TIME_MAX } from '$lib/ulid';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const url = new URL(request.url);
	const time = parseInt(url.searchParams.get('time') || '0', 10) || Date.now();
	if (!timeSchema.safeParse(time).success) {
		throw error(400, `time must be between 1 and ${TIME_MAX}`);
	}
	const count = parseInt(url.searchParams.get('count') || '1', 10);
	if (count < 1) {
		throw error(400, 'count must be at least 1');
	}

	return json(
		count == 1
			? { id: ulid(time) }
			: { ids: new Array(count).fill(time).map((t, i) => ulid(t + i)) }
	);
};

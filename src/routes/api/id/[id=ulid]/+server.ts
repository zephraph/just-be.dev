import { ulid, decodeTime } from '$lib/ulid';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;
	const time = decodeTime(id);
	return json({
		id,
		time: decodeTime(id),
		date: new Date(time).toISOString(),
		next: ulid(time + 1)
	});
};
